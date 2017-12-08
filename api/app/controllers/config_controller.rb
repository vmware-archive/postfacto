class ConfigController < ApplicationController
  def show
    render json: {
      new_terms: Time.parse("#{NEW_TERMS_RELEASE} UTC") < CLOCK.current_time,
      old_terms: Time.parse("#{OLD_TERMS_REMOVAL} UTC") > CLOCK.current_time,
      archive_emails: ARCHIVE_EMAILS
    }
  end
end
