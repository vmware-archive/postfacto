json.retro do
  json.call(@retro, :id, :name, :video_link, :created_at, :highlighted_item_id, :retro_item_end_time)
  json.items @archive.items, partial: 'items/item', as: :item
  json.action_items @archive.action_items, partial: 'action_items/action_item', as: :action_item
end

json.archive do
  json.id @archive.id
end
