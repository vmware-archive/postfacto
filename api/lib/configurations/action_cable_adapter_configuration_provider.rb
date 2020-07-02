require 'configurations/redis_configuration_provider'

class ActionCableAdapterConfigurationProvider
  def cable_config
    if use_postgres_as_adapter?
      postgres_adapter
    else
      redis_adapter
    end.to_json
  end

  private

  def use_postgres_as_adapter?
    ENV['USE_POSTGRES_FOR_ACTION_CABLE'] == 'true'
  end

  def postgres_adapter
    {
      adapter: 'postgresql'
    }
  end

  def redis_adapter
    {
      adapter: 'redis',
      url: RedisConfigurationProvider.new.redis_config
    }
  end
end
