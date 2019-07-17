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
require 'cf-app-utils'

class RedisConfigurationProvider
  def redis_config
    return nil unless ENV['RAILS_ENV'] == 'production'
    return ENV['REDIS_URL'] unless ENV['REDIS_URL'].nil?

    unless ENV['VCAP_SERVICES'].nil?
      c = CF::App::Credentials.find_by_service_tag('redis')
      host = c['hostname'] || c.fetch('host')
      Addressable::URI.new(
        scheme: 'redis',
        host: host,
        password: c['password'],
        port: c.fetch('port')
      ).normalize.to_s
    end
  end
end
