class Archive < ApplicationRecord
  belongs_to :retro
  has_many :items
  has_many :action_items
end
