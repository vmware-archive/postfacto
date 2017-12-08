class Clock
  attr_writer :time

  def current_time
    @time || Time.now.utc
  end
end
