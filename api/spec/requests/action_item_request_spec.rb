require 'rails_helper'

describe '/retros/:retro_id/action_items' do
  let(:retro) { Retro.create!(name: 'My Retro', video_link: 'the-video-link', password: 'the-password') }
  let(:token) { ActionController::HttpAuthentication::Token.encode_credentials(retro.encrypted_password) }

  describe 'when password is provided' do
    it 'successfully create an action item and renders json' do
      expect(RetrosChannel).to receive(:broadcast)
      post retro_path(retro) + '/action_items', params: {
        action_item: { description: 'This is a description' }
      }, headers: { HTTP_AUTHORIZATION: token }, as: :json
      expect(retro.action_items.count).to eq(1)
      expect(status).to eq(201)
      data = JSON.parse(response.body)
      expect(data['action_item']['id']).to be_kind_of(Integer)
      expect(data['action_item']['description']).to eq('This is a description')
      expect(data['action_item']['done']).to eq(false)
    end

    it 'responds for deleting an action item' do
      action_item = retro.action_items.create!(description: 'This is a description')

      expect(RetrosChannel).to receive(:broadcast)

      delete retro_action_item_path(retro, action_item),
             headers: { HTTP_AUTHORIZATION: token }, as: :json

      expect(retro.action_items.count).to eq(0)
      expect(status).to eq(204)
    end
  end

  describe 'when password is not provided' do
    context 'when the retro is private' do
      before { retro.update(is_private: true) }

      it 'returns 403 when try to create and and not logged in' do
        expect do
          post retro_path(retro) + '/action_items',
               params: { action_item: { description: 'This is a description' } }, as: :json
        end.to_not change { ActionItem.count }
        expect(response.status).to eq(403)
      end

      it 'returns 403 when trying to delete and not logged in' do
        action_item = retro.action_items.create!(description: 'This is a description')

        expect do
          delete retro_action_item_path(retro, action_item), as: :json
        end.to_not change { ActionItem.count }
        expect(response.status).to eq(403)
      end
    end

    context 'when the retro is public' do
      before { retro.update(is_private: false) }

      it 'returns 200 when try to create and and not logged in' do
        expect do
          post retro_path(retro) + '/action_items',
               params: { action_item: { description: 'This is a description' } }, as: :json
        end.to change { ActionItem.count }.by(1)
        expect(response.status).to eq(201)
      end

      it 'returns 200 when trying to delete and not logged in' do
        action_item = retro.action_items.create!(description: 'This is a description')

        expect do
          delete retro_action_item_path(retro, action_item), as: :json
        end.to change { ActionItem.count }.by(-1)
        expect(response.status).to eq(204)
      end
    end
  end
end

describe 'PATCH /retros/:retro_id/action_items/:action_item_id' do
  let(:retro) { Retro.create!(name: 'My Retro', video_link: 'the-video-link', password: 'the-password') }
  let(:action_item) { retro.action_items.create!(description: 'action item 1', done: false) }
  let(:token) { ActionController::HttpAuthentication::Token.encode_credentials(retro.encrypted_password) }

  it 'updates the action item with the given value for done' do
    expect(RetrosChannel).to receive(:broadcast).twice

    patch retro_action_item_path(retro, action_item),
          headers: { HTTP_AUTHORIZATION: token },
          params: { action_item: { done: true, description: 'changed' } },
          as: :json

    action_item.reload
    expect(action_item.done).to be_truthy
    expect(action_item.description).to eq 'changed'
    expect(response.status).to eq(200)

    data = JSON.parse(response.body)
    expect(data['action_item']['done']).to eq(true)
    expect(data['action_item']['description']).to eq('changed')

    patch retro_action_item_path(retro, action_item),
          headers: { HTTP_AUTHORIZATION: token }, params: { action_item: { done: false } }, as: :json

    expect(response.status).to eq(200)

    data = JSON.parse(response.body)
    expect(data['action_item']['done']).to eq(false)

    action_item.reload
    expect(action_item.done).to be_falsey
  end
end
