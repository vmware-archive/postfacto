require 'clients/google_client'

auth_endpoint = ENV['GOOGLE_AUTH_ENDPOINT'] ||= 'https://www.googleapis.com/oauth2/v3/userinfo'
GOOGLE_CLIENT = GoogleClient.new(auth_endpoint)
