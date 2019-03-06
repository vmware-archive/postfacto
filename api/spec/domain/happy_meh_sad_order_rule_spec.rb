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

describe HappyMehSadOrderRule do
  let(:retro) {
    user = User.create!(email: 'me@example.com')
    Retro.create!(name: 'My Retro', user: user)
  }

  it 'should revolve through happy, meh, sad starting from type of previously highlighted item' do
    meh1 = Item.create!(retro: retro, description: 'Meh Item 1', category: :meh, vote_count: 1)
    meh2 = Item.create!(retro: retro, description: 'Meh Item 2', category: :meh, vote_count: 1)
    sad1 = Item.create!(retro: retro, description: 'Sad Item 1', category: :sad, vote_count: 1)
    hap1 = Item.create!(retro: retro, description: 'Happy Item 1', category: :happy, vote_count: 1)
    hap2 = Item.create!(retro: retro, description: 'Happy Item 2', category: :happy, vote_count: 1)
    retro.highlighted_item_id = meh1.id

    items = HappyMehSadOrderRule.new.apply(retro, retro.items)
    expect(items).to eq([sad1, hap1, meh1, hap2, meh2])
  end

  it 'should return first happy when no highlighted item' do
    sad1 = Item.create!(retro: retro, description: 'Sad Item 1', category: :sad, vote_count: 1)
    meh1 = Item.create!(retro: retro, description: 'Meh Item 1', category: :meh, vote_count: 1)
    hap1 = Item.create!(retro: retro, description: 'Happy Item 1', category: :happy, vote_count: 1)

    items = HappyMehSadOrderRule.new.apply(retro, retro.items)
    expect(items).to eq([hap1, meh1, sad1])
  end

  it 'should return first meh when no happy' do
    sad1 = Item.create!(retro: retro, description: 'Sad Item 1', category: :sad, vote_count: 1)
    meh1 = Item.create!(retro: retro, description: 'Meh Item 1', category: :meh, vote_count: 1)

    items = HappyMehSadOrderRule.new.apply(retro, retro.items)
    expect(items).to eq([meh1, sad1])
  end

  it 'should return first sad when no happy or meh' do
    sad1 = Item.create!(retro: retro, description: 'Sad Item 1', category: :sad, vote_count: 1)

    items = HappyMehSadOrderRule.new.apply(retro, retro.items)
    expect(items).to eq([sad1])
  end
end
