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
    sendgrid_config = SendgridVCAPParser.get_configuration(ENV['VCAP_SERVICES'])

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
