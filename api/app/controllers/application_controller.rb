class ApplicationController < ActionController::Base
  protect_from_forgery
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  protected

  def load_retro
    @retro = Retro.friendly.find(params.fetch(:retro_id))
  end

  def authenticate_retro
    @retro ||= load_retro
    render json: {}, status: :forbidden unless user_allowed_to_access_retro?
  end

  def authenticate_retro_admin
    @retro ||= load_retro
    render json: {}, status: :forbidden unless user_allowed_to_perform_admin_action?
  end

  def user_allowed_to_access_retro?
    return true unless @retro.is_private?
    !@retro.requires_authentication? || valid_token_provided?
  end

  def user_allowed_to_perform_admin_action?
    !@retro.requires_authentication? || valid_token_provided?
  end

  def valid_token_provided?
    authenticate_with_http_token do |token, _options|
      # Compare the tokens in a time-constant manner, to mitigate
      # timing attacks.
      ActiveSupport::SecurityUtils.variable_size_secure_compare(
        token,
        @retro.encrypted_password
      )
    end
  end

  private

  def record_not_found
    render json: {}, status: :not_found
  end
end
