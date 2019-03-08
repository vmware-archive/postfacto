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

describe '/retros/:retro_id/items' do
  let!(:retro) do
    Retro.create!(name: 'My Retro', password: 'the-password', video_link: 'the-video-link')
  end
  let(:token) { ActionController::HttpAuthentication::Token.encode_credentials(token_for(retro)) }

  let!(:item) do
    retro.items.create!(description: 'This is a description', category: Item.categories.fetch(:happy))
  end

  describe 'DELETE /:id' do
    context 'when not authenticated' do
      subject do
        delete retro_item_path(retro, item), as: :json
      end

      context 'when retro is private' do
        it 'returns forbidden' do
          retro.update(is_private: true)
          expect { subject }.to_not change { retro.items.count }

          expect(response.status).to eq(403)
        end
      end

      context 'when retro is public' do
        it 'allows deletes' do
          retro.update(is_private: false)
          expect { subject }.to change { retro.items.count }.by(-1)

          expect(response.status).to eq(204)
        end
      end
    end

    context 'when authenticated' do
      subject do
        delete retro_item_path(retro, item), headers: { HTTP_AUTHORIZATION: token }, as: :json
      end

      it 'unhighlights when the deleted item was highlighted' do
        retro.highlighted_item_id = item.id
        retro.save!
        expect(Retro.find(retro.id).highlighted_item_id).to eq(item.id)

        subject

        expect(Retro.find(retro.id).highlighted_item_id).to be_nil
      end

      it 'does not unhighlight when the deleted item was not highlighted' do
        other_item = retro.items.create!(
          description: 'This is another description', category: Item.categories.fetch(:meh)
        )
        retro.highlighted_item_id = other_item.id
        retro.save!
        expect(Retro.find(retro.id).highlighted_item_id).to eq(other_item.id)

        subject

        expect(Retro.find(retro.id).highlighted_item_id).to eq(other_item.id)
      end

      it 'broadcasts to retro channel' do
        expect { subject }.to have_broadcasted_to(retro).from_channel(RetrosChannel).with(
            hash_including(
                'retro' => hash_including('items' => be_empty)
              )
          )
      end
    end
  end

  describe 'POST /' do
    context 'when authenticated' do
      subject do
        post retro_path(retro) + '/items', params: {
          item: { description: 'This is a description', category: Item.categories.fetch(:happy) }
        }, headers: { HTTP_AUTHORIZATION: token }, as: :json
      end

      it 'successfully create an item when password is provided' do
        expect { subject }.to change { retro.items.count }.by(1)
        expect(response.status).to eq(201)

        data = JSON.parse(response.body)

        expect(data['item']['id']).to be_kind_of(Integer)
        expect(data['item']['description']).to eq('This is a description')
        expect(data['item']['category']).to eq('happy')
        expect(data['item']['vote_count']).to eq(0)
        expect(data['item']['done']).to eq(false)
      end

      it 'broadcasts to retro channel with updated retro including item' do
        expect { subject }.to have_broadcasted_to(retro).from_channel(RetrosChannel).with(
            hash_including(
                'retro' => hash_including('items' => have_attributes(size: 2))
              )
          )
      end
    end

    context 'when not authenticated' do
      subject do
        post retro_path(retro) + '/items', params: {
          item: { description: 'This is a description', category: Item.categories.fetch(:happy) }
        }, as: :json
      end

      context 'when the retro is private' do
        it 'returns forbidden' do
          retro.update(is_private: true)
          subject
          expect(response.status).to eq(403)
        end
      end

      context 'when the retro is public' do
        it 'returns created' do
          retro.update(is_private: false)
          subject
          expect(response.status).to eq(201)
        end
      end
    end
  end

  describe 'POST /:item_id/vote' do
    context 'when not authenticated' do
      subject do
        post retro_item_path(retro, item) + '/vote', as: :json
      end

      context 'when the retro is private' do
        it 'returns forbidden' do
          retro.update(is_private: true)
          expect { subject }.to_not change { item.vote_count }
          expect(status).to eq(403)
        end
      end

      context 'when the retro is public' do
        it 'returns created' do
          retro.update(is_private: false)
          expect { subject }.to change { item.reload.vote_count }.by(1)
          expect(status).to eq(200)
        end
      end
    end

    context 'when authenticated' do
      let(:expected_count) { item.vote_count + 1 }

      subject do
        post retro_item_path(retro, item) + '/vote',
             headers: { HTTP_AUTHORIZATION: token }, as: :json
      end

      it 'successfully increases the vote' do
        subject

        expect(status).to eq(200)

        data = JSON.parse(response.body)

        expect(data['item']['vote_count']).to eq(expected_count)
        item.reload
        expect(item.vote_count).to eq(expected_count)
      end

      it 'broadcasts to retro channel' do
        expect { subject }.to have_broadcasted_to(retro).from_channel(RetrosChannel).with(
            hash_including(
                'retro' => hash_including('items' => match_array(
                    [
                      hash_including('vote_count' => expected_count)
                    ]
                  ))
              )
          )
      end
    end
  end

  describe 'PATCH /:item_id/done' do
    before { retro.update(is_private: true) }

    context 'if password is correct' do
      subject do
        patch retro_item_path(retro, item) + '/done',
              params: body,
              headers: { HTTP_AUTHORIZATION: token },
              as: :json
      end

      let(:body) { {} }

      it 'marks item as done' do
        subject

        expect(response.status).to eq(204)
        expect(Item.find(item.id).done).to eq(true)
      end

      it 'broadcasts to retro channel' do
        expect { subject }.to have_broadcasted_to(retro).from_channel(RetrosChannel).with(
            hash_including(
                'retro' => hash_including('items' => match_array(
                    [
                      hash_including('done' => true)
                    ]
                  ))
              )
          )
      end

      context 'done param is set to true' do
        let(:body) { { done: true } }

        it 'marks item as done' do
          subject

          expect(response.status).to eq(204)
          expect(Item.find(item.id).done).to eq(true)
        end
      end

      context 'done param is set to false' do
        let(:body) { { done: false } }

        it 'marks item not done' do
          subject

          expect(response.status).to eq(204)
          expect(Item.find(item.id).done).to eq(false)
        end
      end

      context 'the item is the highlighted one' do
        it 'resets highlighted status' do
          retro.highlighted_item_id = item.id
          retro.save!
          subject

          expect(response.status).to eq(204)
          retro.reload
          expect(retro.highlighted_item_id).to be_nil
        end
      end

      context 'the item is not the highlighted one' do
        it 'does not reset highlighted status' do
          another = retro.items.create!(description: 'another item', category: Item.categories.fetch(:happy))
          retro.highlighted_item_id = another.id
          retro.save!
          subject

          expect(response.status).to eq(204)
          retro.reload
          expect(retro.highlighted_item_id).to eq(another.id)
        end
      end
    end

    context 'if password is incorrect' do
      subject do
        patch retro_item_path(retro, item) + '/done', as: :json
      end

      it 'redirects to login page' do
        subject

        expect(response.status).to eq(403)
        expect(Item.find(item.id).done).to be_falsey
      end
    end
  end

  describe 'PATCH /:item_id' do
    context 'if password is correct' do
      subject do
        patch retro_item_path(retro, item),
              headers: { HTTP_AUTHORIZATION: token },
              params: { description: 'Changed description' },
              as: :json
      end

      it 'edits the description' do
        subject

        expect(response.status).to eq(204)
        expect(Item.find(item.id).description).to eq 'Changed description'
      end

      it 'broadcasts to retro channel' do
        expect { subject }.to have_broadcasted_to(retro).from_channel(RetrosChannel).with(
            hash_including(
                'retro' => hash_including('items' => match_array(
                    [
                      hash_including('description' => 'Changed description')
                    ]
                  ))
              )
          )
      end

      context 'if item does not exist' do
        let(:do_request) do
          patch retro_item_path(retro, id: 42),
                headers: { HTTP_AUTHORIZATION: token },
                params: { description: 'Changed description' },
                as: :json
        end

        it 'does not update the description' do
          do_request

          expect(item.reload.description).to eq 'This is a description'
        end

        it 'responds with a http 404 json string' do
          do_request

          expect(response).to have_http_status(:not_found)
          expect(response.content_type).to eq('application/json')

          expect(JSON.parse(response.body)).to eq({})
        end
      end

      context 'if other attributes are updated' do
        subject do
          patch retro_item_path(retro, item),
                headers: { HTTP_AUTHORIZATION: token },
                params: { description: 'Changed description', retro_id: '24' },
                as: :json
        end

        it 'only updates the description' do
          subject

          item.reload

          expect(item.description).to eq 'Changed description'
          expect(item.retro_id).to eq retro.id
        end
      end
    end

    context 'if password is incorrect' do
      before { retro.update(is_private: true) }
      subject do
        patch(retro_item_path(retro, item), params: { description: 'Changed description' }, as: :json)
      end

      it 'redirects to login page' do
        subject

        expect(response.status).to eq(403)
        expect(Item.find(item.id).description).to eq 'This is a description'
      end
    end
  end
end
