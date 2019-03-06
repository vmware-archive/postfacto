class RemoveUsersAuthToken < ActiveRecord::Migration[5.2]
  def change
    remove_column :users, :auth_token
  end
end
