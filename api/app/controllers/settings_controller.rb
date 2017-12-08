class SettingsController < ApplicationController
  before_action :authenticate_retro_admin

  def index
    render json: { retro: @retro.as_json(only: [:id, :name, :slug, :is_private]) }, status: :ok
  end
end
