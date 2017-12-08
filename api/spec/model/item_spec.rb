require 'rails_helper'

describe Item do
  let(:retro) { Retro.create!(name: 'My Retro', video_link: 'the-video-link') }

  it 'is an active record model' do
    item = retro.items.new(description: 'this is a happy item', category: Item.categories.fetch(:happy))

    item.save
  end

  describe '#vote!' do
    it 'increments vote_count' do
      item = Item.create!(
        retro: retro,
        description: 'this is a happy item',
        category: Item.categories.fetch(:happy)
      )

      3.times do
        item.vote!
      end

      expect(item.vote_count).to eq(3)
    end

    it 'is atomic' do
      item1 = Item.create!(
        retro: retro,
        description: 'this is a happy item',
        category: Item.categories.fetch(:happy)
      )

      item2 = Item.find(item1.id)

      item1.vote!
      item2.vote!

      expect(item1.reload.vote_count).to eq(2)
    end
  end
end
