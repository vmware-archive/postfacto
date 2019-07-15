# This file is used by Rack-based servers to start the application.

require_relative 'config/environment'

root_url = ENV['RAILS_RELATIVE_URL_ROOT'] || '/'

map root_url do
  run Rails.application

  if ENV['RAILS_ENV'] == 'production'
    next
  end

  require 'rack/cors'
  use Rack::Cors do
    # allow all origins in development
    allow do
      origins '*'
      resource '*',
               headers: :any,
               methods: [:get, :patch, :post, :delete, :put, :options]
    end
  end
end
