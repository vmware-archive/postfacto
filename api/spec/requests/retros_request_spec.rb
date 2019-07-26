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

describe '/retros' do
  let(:retro) do
    retro_admin = User.create!(email: 'admin@test.io', name: 'random')

    Retro.create!(
      name: 'My Retro',
      password: 'the-password',
      video_link: 'the-video-link',
      is_private: false,
      user: retro_admin
    )
  end

  let(:token) { ActionController::HttpAuthentication::Token.encode_credentials(token_for(retro)) }

  describe 'POST /' do
    context 'when auth header is provided' do
      let(:user) { User.create!(email: 'test@test.io', name: 'random') }
      before do
        post '/api/retros', headers: { 'X-AUTH-TOKEN': token_for(user) },
                            params: {
                              retro: { name: 'the new retro', slug: 'my-retro-url', password: 'the-password' }
                            },
                            as: :json
      end

      it 'returns the retro' do
        expect(response.status).to eq(201)
        data = JSON.parse(response.body)
        expect(data['retro']['id']).to be_kind_of(Integer)
        expect(data['retro']['name']).to eq('the new retro')
        expect(data['retro']['slug']).to eq('my-retro-url')
        expect(data['token']).to_not be_nil

        retro = Retro.find data['retro']['id']
        expect(retro.user.id).to eq(user.id)
      end

      it 'creates instruction cards for first time only' do
        data = JSON.parse(response.body)
        retro = Retro.find data['retro']['id']

        items = retro.items.group_by(&:category)

        expect(items['happy'].count).to eq 3
        expect(items['meh'].count).to eq 2
        expect(items['sad']).to be_nil
        expect(retro.action_items.count).to eq 2

        expect do
          post '/api/retros', headers: { 'X-AUTH-TOKEN': token_for(user) },
                              params: { retro: { name: 'the second retro' } }
        end.to_not change { [Item.count, ActionItem.count] }
      end
    end

    context 'when auth header is not provided' do
      it 'responds with forbidden' do
        post '/api/retros', params: { retro: { name: 'the new retro', password: 'the-password' } }, as: :json

        expect(response).to be_forbidden
      end
    end

    context 'when creating retro fails' do
      let(:user) { User.create!(email: 'test@test.io', name: 'random') }

      it 'returns unprocessable entity with error message' do
        # Create retro with same slug
        post '/api/retros', headers: { 'X-AUTH-TOKEN': token_for(user) },
                            params: { retro: { name: 'the new retro', slug: retro.slug, password: 'the-password' } },
                            as: :json

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'GET /' do
    context 'when auth header is provided' do
      let(:user) { User.create!(email: 'test@test.io', name: 'random') }

      before do
        user.retros.create(name: 'Felicity Frog')
        user.retros.create(name: 'Frog Felicity')
        get '/api/retros', headers: { 'X-AUTH-TOKEN': token_for(user) }, as: :json
      end

      it 'returns a list of retros' do
        data = JSON.parse(response.body)
        expect(response.status).to eq(200)
        expect(data['retros'].count).to eq 2
      end
    end

    context 'when auth header does not match' do
      let(:user) { User.create!(email: 'test@test.io', name: 'random') }

      before do
        get '/api/retros', headers: { 'X-AUTH-TOKEN': 'not-a-valid-token' }, as: :json
      end

      it 'returns 403 Forbidden' do
        expect(response).to be_forbidden
      end
    end

    context 'when auth header is not provided' do
      before do
        get '/api/retros', as: :json
      end

      it 'returns 403 Forbidden' do
        expect(response).to be_forbidden
      end
    end
  end

  describe 'GET /:slug' do
    context 'when authenticated' do
      before do
        retro.items.create!(description: 'one happy item', category: :happy, vote_count: 3, done: false)
        retro.items.create!(description: 'one meh item', category: :meh, vote_count: 7, done: true)
        retro.items.create!(description: 'one sad item', category: :sad, vote_count: 1, done: false)
        retro.action_items.create!(description: 'action item 1', done: true)
        retro.action_items.create!(description: 'action item 2', done: false)
        retro.archives.create!
        retro.archives.create!
        retro.highlighted_item_id = retro.items.first.id
        retro.retro_item_end_time = 5.minutes.from_now
        retro.send_archive_email = false
        retro.save!
      end

      it 'returns the retro with the given slug' do
        status = get "/api/retros/#{retro.slug}", headers: { HTTP_AUTHORIZATION: token }, as: :json

        expect(status).to eq(200)
        data = JSON.parse(response.body)

        expect(data['retro']['name']).to eq('My Retro')
        expect(data['retro']['is_private']).to eq(false)
        expect(data['retro']['slug']).to eq(retro.slug)
        expect(data['retro']['video_link']).to eq('the-video-link')
        expect(data['retro']['created_at']).to_not be_nil
        expect(data['retro']['highlighted_item_id']).to eq(retro.highlighted_item_id)
        expect(data['retro']['retro_item_end_time']).to_not be_nil
        expect(data['retro']['send_archive_email']).to eq(false)
        expect(data['retro']['items'].count).to eq(3)
        expect(data['retro']['items'][0]['description']).to eq('one happy item')
        expect(data['retro']['items'][0]['category']).to eq('happy')
        expect(data['retro']['items'][0]['created_at']).to_not be_nil
        expect(data['retro']['items'][0]['vote_count']).to eq(3)
        expect(data['retro']['items'][0]['done']).to be_falsey
        expect(data['retro']['items'][1]['description']).to eq('one meh item')
        expect(data['retro']['items'][1]['category']).to eq('meh')
        expect(data['retro']['items'][1]['created_at']).to_not be_nil
        expect(data['retro']['items'][1]['vote_count']).to eq(7)
        expect(data['retro']['items'][1]['done']).to be_truthy
        expect(data['retro']['items'][2]['description']).to eq('one sad item')
        expect(data['retro']['items'][2]['category']).to eq('sad')
        expect(data['retro']['items'][2]['created_at']).to_not be_nil
        expect(data['retro']['items'][2]['vote_count']).to eq(1)
        expect(data['retro']['items'][2]['done']).to be_falsey
        expect(data['retro']['action_items'][0]['done']).to be_truthy
        expect(data['retro']['action_items'][1]['done']).to be_falsey
        expect(data['retro']['action_items'][0]['description']).to eq('action item 1')
        expect(data['retro']['action_items'][1]['description']).to eq('action item 2')
        expect(data['retro']['archives'].count).to eq(2)
        expect(data['retro']['archives'][0]['id']).to eq(retro.archives[0].id)
        expect(data['retro']['archives'][1]['id']).to eq(retro.archives[1].id)
      end
    end

    context 'when not authenticated' do
      context 'public retro' do
        it 'returns 200 OK when the slug is used' do
          status = get "/api/retros/#{retro.slug}", as: :json

          expect(status).to eq(200)
        end
      end

      context 'private retro' do
        before do
          retro.update(is_private: true)
        end

        it 'returns 403 Forbidden' do
          retro.update(is_private: true)
          status = get "/api/retros/#{retro.slug}", as: :json
          expect(status).to eq(403)
        end
      end
    end

    context 'when such a retro with that slug does not exist' do
      it 'responds with a http 404 json string' do
        headers = { HTTP_AUTHORIZATION: token }
        get "/api/retros/#{retro.id}", headers: headers, as: :json

        expect(response).to have_http_status(:not_found)
        expect(response.content_type).to eq('application/json')

        expect(JSON.parse(response.body)).to eq({})
      end
    end
  end

  describe 'PUT /:id/archive' do
    before do
      retro.items.create!(description: 'one happy item', category: :happy, done: false)
      retro.highlighted_item_id = retro.items.first.id
      retro.action_items.create!(description: 'opened action', done: false)
      retro.action_items.create!(description: 'completed action', done: true)
    end

    context 'when authenticated' do
      subject do
        put retro_path(retro) + '/archive',
            headers: { HTTP_AUTHORIZATION: token },
            params: { send_archive_email: true },
            as: :json
      end

      it 'archives all the items' do
        subject

        get retro_path(retro), headers: { HTTP_AUTHORIZATION: token }, as: :json

        expect(response.status).to eq(200)
        data = JSON.parse(response.body)
        expect(data['retro']['name']).to eq('My Retro')
        expect(data['retro']['items'].count).to eq(0)
        expect(data['retro']['action_items'].count).to eq(1)
      end

      it 'defaults to sending an archive email' do
        expect { subject }.to change { ActionMailer::Base.deliveries.count }.by(1)
      end

      it 'returns the updated retro' do
        subject
        expect(response.status).to eq(200)

        data = JSON.parse(response.body)
        expect(data['retro']['name']).to eq('My Retro')
        expect(data['retro']['video_link']).to eq('the-video-link')
        expect(data['retro']['items'].count).to eq(0)
        expect(data['retro']['action_items'].count).to eq(1)
        expect(data['retro']['send_archive_email']).to eq(true)
      end

      it 'persist the send_archive_email value' do
        put retro_path(retro) + '/archive',
            headers: { HTTP_AUTHORIZATION: token },
            params: { send_archive_email: true }, as: :json
        data = JSON.parse(response.body)
        expect(data['retro']['send_archive_email']).to eq(true)

        put retro_path(retro) + '/archive',
            headers: { HTTP_AUTHORIZATION: token },
            params: { send_archive_email: false }, as: :json
        data = JSON.parse(response.body)
        expect(data['retro']['send_archive_email']).to eq(false)
      end
    end

    context 'when not authenticated' do
      subject do
        put retro_path(retro) + '/archive', as: :json
      end

      it 'does not archive the items' do
        subject

        get retro_path(retro), headers: { HTTP_AUTHORIZATION: token }, as: :json

        expect(response.status).to eq(200)
        data = JSON.parse(response.body)
        expect(data['retro']['name']).to eq('My Retro')
        expect(data['retro']['items'].count).to eq(1)
        expect(data['retro']['action_items'].count).to eq(2)
      end

      it 'returns forbidden' do
        subject
        expect(response.status).to eq(403)
      end
    end
  end

  describe 'PATCH /:id' do
    let(:do_request) do
      patch(
        retro_path(retro),
        params: {
          retro: { name: 'Your Retro', is_private: is_private },
          request_uuid: 'some-request-uuid'
        },
        headers: { HTTP_AUTHORIZATION: token },
        as: :json
      )
    end

    context 'when private and authenticated' do
      before do
        retro.update(is_private: true)
      end

      let(:is_private) { false }

      it 'returns the updated retro' do
        do_request

        expect(response.status).to eq(200)
        data = JSON.parse(response.body)
        expect(data['retro']['id']).to eq(retro.id)
        expect(data['retro']['name']).to eq('Your Retro')
        expect(data['retro']['is_private']).to eq(false)

        retro.reload
        expect(retro.name).to eq('Your Retro')
        expect(retro.is_private).to eq(false)
      end

      it 'broadcasts the updated retro' do
        expect { do_request }.to have_broadcasted_to(retro).from_channel(RetrosChannel).with(
            hash_including('retro' => hash_including('name' => 'Your Retro'))
          )
      end

      context 'and changing retro to public' do
        it 'does not broadcast force relogin' do
          expect { do_request }.not_to have_broadcasted_to(retro).from_channel(RetrosChannel).with(
              hash_including('command' => 'force_relogin')
            )
        end
      end
    end

    context 'when private and not authenticated' do
      it 'returns forbidden' do
        retro.update(is_private: true)

        patch retro_path(retro), params: { retro: { name: 'Your Retro' } }, as: :json

        expect(response.status).to eq(403)
        retro.reload
        expect(retro.name).to eq('My Retro')
      end
    end

    context 'when public' do
      it 'returns forbidden' do
        patch retro_path(retro), params: { retro: { name: 'Your Retro' } }, as: :json

        expect(response.status).to eq(403)
      end

      context 'and changing retro to private' do
        let(:is_private) { true }

        it 'broadcasts force relogin and updated retro' do
          expect { do_request }.to have_broadcasted_to(retro).from_channel(RetrosChannel).with(
              hash_including('command' => 'force_relogin')
            )
        end
      end
    end

    context 'when slug is has already been taken' do
      it 'returns unprocessable entity' do
        another_retro = Retro.create!(name: 'Retro 2',
                                      password: 'password',
                                      video_link: 'the-video-link',
                                      slug: 'slug-taken')

        retro.update(is_private: true)

        patch retro_path(retro),
              params: { retro: { name: 'Your Retro', slug: another_retro.slug } },
              headers: { HTTP_AUTHORIZATION: token }, as: :json

        expect(response.status).to eq(422)

        data = JSON.parse(response.body)
        expect(data['errors']).to eq('slug' => 'Sorry! That URL is already taken.')
      end
    end
  end

  describe 'PATCH /:id/password' do
    it 'updates the retro password if the current password matches' do
      retro.update!(password: 'before')

      patch retro_update_password_path(retro),
            headers: { HTTP_AUTHORIZATION: token },
            params: {
              current_password: 'before',
              new_password: 'after',
              request_uuid: 'blah'
            },
            as: :json

      expect(response.status).to eq(200)

      retro.reload
      expect(retro.validate_login?('after')).to eq(true)
    end

    it 'returns unprocessable entity when current password does not match' do
      retro.update!(password: 'bleah')

      patch retro_update_password_path(retro),
            headers: { HTTP_AUTHORIZATION: token },
            params: {
              current_password: 'before',
              new_password: 'after'
            },
            as: :json

      expect(response.status).to eq(422)
      expect(retro.validate_login?('bleah')).to eq(true)

      data = JSON.parse(response.body)
      expect(data['errors']).to eq('current_password' => 'Sorry! That password does not match the current one.')
    end
  end
end
