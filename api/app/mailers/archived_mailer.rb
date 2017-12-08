class ArchivedMailer < ApplicationMailer
  def archived_email(retro, archive, user, from_address)
    @retro = retro
    @archive = archive
    @user = user
    @action_items = retro.action_items.where(done: false)
    formatted_date = "#{@archive.created_at.day.ordinalize} #{@archive.created_at.strftime('%B, %Y')}"

    mail(
      from: from_address,
      reply_to: from_address,
      sender: "\"Postfacto\" <#{from_address}>",
      to: @user.email,
      subject: "[Postfacto] #{@retro.name} retro action items from #{formatted_date}"
    )
  end
end
