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

describe EndWithHappiestRule do
  let(:retro) {
    user = User.create!(email: 'me@example.com')
    Retro.create!(name: 'My Retro', user: user)
  }

  it 'should move happiest item to end' do
    most_happy = Item.create!(retro: retro, description: 'Item B', category: :happy, vote_count: 20)
    happy = Item.create!(retro: retro, description: 'Item C', category: :happy, vote_count: 10)
    meh = Item.create!(retro: retro, description: 'Item A', category: :meh, vote_count: 1)

    items = EndWithHappiestRule.new.apply(retro, retro.items)

    expect(items).to eq([happy, meh, most_happy])
  end

  it 'should do nothing when no happy items' do
    meh = Item.create!(retro: retro, description: 'Item A', category: :meh, vote_count: 1)

    items = EndWithHappiestRule.new.apply(retro, retro.items)

    expect(items).to eq([meh])
  end
end
