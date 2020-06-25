json.retro do
  json.call(
    @retro, :id, :slug, :name, :is_private, :video_link,
    :created_at, :highlighted_item_id, :retro_item_end_time, :send_archive_email,
    :join_token
  )
  json.items @retro.items, partial: 'items/item', as: :item
  json.action_items @retro.action_items, partial: 'action_items/action_item', as: :action_item
  json.archives do
    json.array! @retro.archives, :id
  end
end
