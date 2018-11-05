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
ARCHIVE_EMAILS = if Rails.env.production?
                   ENV['ARCHIVE_EMAILS'] == 'true'
                 else
                   true
                 end

FROM_ADDRESS = if Rails.env.production?
                 ENV['FROM_ADDRESS']
               else
                 'postfacto-test@example.com'
               end

if ARCHIVE_EMAILS && Rails.env.production?
  ActionMailer::Base.smtp_settings = begin
    if ENV['VCAP_SERVICES'].nil?
      username = ENV.fetch('SENDGRID_USERNAME')
      password = ENV.fetch('SENDGRID_PASSWORD')
      sendgrid_config = SendgridConfiguration('smtp.sendgrid.net', username, password)
    else
      sendgrid_config = SendgridVCAPParser.get_configuration(ENV['VCAP_SERVICES'])
    end

    ActionMailer::Base.smtp_settings = {
      address: sendgrid_config.hostname,
      port: '587',
      authentication: :plain,
      user_name: sendgrid_config.username,
      password: sendgrid_config.password,
      domain: SMTP_DOMAIN,
      enable_starttls_auto: true
    }
  end
end
