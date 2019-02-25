module RetrosAuth
  include ActiveSupport::Concern

  def load_retro
    @retro = Retro.find_by_slug!(params.fetch(:retro_id) { params.fetch(:id) })
  end

  def load_and_authenticate_retro
    @retro ||= load_retro
    render json: {}, status: :forbidden unless user_allowed_to_access_retro?
  end

  def load_and_authenticate_retro_admin
    @retro ||= load_retro
    render json: {}, status: :forbidden unless user_allowed_to_perform_admin_action?
  end

  private

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
