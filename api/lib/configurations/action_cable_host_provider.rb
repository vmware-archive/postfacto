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
require 'uri'

class ActionCableHostProvider
  def host
    return ENV['ACTION_CABLE_HOST'] unless ENV['ACTION_CABLE_HOST'].nil?

    unless ENV['VCAP_APPLICATION'].nil?
      uri = JSON.parse(ENV['VCAP_APPLICATION']).fetch('uris')[0]
      uri = "//#{uri}" if URI(uri).scheme.nil?
      URI.parse(uri).host
    end
  end
end
