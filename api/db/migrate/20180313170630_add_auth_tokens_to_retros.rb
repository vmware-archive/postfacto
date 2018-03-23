class AddAuthTokensToRetros < ActiveRecord::Migration[5.1]
  def change
    add_column :retros, :auth_token, :string
  end
end
