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
class RetrosController < ApplicationController
  include RetrosAuth
  include UsersAuth

  before_action :load_and_authenticate_user, only: [:index, :create]
  before_action :load_and_authenticate_retro, only: [:show]
  before_action :load_and_authenticate_retro_admin, only: [:archive, :update, :update_password]

  def index
    render json: { retros: @user.retros }
  end

  def create
    @retro = @user.retros.create(retro_params)
    if @retro.valid?
      @retro.create_instruction_cards! if @user.retros.count == 1
      render json: {
        retro: @retro.as_json(only: [:id, :name, :slug]),
        token: generate_retro_token(@retro)
      }, status: :created
    else
      render json: { errors: retro_errors_hash }, status: :unprocessable_entity
    end
  end

  def update
    @retro.assign_attributes(retro_update_params.fetch(:retro))

    if @retro.save # TODO: no error handling
      broadcast_force_relogin if force_relogin_required?
      broadcast
      render json: {
        retro: @retro.as_json(only: [:id, :name, :slug, :is_private, :video_link, :join_token])
      }, status: :ok
    else
      render json: { errors: retro_errors_hash }, status: :unprocessable_entity
    end
  end

  def broadcast_force_relogin
    RetrosChannel.broadcast_force_relogin(@retro.reload, retro_update_params.fetch(:request_uuid))
  end

  def update_password
    if @retro.validate_login?(retro_update_password_params.fetch(:current_password))
      @retro.update!(password: retro_update_password_params.fetch(:new_password))

      RetrosChannel.broadcast_force_relogin(@retro.reload, retro_update_password_params.fetch(:request_uuid))
      render json: { token: generate_retro_token(@retro) }, status: :ok
    else
      render json: { errors: { 'current_password' => 'Sorry! That password does not match the current one.' } },
             status: :unprocessable_entity
    end
  end

  def archive
    RetroArchiveService.archive(@retro, Time.now, retro_archive_params.fetch(:send_archive_email, true))

    broadcast
    render 'show'
  end

  private

  def force_relogin_required?
    changes = @retro.previous_changes

    return false unless changes.key?(:is_private)

    switched_from_public_to_private(*changes[:is_private])
  end

  def switched_from_public_to_private(was_private, is_now_private)
    !was_private && is_now_private
  end

  def retro_errors_hash
    errors_hash = @retro.errors.messages
    errors_hash.each { |k, v| errors_hash[k] = v.join(' ') }
    errors_hash
  end

  def broadcast
    RetrosChannel.broadcast(@retro)
  end

  def retro_params
    params.require(:retro).permit(:name, :slug, :password, :item_order, :is_private, :is_magic_link_enabled)
  end

  def retro_archive_params
    params.permit(:send_archive_email)
  end

  def retro_update_params
    params.permit({ retro: [:name, :slug, :is_private, :video_link, :is_magic_link_enabled] }, :request_uuid)
  end

  def retro_update_password_params
    params.permit(:id, :current_password, :new_password, :request_uuid)
  end
end
