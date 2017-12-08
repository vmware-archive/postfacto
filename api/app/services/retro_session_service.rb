class RetroSessionService
  include Singleton

  def add_retro_consumer(retro_id, request_uuid)
    @retro_to_sessions[retro_id] = get_retro_consumers(retro_id) << request_uuid
  end

  def get_retro_consumers(retro_id)
    @retro_to_sessions[retro_id] ||= []
  end

  def remove_retro_consumer(retro_id, request_uuid)
    @retro_to_sessions[retro_id] = get_retro_consumers(retro_id) - [request_uuid]
  end

  def clear!
    @retro_to_sessions.clear
  end

  private

  def initialize
    @retro_to_sessions = {}
  end
end
