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
require 'spec_helper'
require 'clients/giphy_client'

describe GiphyClient do
  describe '.get_gif!' do
    it 'fetches gif by query from giphy' do
      stub_request(:get, 'http://www.example.com')
        .with(query: {
                api_key: 'xyz123',
                q: 'test-query',
                limit: 1,
                offset: 0,
                rating: 'G',
                lang: 'en'
              })
        .to_return(
              body: '{"data": [{"images":{"fixed_width":{"url":"http://giphy/gif"}}}]}',
              status: 200
            )

      gif_url = GiphyClient.new('http://www.example.com', 'xyz123').get_gif! 'test-query'

      expect(gif_url).to eq('http://giphy/gif')
    end
  end
end
