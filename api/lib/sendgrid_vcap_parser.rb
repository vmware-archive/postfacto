require 'sendgrid_configuration'

class SendgridVCAPParser
  class << self
    def get_configuration(vcap_services)
      json = JSON.parse(vcap_services)
      sendgrid_hash = json.fetch('sendgrid')
      credentials = sendgrid_hash.first.fetch('credentials')
      SendgridConfiguration.new(
        credentials.fetch('hostname'),
        credentials.fetch('username'),
        credentials.fetch('password')
      )
    end
  end
end
