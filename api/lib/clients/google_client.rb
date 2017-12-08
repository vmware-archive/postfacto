require 'rest-client'

class GoogleClient
  def initialize(url)
    @url = url
  end

  def get_user!(access_token)
    response = RestClient.get(@url, Authorization: "Bearer #{access_token}")
    user = JSON.parse(response.body, symbolize_names: true)

    validate_hosted_domain user

    user
  rescue InvalidUserDomain => e
    raise e
  rescue
    raise GetUserFailed.new
  end

  def validate_hosted_domain(user)
    if HOSTED_DOMAIN
      if user[:hd] != HOSTED_DOMAIN
        raise InvalidUserDomain.new
      end
    end
  end

  class GetUserFailed < StandardError
  end
  class InvalidUserDomain < StandardError
  end
end
