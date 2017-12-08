# Be sure to restart your server when you modify this file.
# Action Cable runs in a loop that does not support auto reloading.
class SessionsChannel < ApplicationCable::Channel
  def subscribed
    transmit(command: 'initiate_session', payload: { request_uuid: request_uuid })
  end
end
