class SessionTimeConfigurationProvider
  def initialize(env)
    @env = env
  end

  def config
    Integer(@env['SESSION_TIME']).minutes
  rescue ArgumentError
    nil
  rescue TypeError # rubocop:disable Lint/DuplicateBranch
    nil
  end
end
