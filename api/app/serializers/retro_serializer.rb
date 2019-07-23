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
class RetroSerializer
  ALLOWED_FIELDS = [
    :created_at,
    :highlighted_item_id,
    :id,
    :is_private,
    :name,
    :retro_item_end_time,
    :send_archive_email,
    :slug,
    :updated_at,
    :user_id,
    :video_link
  ].freeze

  ASSOCIATIONS = {
    action_items: {}.freeze,
    archives: { only: :id }.freeze,
    items: {}.freeze
  }.freeze

  def initialize(retro)
    @retro = retro
  end

  def as_json
    @retro.as_json(include: ASSOCIATIONS, only: ALLOWED_FIELDS)
  end
end
