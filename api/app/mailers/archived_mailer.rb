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
