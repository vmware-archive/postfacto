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

describe RetroArchiveService do
  let(:retro) do
    Retro.create!(name: 'My Retro', password: 'the-password', video_link: 'the-video-link', is_private: false)
  end

  before do
    retro.items.create!(description: 'one happy item', category: :happy, done: false)
    retro.highlighted_item_id = retro.items.first.id
    retro.action_items.create!(description: 'opened action', done: false)
    retro.action_items.create!(description: 'completed action', done: true)
  end

  it 'does not update archived_at for existing archived items and action items' do
    old_archived_time = Time.new(2015)
    old_item = retro.items.create!(
      description: 'an archived happy item',
      category: :happy,
      archived_at: old_archived_time,
      archived: true
    )
    old_action = retro.action_items.create!(
      description: 'an old completed action',
      done: true,
      archived_at: old_archived_time,
      archived: true
    )

    RetroArchiveService.archive(retro, Time.now, true)

    old_item.reload
    old_action.reload
    expect(old_item.archived_at).to eq(old_archived_time)
    expect(old_action.archived_at).to eq(old_archived_time)
  end

  it 'archives all existing items and completed actions' do
    RetroArchiveService.archive(retro, Time.now, true)

    expect(Item.where(retro: retro).where('archived_at IS NOT NULL').pluck(:description))
      .to match_array(['one happy item'])

    expect(ActionItem.where(retro: retro).where('archived_at IS NOT NULL').pluck(:description))
      .to eq(['completed action'])

    expect(Item.where(retro: retro, archived: true).pluck(:description))
      .to match_array(['one happy item'])

    expect(ActionItem.where(retro: retro, archived: true).pluck(:description))
      .to eq(['completed action'])

    expect(retro.action_items.pluck(:description)).to eq(['opened action'])
    retro.reload
    expect(retro.highlighted_item_id).to be_nil

    archive = Archive.last
    expect(archive).to_not be_nil

    expect(archive.items.pluck(:description))
      .to match_array(['one happy item'])

    expect(archive.action_items.pluck(:description))
      .to eq(['completed action'])
  end

  it 'set the send_archive_email' do
    RetroArchiveService.archive(retro, Time.now, false)

    expect(retro.send_archive_email).to equal(false)
  end

  it 'sends an email to the retro owner' do
    user = User.new(email: 'a@example.com')
    retro.user = user

    mail = spy
    allow(ArchivedMailer).to receive(:archived_email) { mail }

    RetroArchiveService.archive(retro, Time.now, true)

    expect(ArchivedMailer).to have_received(:archived_email).with(retro, anything, user, 'postfacto-test@example.com')
    expect(mail).to have_received(:deliver_now)
  end

  it 'does not send an email if not requested' do
    user = User.new(email: 'a@example.com')
    retro.user = user

    mail = spy
    allow(ArchivedMailer).to receive(:archived_email) { mail }

    RetroArchiveService.archive(retro, Time.now, false)

    expect(ArchivedMailer).to_not have_received(:archived_email)
  end

  it 'does not send an email if there is no retro owner' do
    allow(ArchivedMailer).to receive(:archived_email)

    RetroArchiveService.archive(retro, Time.now, true)

    expect(ArchivedMailer).to_not have_received(:archived_email)
  end
end
