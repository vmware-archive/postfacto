#
# Postfacto, a free, open-source and self-hosted retro tool aimed at helping
# remote teams.
#
# Copyright (C) 2016 - Present Pivotal Software, Inc.
#
# This program is free software: you can redistribute it and/or modify
#
# it under the terms of the GNU Affero General Public License as
#
# published by the Free Software Foundation, either version 3 of the
#
# License, or (at your option) any later version.
#
#
#
# This program is distributed in the hope that it will be useful,
#
# but WITHOUT ANY WARRANTY; without even the implied warranty of
#
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#
# GNU Affero General Public License for more details.
#
#
#
# You should have received a copy of the GNU Affero General Public License
#
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
#
require 'rails_helper'

describe '/retros/:id/sessions' do
  let(:retro) do
    Retro.create!(name: 'My Retro', password: 'the-password', video_link: 'the-video-link', is_private: false)
  end

  describe 'GET /new' do
    it 'returns retro ID and name' do
      get new_retro_session_path(retro), params: {}, as: :json
      expect(status).to eq(200)
      data = JSON.parse(response.body)
      expect(data['retro']['id']).to be_kind_of(Integer)
      expect(data['retro']['name']).to eq('My Retro')
    end
  end

  describe 'POST /' do
    context 'if password is correct' do
      it 'responds with 200' do
        post retro_sessions_path(retro) + '/', params: { retro: { password: 'the-password' } }, as: :json
        expect(status).to eq(200)
      end

      it 'responds with a token' do
        post retro_sessions_path(retro) + '/', params: { retro: { password: 'the-password' } }, as: :json

        data = JSON.parse(response.body)
        jwt = JWT.decode(data['token'], nil, false)

        expect(jwt[0]['sub']).to eq(retro.slug)
        expect(jwt[0]['iss']).to eq('retros')
        expect(jwt[1]['alg']).to eq('HS256')
      end

      context 'when there is a session time' do
        let(:session_time) { 1.seconds }

        before do
          allow(Rails.configuration).to receive(:session_time).and_return(session_time)
          allow(CLOCK).to receive(:current_time).and_return(Time.now)
        end

        it 'responds with an expiring token' do
          post retro_sessions_path(retro) + '/', params: { retro: { password: 'the-password' } }, as: :json

          data = JSON.parse(response.body)
          jwt = JWT.decode(data['token'], nil, false)

          expect(jwt[0]['exp'].to_i).to eq((CLOCK.current_time + session_time).to_i)
        end
      end
    end

    context 'if password is incorrect' do
      it 'responds with forbidden' do
        post retro_sessions_path(retro) + '/', params: { retro: { password: 'anything-else' } }, as: :json
        expect(status).to eq(403)
      end
    end
  end
end
