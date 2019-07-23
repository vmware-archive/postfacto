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

RSpec.describe RetroSerializer do
  context 'for a retro' do
    let!(:retro) do
      Retro.create!(
        created_at: Time.at(0),
        is_private: true,
        name: 'My Retro',
        password: 'the-password',
        updated_at: Time.at(0)
      )
    end
    let!(:item) do
      Item.create!(
        category: Item.categories.fetch(:happy),
        created_at: Time.at(0),
        description: 'Item A',
        retro: retro,
        updated_at: Time.at(0),
        vote_count: 1
      )
    end
    let!(:action_item) do
      ActionItem.create!(
        archived_at: Time.at(0),
        created_at: Time.at(0),
        description: 'Archived action',
        retro: retro,
        updated_at: Time.at(0)
      )
    end
    let!(:archive) do
      Archive.create!(retro: retro)
    end

    it 'includes the basic retro information' do
      payload = RetroSerializer.new(retro).as_json
      expect(payload).to include(
        'id' => retro.id,
        'created_at' => retro.created_at,
        'highlighted_item_id' => retro.highlighted_item_id,
        'is_private' => retro.is_private,
        'name' => retro.name,
        'retro_item_end_time' => retro.retro_item_end_time,
        'send_archive_email' => retro.send_archive_email,
        'slug' => retro.slug,
        'updated_at' => retro.updated_at,
        'user_id' => retro.user_id,
        'video_link' => retro.video_link
      )
    end

    it 'includes items' do
      payload = RetroSerializer.new(retro).as_json
      expect(payload['items']).to eq [item.as_json]
    end

    it 'includes action items' do
      payload = RetroSerializer.new(retro).as_json
      expect(payload['action_items']).to eq [action_item.as_json]
    end

    it 'includes only the archive IDs' do
      payload = RetroSerializer.new(retro).as_json
      expect(payload['archives']).to eq [{ 'id' => archive.id }]
    end

    it 'excludes internal information' do
      payload = RetroSerializer.new(retro).as_json
      expect(payload).not_to include('encrypted_password', 'salt')
    end
  end
end
