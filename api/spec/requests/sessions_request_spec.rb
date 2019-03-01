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
      it 'responds with 200 and returns token' do
        post retro_sessions_path(retro) + '/', params: { retro: { password: 'the-password' } }, as: :json
        expect(status).to eq(200)
        data = JSON.parse(response.body)
        expect(data['token']).to_not be_blank
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
