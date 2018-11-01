class RemoveRetrosAuthToken < ActiveRecord::Migration[5.2]
  def change
    remove_column :retros, :auth_token
  end
end
