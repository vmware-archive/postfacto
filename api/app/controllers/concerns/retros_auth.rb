module RetrosAuth
  include ActiveSupport::Concern

  def authenticate_retro
    @retro ||= load_retro
    render json: {}, status: :forbidden unless user_allowed_to_access_retro?
  end

  def authenticate_retro_admin
    @retro ||= load_retro
    render json: {}, status: :forbidden unless user_allowed_to_perform_admin_action?
  end

  def user_allowed_to_access_retro?
    !@retro.is_private? || valid_token_provided?
  end

  def user_allowed_to_perform_admin_action?
    valid_token_provided?
  end

  def valid_token_provided?
    authenticate_with_http_token do |token, _options|
      JWTToken.valid?(@retro.slug, token, Rails.application.secrets.secret_key_base)
    end
  end

  def generate_retro_token(retro)
    JWTToken.generate(
      retro.slug,
      CLOCK.current_time,
      Rails.configuration.session_time,
      Rails.application.secrets.secret_key_base
    )
  end
end
