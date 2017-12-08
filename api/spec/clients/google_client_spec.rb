require 'spec_helper'
require 'clients/google_client'

describe GoogleClient do
  HOSTED_DOMAIN = 'frog.com'.freeze

  describe '.get_user' do
    it 'fetches user from google' do
      stub_request(:get, 'http://www.example.com')
        .with(headers: { Authorization: 'Bearer the-access-token' })
        .to_return(
          body: '{"name": "Felicity Frog", "email": "felicity@frog.com", "hd": "frog.com"}',
          status: 200
        )

      user_data = GoogleClient.new('http://www.example.com').get_user! 'the-access-token'

      expect(user_data).to eq(name: 'Felicity Frog', email: 'felicity@frog.com', hd: 'frog.com')
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
          GoogleClient.new('http://www.example.com').get_user! 'the-access-token'
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
          GoogleClient.new('http://www.example.com').get_user! 'the-access-token'
        }.to raise_error(GoogleClient::InvalidUserDomain)
      end
    end
  end
end
