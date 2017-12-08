class ActionItemsController < ApplicationController
  before_action :load_retro, :authenticate_retro

  def destroy
    action_item = @retro.action_items.find(params.fetch(:id))
    action_item.destroy!
    RetrosChannel.broadcast(@retro)
    render json: :nothing, status: :no_content
  end

  def create
    @action_item = @retro.action_items.create!(action_params)
    RetrosChannel.broadcast(@retro)
    render 'show', status: :created
  end

  def update
    @action_item = @retro.action_items.find(params.fetch(:id))
    @action_item.update!(action_params)
    RetrosChannel.broadcast(@retro)
    render 'show'
  end

  private

  def action_params
    params.require(:action_item).permit(:description, :done)
  end
end
