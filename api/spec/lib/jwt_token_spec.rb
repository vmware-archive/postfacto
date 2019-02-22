require 'spec_helper'
require 'security/jwt_token'

describe JWTToken do
  describe 'generate' do
    it 'returns a valid token' do
      secret = 'secret'
      current_time = Time.now
      session_time_limit = 2.minutes
      token = JWTToken.generate('happy-sad-meh', current_time, session_time_limit, secret)

      decoded_token = JWT.decode(token, secret, true, algorithm: 'HS256')
      expect(decoded_token.first['slug']).to eq('happy-sad-meh')
      expect(decoded_token.first['exp']).to eq((current_time + session_time_limit).to_i)
    end

    context 'session_time_limit is nil' do
      it 'returns a token that will not expire' do
        secret = 'secret'
        current_time = Time.now
        token = JWTToken.generate('happy-sad-meh', current_time, nil, secret)

        decoded_token = JWT.decode(token, secret, true, algorithm: 'HS256')
        expect(decoded_token.first['slug']).to eq('happy-sad-meh')
        expect(decoded_token.first['exp']).to eq(nil)
      end
    end
  end

  describe 'valid?' do
    context 'slug is incorrect' do
      it 'returns false' do
        secret = 'secret'

        payload = {
          slug: 'happy-sad-meh'
        }

        token = JWT.encode(payload, secret, 'HS256')
        expect(JWTToken.valid?('another-one', token, secret)).to eq(false)
      end
    end

    context 'token has expired' do
      it 'returns false' do
        secret = 'secret'

        payload = {
          slug: 'happy-sad-meh',
          exp: (Time.now - 1.minutes).to_i
        }

        token = JWT.encode(payload, secret, 'HS256')
        expect(JWTToken.valid?('happy-sad-meh', token, secret)).to eq(false)
      end

      context 'token still valid' do
        it 'returns true' do
          secret = 'secret'

          payload = {
            slug: 'happy-sad-meh',
            exp: (Time.now + 1.minutes).to_i
          }

          token = JWT.encode(payload, secret, 'HS256')
          expect(JWTToken.valid?('happy-sad-meh', token, secret)).to eq(true)
        end
      end
    end

    context 'token is invalid' do
      it 'returns false' do
        secret = 'secret'
        token = 'this-cannot-be-parsed-by-jwt'

        expect(JWTToken.valid?('happy-sad-meh', token, secret)).to eq(false)
      end
    end
  end
end
