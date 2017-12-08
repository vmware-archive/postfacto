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
