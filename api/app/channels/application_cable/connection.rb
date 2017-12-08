module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :request_uuid

    def self.disconnect(request_uuid)
      ActionCable.server.disconnect(request_uuid: request_uuid)
    end

    def connect
      self.request_uuid = SecureRandom.hex
    end

    def session
      cookies.encrypted[Rails.application.config.session_options[:key]].with_indifferent_access
    end
  end
end
