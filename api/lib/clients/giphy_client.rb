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
require 'rest-client'

class GiphyClient
  def initialize(url, api_token)
    @url = url
    @api_key = api_token
  end

  def supported?
    !@api_key.nil?
  end

  def get_gif!(query)
    response = RestClient.get(@url, params: {
                                api_key: @api_key,
                                q: query,
                                limit: 1,
                                offset: 0,
                                rating: 'G',
                                lang: 'en'
                              })
    response = JSON.parse(response.body, symbolize_names: true)
    response.dig(:data, 0, :images, :fixed_width, :url)
  end
end
