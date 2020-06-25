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

describe Retro do
  describe '#initialize' do
    let(:retro) { Retro.create(name: 'My Retro') }

    it 'should have a slug generated from the retro name' do
      expect(retro.slug).not_to eq 'my-retro'
      expect(retro.slug).to start_with 'my-retro'
    end

    context 'there is another retro with the same name' do
      it 'appends a random number to the slug' do
        another_retro = Retro.create(name: retro.name)

        expect(another_retro.slug).to include 'my-retro'
        expect(another_retro.slug).to_not eq 'my-retro'
      end
    end

    context 'there is another retro with the same id' do
      it 'appends a random number to the slug' do
        another_retro = Retro.create(name: retro.id)

        expect(another_retro.slug).not_to eq retro.id.to_s
      end
    end
  end

  describe '#save' do
    let(:retro) { Retro.new(name: 'My Retro', video_link: 'the-video-link', slug: 'a' * Retro::MAX_SLUG_LENGTH) }

    it 'defaults send_archived_email to true' do
      expect(retro.send_archive_email).to eq(true)
    end
  end

  describe '#create_instruction_cards!' do
    let(:retro) { Retro.create(name: 'My Retro') }

    it 'creates instruction cards' do
      retro.create_instruction_cards!

      items = retro.items.group_by(&:category)
      happy_items = items['happy'].map(&:description)
      meh_items = items['meh'].map(&:description)
      action_items = retro.action_items.map(&:description)

      expect(happy_items).to eq I18n.t('instruction_cards.items.happy')
      expect(meh_items).to eq I18n.t('instruction_cards.items.meh')
      expect(action_items).to eq I18n.t('instruction_cards.actions')
    end
  end

  context 'retro has magic link enabled' do
    let(:retro) do
      Retro.create!(
        name: 'My Retro',
        video_link: 'the-video-link',
        password: 'some-password'
      )
    end

    before do
      retro.is_magic_link_enabled = true
      retro.save!
    end

    it 'has a join token' do
      expect(retro.join_token).to_not be_nil
    end

    it 'does change the join token if the password is changed' do
      old_join_token = retro.join_token
      retro.password = 'something-new'
      retro.save!
      expect(retro.join_token).not_to eq old_join_token
    end

    it 'clears the join token if magic link gets disabled' do
      retro.is_magic_link_enabled = false
      retro.save!
      expect(retro.join_token).to be_nil
    end
  end

  context 'retro has magic link disabled' do
    let(:retro) do
      Retro.create!(
        name: 'My Retro',
        video_link: 'the-video-link',
        password: 'some-password'
      )
    end

    it 'does not have a join token' do
      expect(retro.join_token).to be_nil
    end

    it 'does populate the join token if magic link gets re-enabled' do
      retro.is_magic_link_enabled = true
      retro.save!
      expect(retro.join_token).to_not be_nil
    end

    it 'does not populate the join token if the password is changed' do
      retro.password = 'something-new'
      retro.save!
      expect(retro.join_token).to be_nil
    end
  end

  context 'retro has a password' do
    let(:retro) { Retro.create!(name: 'My Retro', video_link: 'the-video-link', password: 'some-password') }

    it 'has an encrypted password' do
      expect(retro.encrypted_password).to eq(BCrypt::Engine.hash_secret('some-password', retro.salt))
    end
  end

  context 'retro has no password' do
    let(:retro) { Retro.create!(name: 'My Retro', video_link: 'the-video-link') }

    it 'does not have an encrypted password if password is blank' do
      expect(retro.encrypted_password).to be_nil
    end

    it 'returns true when validating the retro without a password' do
      expect(retro.validate_login?(nil)).to be_truthy
    end
  end

  describe '#token_has_expired?' do
    let(:retro) { Retro.create!(name: 'My Retro', password: 'some-password') }

    it 'returns true when token has expired' do
      expect(retro.token_has_expired?(5.minutes, Time.now.utc + 5.minutes)).to be_truthy
    end

    it 'returns false when token is still valid' do
      expect(retro.token_has_expired?(1.minutes, Time.now.utc)).to be_falsey
    end
  end

  context 'deleting a retro' do
    let(:retro) { Retro.create(name: 'My Retro') }
    let(:done_item) { Item.new(description: 'item1', category: :happy, done: true) }
    let(:done_action) { ActionItem.new(description: 'action1', done: true) }
    let(:current_item) { Item.new(description: 'item2', category: :happy, done: false) }
    let(:current_action) { ActionItem.new(description: 'action2', done: false) }

    it 'should delete all items and action items associated with the retro' do
      retro.items << done_item
      retro.action_items << done_action

      RetroArchiveService.archive(retro, Time.now, false)

      retro.reload

      retro.items << current_item
      retro.action_items << current_action

      retro.destroy!

      expect(Item.where(id: current_item.id)).not_to exist
      expect(Item.where(id: done_item.id)).not_to exist
      expect(ActionItem.where(id: current_action.id)).not_to exist
      expect(ActionItem.where(id: done_action.id)).not_to exist
    end
  end

  context 'retro has an invalid slug' do
    let(:retro) { Retro.new(name: 'My Retro') }

    it 'cannot have more than 256 characters inclusive of prefix' do
      retro.slug = 'a' * (Retro::MAX_SLUG_LENGTH + 1)
      expect(retro).to be_invalid
    end

    it 'cannot have unrecognized characters other than letters, numbers, hyphens' do
      retro.slug = 'foo*'
      expect(retro).to be_invalid

      retro.slug = 'slug with a space'
      expect(retro).to be_invalid

      retro.slug = '????'
      expect(retro).to be_invalid

      retro.slug = '...'
      expect(retro).to be_invalid
    end
  end
end
