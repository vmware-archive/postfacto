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

describe '/retros/:id/settings' do
  let(:retro) do
    Retro.create!(name: 'My Retro', password: 'the-password', video_link: 'the-video-link', is_private: false)
  end
  let(:token) { ActionController::HttpAuthentication::Token.encode_credentials(token_for(retro)) }

  describe 'GET /' do
    context 'when auth header is provided' do
      it 'returns the updated retro' do
        get "/api/retros/#{retro.id}/settings", headers: { HTTP_AUTHORIZATION: token }, as: :json

        expect(response.status).to eq(200)

        data = JSON.parse(response.body)
        expect(data['retro']['name']).to eq('My Retro')
        expect(data['retro']['slug']).to start_with('my-retro')
        expect(data['retro']['id']).to eq(retro.id)
        expect(data['retro']['is_private']).to eq(false)
      end
    end

    context 'when not authenticated' do
      it 'returns forbidden' do
        get "/api/retros/#{retro.id}/settings", headers: {}, as: :json

        expect(response.status).to eq(403)
      end
    end
  end
end
