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
require 'spec_helper'
require 'clients/google_client'

describe GoogleClient do
  describe '.get_user' do
    it 'fetches user from google' do
      stub_request(:get, 'http://www.example.com')
        .with(headers: { Authorization: 'Bearer the-access-token' })
        .to_return(
          body: '{"name": "Felicity Frog", "email": "felicity@frog.com"}',
          status: 200
        )

      user_data = GoogleClient.new('http://www.example.com', nil).get_user! 'the-access-token'

      expect(user_data).to eq(name: 'Felicity Frog', email: 'felicity@frog.com')
    end

    context 'fetching user from google' do
      it 'fails if throws an exception' do
        stub_request(:get, 'http://www.example.com')
          .with(headers: { Authorization: 'Bearer the-access-token' })
          .to_return(
            body: 'something-thats-not-json',
            status: 500
          )

        expect {
          GoogleClient.new('http://www.example.com', nil).get_user! 'the-access-token'
        }.to raise_error(GoogleClient::GetUserFailed)
      end

      it 'fails if fetches a user with an invalid domain from google' do
        stub_request(:get, 'http://www.example.com')
          .with(headers: { Authorization: 'Bearer the-access-token' })
          .to_return(
            body: '{"name": "Felicity Frog", "email": "felicity@frog.com", "hd": "fish.com"}',
            status: 200
          )

        expect {
          GoogleClient.new('http://www.example.com', 'frog.com').get_user! 'the-access-token'
        }.to raise_error(GoogleClient::InvalidUserDomain)
      end
    end
  end
end
