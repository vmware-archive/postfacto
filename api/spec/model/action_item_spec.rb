require 'rails_helper'

describe ActionItem do
  it 'is an active record model' do
    retro = Retro.create!(name: 'My Retro', video_link: 'the-video-link')
    action_item = retro.action_items.new(description: 'this is an action')

    action_item.save
  end
end
