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
class RetroSessionService
  include Singleton

  def add_retro_consumer(retro_id, request_uuid)
    @retro_to_sessions[retro_id] = get_retro_consumers(retro_id) << request_uuid
  end

  def get_retro_consumers(retro_id)
    @retro_to_sessions[retro_id] ||= []
  end

  def remove_retro_consumer(retro_id, request_uuid)
    @retro_to_sessions[retro_id] = get_retro_consumers(retro_id) - [request_uuid]
  end

  def clear!
    @retro_to_sessions.clear
  end

  private

  def initialize
    @retro_to_sessions = {}
  end
end
