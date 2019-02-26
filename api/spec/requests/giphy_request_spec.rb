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

describe '/retros/:retro_id/giphy' do
  let!(:retro) do
    Retro.create!(name: 'My Retro', password: 'the-password', video_link: 'the-video-link', is_private: true)
  end

  let(:token) { ActionController::HttpAuthentication::Token.encode_credentials(token_for(retro)) }

  describe 'GET /' do
    context 'if password is correct' do
      subject do
        get retro_giphy_path(retro),
            headers: { HTTP_AUTHORIZATION: token },
            params: { q: 'query' },
            as: :json
      end

      it 'returns a gif' do
        expect(GIPHY_CLIENT).to receive(:get_gif!).with('query').and_return('http://gif.url/')
        expect(GIPHY_CLIENT).to receive(:supported?).and_return(true)

        subject

        expect(response.status).to eq(200)
        expect(response.body).to eq('{"url":"http://gif.url/"}')
      end

      context 'giphy is not available' do
        it 'returns 405' do
          expect(GIPHY_CLIENT).to receive(:supported?).and_return(false)

          subject

          expect(response.status).to eq(405)
          expect(response.body).to eq('')
        end
      end
    end

    context 'if password is incorrect' do
      subject do
        get retro_giphy_path(retro), params: { q: 'hello' }, as: :json
      end

      it 'returns 403' do
        subject

        expect(response.status).to eq(403)
      end
    end
  end
end
