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

module UsersAuth
  def generate_user_token(user)
    AuthToken.generate(
      user.email,
      'users',
      CLOCK.current_time,
      Rails.configuration.session_time,
      Rails.application.secrets.secret_key_base
    )
  end

  def load_and_authenticate_user
    email = AuthToken.subject_for(
      request.headers['X-AUTH-TOKEN'],
      Rails.application.secrets.secret_key_base,
      'users'
    )

    @user = User.find_by_email(email) if email
    render json: :no_content, status: :forbidden unless @user
  end
end
