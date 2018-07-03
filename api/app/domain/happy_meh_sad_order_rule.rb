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

class HappyMehSadOrderRule
  def initialize(chain = NoOpRule.new)
    @chain = chain
  end

  def apply(retro, items)
    columns = split_columns(items)
    ordered_categories = column_order(retro)

    ordered_items = retro.items.map {
      [columns[ordered_categories[0]].shift,
       columns[ordered_categories[1]].shift,
       columns[ordered_categories[2]].shift].compact
    }
    @chain.apply(retro, ordered_items.flatten)
  end

  def split_columns(items)
    happy, remainder = items.partition { |item| item.category == 'happy' }
    meh, sad = remainder.partition { |item| item.category == 'meh' }
    {
      'happy' => happy,
      'meh' => meh,
      'sad' => sad
    }
  end

  def column_order(retro)
    last_category = 'sad'
    unless retro.highlighted_item_id.nil?
      last_category = retro.items.find(retro.highlighted_item_id).category
    end

    if last_category == 'happy'
      ['meh', 'sad', 'happy']
    elsif last_category == 'meh'
      ['sad', 'happy', 'meh']
    else
      ['happy', 'meh', 'sad']
    end
  end
end
