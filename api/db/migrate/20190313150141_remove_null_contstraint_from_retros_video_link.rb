class RemoveNullContstraintFromRetrosVideoLink < ActiveRecord::Migration[5.2]
  def change
    change_column :retros, :video_link, :string, :null => true
  end
end
