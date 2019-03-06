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

describe NoDoneItemsRule do
  let(:retro) {
    user = User.create!(email: 'me@example.com')
    Retro.create!(name: 'My Retro', user: user)
  }

  it 'should exclude done retro items' do
    Item.create!(retro: retro, description: 'Item A', done: true, category: :happy, vote_count: 1)
    Item.create!(retro: retro, description: 'Item B', category: :happy, vote_count: 1)

    items = NoDoneItemsRule.new.apply(retro, retro.items)

    expect(items.length).to eq(1)
    expect(items.first.description).to eq('Item B')
  end
end
