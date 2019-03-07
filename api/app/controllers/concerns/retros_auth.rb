#
# Postfacto, a free, open-source and self-hosted retro tool aimed at helping
# remote teams.
#
# Copyright (C) 2016 - Present Pivotal Software, Inc.
#
# This program is free software: you can redistribute it and/or modify
#
# it under the terms of the GNU Affero General Public License as
#
# published by the Free Software Foundation, either version 3 of the
#
# License, or (at your option) any later version.
#
#
#
# This program is distributed in the hope that it will be useful,
#
# but WITHOUT ANY WARRANTY; without even the implied warranty of
#
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#
# GNU Affero General Public License for more details.
#
#
#
# You should have received a copy of the GNU Affero General Public License
#
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
#
require 'security/auth_token'

module RetrosAuth
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

  def user_allowed_to_access_retro?
    !@retro.is_private? || valid_token_provided?
  end

  def user_allowed_to_perform_admin_action?
    valid_token_provided?
  end

  def generate_retro_token(retro)
    AuthToken.generate(
      retro.slug,
      'retros',
      CLOCK.current_time,
      Rails.configuration.session_time,
      Rails.application.secrets.secret_key_base
    )
  end

  def valid_token_provided?
    authenticate_with_http_token do |token, _options|
      @retro.slug == AuthToken.subject_for(
        token,
        Rails.application.secrets.secret_key_base,
        'retros'
      )
    end
  end
end
