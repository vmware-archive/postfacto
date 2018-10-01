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

class GoogleClient
  def initialize(url, hosted_domain)
    @url = url
    @hosted_domain = hosted_domain
  end

  def get_user!(access_token)
    response = RestClient.get(@url, Authorization: "Bearer #{access_token}")
    user = JSON.parse(response.body, symbolize_names: true)

    validate_hosted_domain user

    user
  rescue InvalidUserDomain => e
    raise e
  rescue StandardError
    raise GetUserFailed.new
  end

  def validate_hosted_domain(user)
    if @hosted_domain
      if user[:hd] != @hosted_domain
        raise InvalidUserDomain.new
      end
    end
  end

  class GetUserFailed < StandardError
  end
  class InvalidUserDomain < StandardError
  end
end
