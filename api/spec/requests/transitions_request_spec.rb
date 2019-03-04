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

describe '/retros/:retro_id/discussion/transitions' do
  let(:retro) { Retro.create!(name: 'My Retro', password: 'the-password', video_link: 'the-video-link') }
  let(:token) { ActionController::HttpAuthentication::Token.encode_credentials(token_for(retro)) }

  describe 'POST' do
    it 'selects next item when no previous item highlighted' do
      allow(RetrosChannel).to receive_messages(broadcast: {})
      item = retro.items.create!(description: 'first item', category: :happy)

      post retro_path(retro) + '/discussion/transitions',
           headers: { HTTP_AUTHORIZATION: token },
           params: { transition: 'NEXT' },
           as: :json

      retro.reload
      expect(retro.highlighted_item_id).to eq(item.id)

      expect(RetrosChannel).to have_received(:broadcast).with(retro).ordered
      data = JSON.parse(response.body)
      expect(data['retro']['highlighted_item_id']).to eq(item.id)
      expect(data['retro']['retro_item_end_time']).not_to be_nil
    end

    it 'marks previously hilighted item as done if there was one' do
      allow(RetrosChannel).to receive_messages(broadcast: {})
      item = retro.items.create!(description: 'first item', done: true, category: :happy)
      item2 = retro.items.create!(description: 'second item', category: :meh)
      retro.highlighted_item_id = item.id

      post retro_path(retro) + '/discussion/transitions',
           headers: { HTTP_AUTHORIZATION: token },
           params: { transition: 'NEXT' },
           as: :json

      retro.reload

      expect(retro.highlighted_item_id).to eq(item2.id)
      expect(RetrosChannel).to have_received(:broadcast).with(retro).ordered
      data = JSON.parse(response.body)
      expect(data['retro']['highlighted_item_id']).to eq(item2.id)
      expect(data['retro']['retro_item_end_time']).not_to be_nil
    end

    it 'sets highlighted item to nil if the last item was finished' do
      allow(RetrosChannel).to receive_messages(broadcast: {})
      item = retro.items.create!(description: 'first item', done: true, category: :happy)
      retro.highlighted_item_id = item.id

      post retro_path(retro) + '/discussion/transitions',
           headers: { HTTP_AUTHORIZATION: token },
           params: { transition: 'NEXT' },
           as: :json

      retro.reload

      expect(retro.highlighted_item_id).to eq(nil)
      data = JSON.parse(response.body)
      expect(data['retro']['highlighted_item_id']).to be_nil
      expect(data['retro']['retro_item_end_time']).to be_nil
    end

    it 'fails with 400 when transition is not NEXT' do
      post retro_path(retro) + '/discussion/transitions',
           headers: { HTTP_AUTHORIZATION: token },
           params: { transition: 'SOME_OTHER_TRANSITION' },
           as: :json

      expect(response.status).to eq(400)
    end
  end
end
