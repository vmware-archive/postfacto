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
class Item < ActiveRecord::Base
  belongs_to :retro, optional: true
  belongs_to :archive, optional: true

  enum category: { happy: 'happy', meh: 'meh', sad: 'sad' }

  before_destroy :clear_highlight

  def vote!
    increment! :vote_count
  end

  private

  def clear_highlight
    if using_sqlite?
      if retro.highlighted_item_id == id
        retro.highlighted_item_id = nil
        retro.save!
      end
    end
  end

  def using_sqlite?
    return false unless defined? ActiveRecord::ConnectionAdapters::SQLite3Adapter

    ActiveRecord::Base.connection.instance_of? ActiveRecord::ConnectionAdapters::SQLite3Adapter
  end
end
