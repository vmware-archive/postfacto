require 'spec_helper'
require 'security/auth_token'
require 'active_support/core_ext/integer/time'

describe AuthToken do
  describe 'generate' do
    it 'returns a valid token' do
      secret = 'secret'
      current_time = Time.now
      session_time_limit = 2.minutes
      token = AuthToken.generate('happy-sad-meh', 'issuer', current_time, session_time_limit, secret)

      decoded_token = JWT.decode(token, secret, true, algorithm: 'HS256')
      expect(decoded_token.first['sub']).to eq('happy-sad-meh')
      expect(decoded_token.first['iss']).to eq('issuer')
      expect(decoded_token.first['exp']).to eq((current_time + session_time_limit).to_i)
    end

    context 'session_time_limit is nil' do
      it 'returns a token that will not expire' do
        secret = 'secret'
        current_time = Time.now
        token = AuthToken.generate('happy-sad-meh', 'issuer', current_time, nil, secret)

        decoded_token = JWT.decode(token, secret, true, algorithm: 'HS256')
        expect(decoded_token.first['exp']).to eq(nil)
      end
    end
  end

  describe 'subject_for' do
    context 'issuer is incorrect' do
      it 'returns nil' do
        payload = {
          sub: 'happy-sad-meh',
          iss: 'issuer'
        }

        token = JWT.encode(payload, 'secret', 'HS256')
        expect(AuthToken.subject_for(token, 'secret', 'not-issuer')).to eq(nil)
      end
    end

    context 'token is expired' do
      it 'returns nil' do
        payload = {
          sub: 'happy-sad-meh',
          iss: 'issuer',
          exp: (Time.now - 1.minutes).to_i
        }

        token = JWT.encode(payload, 'secret', 'HS256')
        expect(AuthToken.subject_for(token, 'secret', 'not-issuer')).to eq(nil)
      end
    end

    context 'token still valid' do
      it 'returns the subject' do
        payload = {
          sub: 'happy-sad-meh',
          iss: 'issuer',
          exp: (Time.now + 1.minutes).to_i
        }

        token = JWT.encode(payload, 'secret', 'HS256')
        expect(AuthToken.subject_for(token, 'secret', 'issuer')).to eq('happy-sad-meh')
      end
    end

    context 'token is bogus' do
      it 'returns nil' do
        expect(AuthToken.subject_for('blah', 'secret', 'not-issuer')).to eq(nil)
      end
    end
  end
end
