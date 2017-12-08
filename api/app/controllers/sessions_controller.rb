require 'clients/google_client'

class SessionsController < ApplicationController
  def create
    google_user = GOOGLE_CLIENT.get_user!(params.fetch(:access_token))

    user = User.find_by!(email: google_user[:email])

    render json: { auth_token: user.auth_token, new_user: user.retros.empty? }
  rescue GoogleClient::InvalidUserDomain
    head :forbidden
  rescue GoogleClient::GetUserFailed
    head :internal_server_error
  end
end
