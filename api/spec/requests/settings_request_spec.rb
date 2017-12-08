require 'rails_helper'

describe '/retros/:id/settings' do
  let(:retro) do
    Retro.create!(name: 'My Retro', password: 'the-password', video_link: 'the-video-link', is_private: false)
  end
  let(:token) { ActionController::HttpAuthentication::Token.encode_credentials(retro.encrypted_password) }

  describe 'GET /' do
    context 'when auth header is provided' do
      it 'returns the updated retro' do
        get "/retros/#{retro.id}/settings", headers: { HTTP_AUTHORIZATION: token }, as: :json

        expect(response.status).to eq(200)

        data = JSON.parse(response.body)
        expect(data['retro']['name']).to eq('My Retro')
        expect(data['retro']['slug']).to start_with('my-retro')
        expect(data['retro']['id']).to eq(retro.id)
        expect(data['retro']['is_private']).to eq(false)
      end
    end

    context 'when not authenticated' do
      it 'returns forbidden' do
        get "/retros/#{retro.id}/settings", headers: {}, as: :json

        expect(response.status).to eq(403)
      end
    end
  end
end
