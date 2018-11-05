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

describe 'retros/:retro_id/archives' do
  let(:retro) { Retro.create!(name: 'My Retro', password: 'the-password', video_link: 'the-video-link') }
  let(:token) { ActionController::HttpAuthentication::Token.encode_credentials(token_for(retro)) }

  before do
    retro.items.create!(description: 'The Item', category: 'happy')
    retro.action_items.create!(description: 'The Action Item', done: true)
    put retro_path(retro) + '/archive', headers: { HTTP_AUTHORIZATION: token }, as: :json
  end

  describe 'GET /' do
    it 'should return all archives of the given retro' do
      get retro_archives_path(retro), headers: { HTTP_AUTHORIZATION: token }, as: :json

      expect(response).to be_ok

      data = JSON.parse(response.body, symbolize_names: true)
      expect(data[:archives].count).to_not eq(0)
      expect(data[:archives][0][:id]).to eq(retro.reload.archives.last.id)
    end

    context 'without proper authentication' do
      it 'returns 403' do
        get retro_archives_path(retro), as: :json
        expect(response).to be_forbidden
      end
    end
  end

  describe 'GET /:id' do
    it 'should return all items and action items archived' do
      archive = retro.reload.archives.last
      get retro_archive_path(retro, archive), headers: { HTTP_AUTHORIZATION: token }, as: :json

      expect(response).to be_ok
      data = JSON.parse(response.body, symbolize_names: true)
      expect(data[:retro][:id]).to eq(retro.id)
      expect(data[:retro][:name]).to eq('My Retro')
      expect(data[:retro][:items][0][:description]).to eq('The Item')
      expect(data[:retro][:action_items][0][:description]).to eq('The Action Item')
    end

    context 'without proper authentication' do
      it 'returns 403' do
        archive = retro.reload.archives.last
        get retro_archive_path(retro, archive), as: :json

        expect(response).to be_forbidden
      end
    end

    context 'access archive with wrong retro id' do
      let(:wrong_retro) { Retro.create!(name: 'My Retro', video_link: 'the-video-link') }

      it 'responds with a http 403 json string' do
        archive = retro.reload.archives.last
        get retro_archive_path(wrong_retro, archive), as: :json

        expect(response).to be_forbidden
        expect(response.content_type).to eq('application/json')

        expect(JSON.parse(response.body)).to eq({})
      end
    end
  end
end
