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
    context 'selecting next item with no previously highlighted item' do
      let!(:item) { retro.items.create!(description: 'first item', category: :happy) }

      it 'selects the next item' do
        do_request
        retro.reload
        expect(retro.highlighted_item_id).to eq(item.id)

        data = JSON.parse(response.body)
        expect(data['retro']['highlighted_item_id']).to eq(item.id)
        expect(data['retro']['retro_item_end_time']).not_to be_nil
      end

      it 'broadcasts the change' do
        expect { do_request }.to have_broadcasted_to(retro).from_channel(RetrosChannel).with(
            hash_including(
                'retro' => hash_including('highlighted_item_id' => item.id)
              )
          )
      end
    end

    context 'select next item with a previously highlighted item' do
      let!(:item) { retro.items.create!(description: 'first item', category: :happy) }
      let!(:item2) { retro.items.create!(description: 'second item', category: :meh) }

      before do
        retro.highlighted_item_id = item.id
        retro.save!
      end

      it 'marks the previous item as done' do
        do_request
        retro.reload

        expect(retro.highlighted_item_id).to eq(item2.id)
        data = JSON.parse(response.body)
        expect(data['retro']['highlighted_item_id']).to eq(item2.id)
        expect(data['retro']['retro_item_end_time']).not_to be_nil
      end

      it 'broadcasts the change' do
        expect { do_request }.to have_broadcasted_to(retro).from_channel(RetrosChannel).with(
            hash_including(
                'retro' => hash_including(
                    'highlighted_item_id' => item2.id,
                    'items' => match_array(
                                   [
                                     hash_including('id' => item.id, 'done' => true),
                                     hash_including('id' => item2.id, 'done' => false)
                                   ]
                                 )
                  )
              )
          )
      end
    end

    context 'selecting next item when on the last item' do
      let!(:item) { retro.items.create!(description: 'first item', done: true, category: :happy) }

      before do
        retro.highlighted_item_id = item.id
        retro.save!
      end

      it 'sets highlighted item to nil if the last item was finished' do
        do_request

        retro.reload

        expect(retro.highlighted_item_id).to eq(nil)
        data = JSON.parse(response.body)
        expect(data['retro']['highlighted_item_id']).to be_nil
        expect(data['retro']['retro_item_end_time']).to be_nil
      end

      it 'broadcasts the change' do
        expect { do_request }.to have_broadcasted_to(retro).from_channel(RetrosChannel).with(
            hash_including(
                'retro' => hash_including('highlighted_item_id' => be_nil)
              )
          )
      end
    end

    it 'fails with 400 when transition is not NEXT' do
      do_request('SOME_OTHER_TRANSITION')

      expect(response.status).to eq(400)
    end
  end

  def do_request(transition = 'NEXT')
    post retro_path(retro) + '/discussion/transitions',
         headers: { HTTP_AUTHORIZATION: token },
         params: { transition: transition },
         as: :json
  end
end
