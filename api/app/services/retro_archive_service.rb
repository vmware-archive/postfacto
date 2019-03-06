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
module RetroArchiveService
  def self.archive(retro, archived_at, send_archive_email)
    archive = retro.archives.create!
    mark_retro_items_archived(retro, archive, archived_at)

    persist_send_archive_email_preference(retro, send_archive_email)

    send_emails(retro, archive) if send_archive_email && retro.user
  end

  class << self
    private

    def persist_send_archive_email_preference(retro, send_archive_email_preference)
      retro.update!(send_archive_email: send_archive_email_preference)
    end

    def mark_retro_items_archived(retro, archive, archived_at)
      archive_data = { archived_at: archived_at, archived: true, archive_id: archive.id }
      retro.items.where(archived: false).update_all(archive_data)
      retro.action_items.where(archived: false, done: true).update_all(archive_data)
      retro.update!(highlighted_item_id: nil)
    end

    def send_emails(retro, archive)
      if ARCHIVE_EMAILS
        ArchivedMailer.archived_email(retro, archive, retro.user, FROM_ADDRESS).deliver_now
      end
    end
  end
end
