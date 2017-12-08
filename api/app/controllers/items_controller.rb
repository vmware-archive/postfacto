class ItemsController < ApplicationController
  before_action :load_retro, :authenticate_retro

  def destroy
    item = @retro.items.find(params.fetch(:id))
    item.destroy!

    broadcast
    render json: :nothing, status: :no_content
  end

  def create
    @item = @retro.items.create!(item_params)
    broadcast
    render 'show', status: :created
  end

  def vote
    @item = @retro.items.find(params.fetch(:item_id))
    @item.vote!
    broadcast
    render 'show'
  end

  def update
    @retro.items.find(params.fetch(:id)).update!(update_item_params)

    broadcast
    render json: :nothing, status: :no_content
  end

  def done
    item = @retro.items.find(params.fetch(:item_id))
    item.done = done_value
    item.save!

    if @retro.highlighted_item_id == item.id
      @retro.highlighted_item_id = nil
      @retro.save!
    end

    broadcast
    render json: :nothing, status: :no_content
  end

  private

  def broadcast
    RetrosChannel.broadcast(@retro)
  end

  def item_params
    params.require(:item).permit(:description, :category)
  end

  def update_item_params
    params.require(:item).permit(:description)
  end

  def done_value
    params.include?(:done) ? params.fetch(:done) : true
  end
end
