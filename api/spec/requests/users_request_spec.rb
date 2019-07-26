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
require 'clients/google_client'

describe '/users' do
  describe 'POST /' do
    it 'creates user object' do
      google_user_data = {
        name: 'Felicity Frog',
        email: 'felicity@frog.com',
        hd: 'frog.com'
      }

      expect(GOOGLE_CLIENT).to receive(:get_user!).with('the-access-token').and_return(google_user_data)

      post '/api/users', params: { access_token: 'the-access-token', company_name: 'Felicity Corps',
                                   full_name: 'Felicity Toad' }, as: :json

      expect(response).to be_created

      user = User.last
      expect(user.name).to eq('Felicity Toad')
      expect(user.email).to eq('felicity@frog.com')
      expect(user.company_name).to eq('Felicity Corps')
    end

    it 'returns a token' do
      google_user_data = {
        name: 'Felicity Frog',
        email: 'felicity@frog.com',
        hd: 'frog.com'
      }

      expect(GOOGLE_CLIENT).to receive(:get_user!).with('the-access-token').and_return(google_user_data)

      post '/api/users', params: { access_token: 'the-access-token', company_name: 'Felicity Corps',
                                   full_name: 'Felicity Toad' }, as: :json

      data = JSON.parse(response.body)
      jwt = JWT.decode(data['auth_token'], nil, false)
      expect(jwt[0]['sub']).to eq('felicity@frog.com')
      expect(jwt[0]['iss']).to eq('users')
      expect(jwt[1]['alg']).to eq('HS256')
    end

    context 'when there is a session time' do
      let(:session_time) { 1.seconds }

      before do
        allow(Rails.configuration).to receive(:session_time).and_return(session_time)
        allow(CLOCK).to receive(:current_time).and_return(Time.now)
      end

      it 'responds with an expiring token' do
        google_user_data = {
          name: 'Felicity Frog',
          email: 'felicity@frog.com',
          hd: 'frog.com'
        }

        expect(GOOGLE_CLIENT).to receive(:get_user!).with('the-access-token').and_return(google_user_data)

        post '/api/users', params: { access_token: 'the-access-token', company_name: 'Felicity Corps',
                                     full_name: 'Felicity Toad' }, as: :json

        data = JSON.parse(response.body)
        jwt = JWT.decode(data['auth_token'], nil, false)

        expect(jwt[0]['exp'].to_i).to eq((CLOCK.current_time + session_time).to_i)
      end
    end

    context 'user with the same email exists' do
      it 'doesn\'t do anything' do
        User.create!(name: 'Felicity Frog', email: 'felicity@frog.com', company_name: '')
        google_user_data = {
          name: 'Felicity Frog',
          email: 'felicity@frog.com',
          hd: 'frog.com'
        }

        expect(GOOGLE_CLIENT).to receive(:get_user!).with('the-access-token').and_return(google_user_data)

        post '/api/users', params: { access_token: 'the-access-token', company_name: 'Irrelevant',
                                     full_name: 'Irrelevant' }, as: :json

        expect(response.status).to eq(300)
      end
    end

    context 'company_name parameter is not present' do
      it 'default to empty company name' do
        google_user_data = {
          name: 'Felicity Frog',
          email: 'felicity@frog.com',
          hd: 'frog.com'
        }

        expect(GOOGLE_CLIENT).to receive(:get_user!).with('the-access-token').and_return(google_user_data)

        post '/api/users', params: { access_token: 'the-access-token' }, as: :json

        expect(response).to be_created
        expect(User.last.company_name).to be_nil
      end
    end

    context 'hosted domain is set' do
      it 'does not allow other domains to sign up' do
        expect(GOOGLE_CLIENT).to receive(:get_user!)
          .with('the-access-token')
          .and_raise(GoogleClient::InvalidUserDomain.new)

        post '/api/users', params: { access_token: 'the-access-token', company_name: 'Felicity Corps',
                                     full_name: 'Felicity Toad' }, as: :json

        expect(response).to be_forbidden
      end

      it 'does allows the hosted domain to sign up' do
        google_user_data = {
          name: 'Felicity Frog',
          email: 'felicity@frog.com',
          hd: 'frog.com'
        }

        expect(GOOGLE_CLIENT).to receive(:get_user!).with('the-access-token').and_return(google_user_data)

        post '/api/users', params: { access_token: 'the-access-token', company_name: 'Felicity Corps',
                                     full_name: 'Felicity Toad' }, as: :json

        expect(response).to be_created
      end
    end
  end
end
