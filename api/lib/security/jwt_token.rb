require 'jwt'

class JWTToken
  def self.generate(subject, issuer, current_time, session_time_limit, secret)
    payload = { sub: subject, iss: issuer }
    payload[:exp] = (current_time + session_time_limit).to_i if session_time_limit
    JWT.encode(payload, secret, 'HS256')
  end

  def self.valid?(subject, token, secret)
    decoded = JWT.decode(token, secret, true, algorithm: 'HS256')
    decoded.first['sub'] == subject
  rescue JWT::ExpiredSignature
    false
  rescue JWT::DecodeError
    false
  end
end
