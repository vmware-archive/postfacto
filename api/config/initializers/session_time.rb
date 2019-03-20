require 'configurations/session_time_configuration_provider'

Rails.application.config.session_time = SessionTimeConfigurationProvider.new(ENV).config
