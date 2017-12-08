class DiscussionsController < ApplicationController
  before_action :load_retro, :authenticate_retro

  def create
    item = @retro.items.find(params.require(:item_id))
    @retro.highlighted_item_id = item.id
    @retro.retro_item_end_time = 5.minutes.from_now
    @retro.save!

    RetrosChannel.broadcast(@retro)
    render 'retros/show'
  end

  def update
    @retro.retro_item_end_time = 2.minutes.from_now
    @retro.save!

    RetrosChannel.broadcast(@retro)
    render 'retros/show'
  end

  def destroy
    @retro.highlighted_item_id = nil
    @retro.save!

    RetrosChannel.broadcast(@retro)
    render json: :nothing, status: :no_content
  end
end
