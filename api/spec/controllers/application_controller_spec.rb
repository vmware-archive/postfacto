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
require 'rails_helper'

RSpec.describe ApplicationController do
  controller ApplicationController do
    def index
    end
  end

  let(:retro) do
    Retro.create!(name: 'My Retro', password: 'the-password', video_link: 'the-video-link')
  end

  subject do
    get :index, params: { retro_id: retro.id }, format: :json
  end

  it 'returns a success response when authenticated' do
    token = ActionController::HttpAuthentication::Token.encode_credentials(retro.encrypted_password)
    request.headers['HTTP_AUTHORIZATION'] = token
    subject
    expect(response.status).to eq(204)
  end
end
