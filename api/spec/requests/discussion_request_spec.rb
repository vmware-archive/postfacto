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

describe '/retros/:retro_id/discussion' do
  let(:retro) { Retro.create!(name: 'My Retro', password: 'the-password', video_link: 'the-video-link') }
  let(:item) { retro.items.create!(description: 'archived happy item', category: :happy) }
  let(:token) { ActionController::HttpAuthentication::Token.encode_credentials(token_for(retro)) }

  describe 'POST /' do
    context 'when authenticated' do
      subject do
        post retro_path(retro) + '/discussion',
             headers: { HTTP_AUTHORIZATION: token },
             params: { item_id: item.id },
             as: :json
      end

      it 'adds item_id to highlighted_item in retro' do
        subject
        expect(response.status).to eq(200)

        data = JSON.parse(response.body)
        retro.reload

        expect(data['retro']['highlighted_item_id']).to eq(item.id)
        expect(data['retro']['retro_item_end_time']).not_to be_nil
        expect(retro.highlighted_item_id).to eq(item.id)
        expect(retro.retro_item_end_time).not_to be_nil
      end

      it 'broadcasts to retro channel' do
        expect { subject }.to have_broadcasted_to(retro).from_channel(RetrosChannel).with(
            hash_including(
                'retro' => hash_including('highlighted_item_id' => item.id)
              )
          )
      end
    end

    context 'when not authenticated' do
      subject do
        post retro_path(retro) + '/discussion',
             params: { item_id: item.id },
             as: :json
      end

      context 'when the retro is private' do
        it 'returns forbidden' do
          retro.update(is_private: true)
          subject

          expect(response.status).to eq(403)
          expect(retro.reload.highlighted_item_id).to be_blank
        end
      end

      context 'when the retro is public' do
        it 'returns forbidden' do
          retro.update(is_private: false)
          subject

          expect(response.status).to eq(200)
          expect(retro.reload.highlighted_item_id).to_not be_blank
        end
      end
    end
  end

  describe 'PATCH /' do
    context 'when authenticated' do
      subject do
        patch retro_path(retro) + '/discussion', headers: { HTTP_AUTHORIZATION: token }, as: :json
      end

      it 'adds 2 minutes to the timer' do
        subject

        expect(response.status).to eq(200)

        data = JSON.parse(response.body)

        expect(data['retro']['retro_item_end_time']).not_to be_nil
        retro.reload
        expect(retro.retro_item_end_time - Time.now).to be > 100
      end

      it 'broadcasts to retro channel' do
        expect { subject }.to have_broadcasted_to(retro).from_channel(RetrosChannel).with { |message|
          retro_item_end_time = Time.parse(message['retro']['retro_item_end_time'])
          expect(retro_item_end_time).to be_within(2.seconds).of(2.minutes.from_now)
        }
      end
    end

    context 'when not authenticated' do
      subject do
        patch retro_path(retro) + '/discussion', params: { retro: { id: retro.id } }, as: :json
      end

      it 'returns 403' do
        retro.update(is_private: true)
        subject
        retro.reload

        expect(response.status).to eq(403)
        expect(retro.retro_item_end_time).to be_nil
      end
    end
  end

  describe 'DELETE /' do
    before do
      retro.highlighted_item_id = item.id
      retro.retro_item_end_time = 5.minutes.from_now
      retro.save!
    end

    context 'when authenticated' do
      subject do
        delete retro_path(retro) + '/discussion', headers: { HTTP_AUTHORIZATION: token }, as: :json
      end

      it 'removes the highlighted item' do
        subject
        retro.reload

        expect(response.status).to eq(204)
        expect(retro.highlighted_item_id).to be_nil
      end

      it 'broadcasts to retro channel' do
        expect { subject }.to have_broadcasted_to(retro).from_channel(RetrosChannel).with(
            hash_including(
                'retro' => hash_including('highlighted_item_id' => be_nil)
              )
          )
      end
    end

    context 'when not authenticated' do
      subject do
        delete retro_path(retro) + '/discussion', params: { retro: { id: retro.id } }, as: :json
      end

      it 'returns 403' do
        retro.update(is_private: true)
        subject
        retro.reload

        expect(response.status).to eq(403)
        expect(retro.highlighted_item_id).to eq(item.id)
        expect(retro.retro_item_end_time).not_to be_nil
      end
    end
  end
end
