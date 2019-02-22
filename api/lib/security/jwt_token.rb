require 'jwt'

class JWTToken
  def self.generate(retro_slug, current_time, session_time_limit, secret)
    payload = { slug: retro_slug }
    payload[:exp] = (current_time + session_time_limit).to_i if session_time_limit
    JWT.encode(payload, secret, 'HS256')
  end

  def self.valid?(retro_slug, token, secret)
    decoded = JWT.decode(token, secret, true, algorithm: 'HS256')
    decoded.first['slug'] == retro_slug
  rescue JWT::ExpiredSignature
    false
  rescue JWT::DecodeError
    false
  end
end
