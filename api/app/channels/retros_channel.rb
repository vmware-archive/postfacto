#
# Postfacto, a free, open-source and self-hosted retro tool aimed at helping
# remote teams.
#
# Copyright (C) 2016 - Present Pivotal Software, Inc.
#
# This program is free software: you can redistribute it and/or modify
#
# it under the terms of the GNU Affero General Public License as
#
# published by the Free Software Foundation, either version 3 of the
#
# License, or (at your option) any later version.
#
#
#
# This program is distributed in the hope that it will be useful,
#
# but WITHOUT ANY WARRANTY; without even the implied warranty of
#
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#
# GNU Affero General Public License for more details.
#
#
#
# You should have received a copy of the GNU Affero General Public License
#
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
#
# Be sure to restart your server when you modify this file.
# Action Cable runs in a loop that does not support auto reloading.

require 'security/auth_token'

class RetrosChannel < ApplicationCable::Channel

  def self.broadcast(retro)
    broadcast_to retro, retro: RetroSerializer.new(retro).as_json
  end

  def self.broadcast_force_relogin(retro, originator_id)
    broadcast_to retro, command: 'force_relogin', payload: { originator_id: originator_id, retro: retro.as_json(only: :slug) }

    RetroSessionService.instance
        .get_retro_consumers(retro.id)
        .each do |uuid|
          ApplicationCable::Connection.disconnect(uuid)
          RetroSessionService.instance.remove_retro_consumer(retro.id, uuid)
        end
  end

  attr_accessor :request_uuid

  def subscribed
    retro = Retro.friendly.find(params[:retro_id])
    api_token = params[:api_token]
    return unless user_allowed_to_access_retro?(retro, api_token)

    RetroSessionService.instance.add_retro_consumer(retro.id, request_uuid)

    stream_for(retro, lambda do |message|
      transmit ActiveSupport::JSON.decode(message)
    end)
  end

  def unsubscribed
    retro = Retro.friendly.find(params[:retro_id])
    api_token = params[:api_token]
    return unless user_allowed_to_access_retro?(retro, api_token)

    RetroSessionService.instance.remove_retro_consumer(retro.id, request_uuid)
  end

  private

  def user_allowed_to_access_retro?(retro, api_token)
    return true unless retro.is_private?
    retro.slug == AuthToken.subject_for(
      api_token,
      Rails.application.secrets.secret_key_base,
      'retros'
    )
  end
end
