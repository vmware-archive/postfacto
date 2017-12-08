require 'clients/google_client'

class UsersController < ApplicationController
  def create
    google_user = GOOGLE_CLIENT.get_user! params.fetch(:access_token)
    user = google_user.slice(:email)

    assign_name_and_company_name_from_params(google_user, user)
    return_user(google_user, user)
  rescue GoogleClient::InvalidUserDomain
    head :forbidden
  end

  def return_user(google_user, user)
    if User.exists?(google_user.slice(:email))
      head :multiple_choices
    else
      user = User.create!(user)
      render json: { auth_token: user.auth_token }, status: :created
    end
  end

  def assign_name_and_company_name_from_params(google_user, user)
    if params[:company_name].present?
      user[:company_name] = params.fetch(:company_name)
    end
    user[:name] = google_user[:name]
    if params[:full_name].present?
      user[:name] = params.fetch(:full_name)
    end
  end
end
