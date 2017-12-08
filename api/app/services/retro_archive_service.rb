class RetroArchiveService
  include Singleton

  def call(retro, archived_at, send_archive_email)
    archive = retro.archives.create!
    mark_retro_items_archived(retro, archive, archived_at)

    persist_send_archive_email_preference(retro, send_archive_email)

    send_emails(retro, archive) if send_archive_email && retro.user
  end

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
