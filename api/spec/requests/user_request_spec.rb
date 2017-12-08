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

      post '/users', params: { access_token: 'the-access-token', company_name: 'Felicity Corps',
                               full_name: 'Felicity Toad' }, as: :json

      expect(response).to be_created

      data = JSON.parse(response.body, symbolize_names: true)

      expect(data[:auth_token]).not_to be_nil
      user = User.last
      expect(user.name).to eq('Felicity Toad')
      expect(user.email).to eq('felicity@frog.com')
      expect(user.company_name).to eq('Felicity Corps')
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

        post '/users', params: { access_token: 'the-access-token', company_name: 'Irrelevant',
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

        post '/users', params: { access_token: 'the-access-token' }, as: :json

        expect(response).to be_created
        expect(User.last.company_name).to be_nil
      end
    end

    context 'full_name parameter is not present' do
      it 'default to name returned by google' do
        google_user_data = {
          name: 'Felicity Frog',
          email: 'felicity@frog.com',
          hd: 'frog.com'
        }

        expect(GOOGLE_CLIENT).to receive(:get_user!).with('the-access-token').and_return(google_user_data)

        post '/users', params: { access_token: 'the-access-token', company_name: 'Felicity Corps' }, as: :json

        expect(response).to be_created
        expect(User.last.name).to eq('Felicity Frog')
      end
    end

    context 'hosted domain is set' do
      it 'does not allow other domains to sign up' do
        expect(GOOGLE_CLIENT).to receive(:get_user!)
          .with('the-access-token')
          .and_raise(GoogleClient::InvalidUserDomain.new)

        post '/users', params: { access_token: 'the-access-token', company_name: 'Felicity Corps',
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

        post '/users', params: { access_token: 'the-access-token', company_name: 'Felicity Corps',
                                 full_name: 'Felicity Toad' }, as: :json

        expect(response).to be_created
      end
    end
  end
end
