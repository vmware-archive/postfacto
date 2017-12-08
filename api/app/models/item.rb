class Item < ActiveRecord::Base
  belongs_to :retro
  belongs_to :archive
  enum category: { happy: 'happy', meh: 'meh', sad: 'sad' }

  def vote!
    Item.where(id: id).update_all('vote_count = vote_count + 1')
    reload
  end
end
