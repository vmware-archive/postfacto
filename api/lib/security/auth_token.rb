require 'jwt'

module AuthToken
  def self.generate(subject, issuer, current_time, session_time_limit, secret)
    payload = { sub: subject, iss: issuer }
    payload[:exp] = (current_time + session_time_limit).to_i if session_time_limit
    JWT.encode(payload, secret, 'HS256')
  end

  def self.subject_for(token, secret, issuer)
    decoded = JWT.decode(token, secret, true, algorithm: 'HS256', iss: issuer, verify_iss: true)
    decoded.first['sub']
  rescue JWT::InvalidIssuerError
    nil
  rescue JWT::ExpiredSignature
    nil
  rescue JWT::DecodeError
    nil
  end
end
