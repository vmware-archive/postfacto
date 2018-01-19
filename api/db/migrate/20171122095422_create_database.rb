#
# Postfacto, a free, open-source and self-hosted retro tool aimed at helping
# remote teams.
#
# Copyright (C) 2016 - Present Pivotal Software, Inc.
#
# This program is free software: you can redistribute it and/or modify
#
# it under the terms of the GNU Affero General Public License as
#
# published by the Free Software Foundation, either version 3 of the
#
# License, or (at your option) any later version.
#
#
#
# This program is distributed in the hope that it will be useful,
#
# but WITHOUT ANY WARRANTY; without even the implied warranty of
#
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#
# GNU Affero General Public License for more details.
#
#
#
# You should have received a copy of the GNU Affero General Public License
#
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
#
class CreateDatabase < ActiveRecord::Migration[5.1]
  def change
    # Account for existing instances
    if ActiveRecord::Base.connection.table_exists? 'retros'
      puts 'Migration skipped as database has already been created'
      return
    end

    create_table 'admin_users' do |t|
      t.string 'email', default: '', null: false
      t.string 'encrypted_password', default: '', null: false
      t.string 'reset_password_token'
      t.datetime 'reset_password_sent_at'
      t.datetime 'remember_created_at'
      t.integer 'sign_in_count', default: 0, null: false
      t.datetime 'current_sign_in_at'
      t.datetime 'last_sign_in_at'
      t.string 'current_sign_in_ip'
      t.string 'last_sign_in_ip'
      t.timestamps
      t.index ['email'], name: 'index_admin_users_on_email', unique: true
      t.index ['reset_password_token'], name: 'index_admin_users_on_reset_password_token', unique: true
    end

    create_table 'users' do |t|
      t.string 'email'
      t.string 'name'
      t.datetime 'created_at', null: false
      t.datetime 'updated_at', null: false
      t.string 'auth_token', null: false
      t.string 'company_name'
    end

    create_table 'retros' do |t|
      t.text 'name'
      t.timestamps
      t.text 'encrypted_password'
      t.text 'salt'
      t.datetime 'retro_item_end_time'
      t.string 'video_link', null: false
      t.belongs_to 'user'
      t.boolean 'is_private'
      t.string 'slug'
      t.boolean 'send_archive_email', default: true
      t.index ['slug'], name: 'index_retros_on_slug', unique: true
    end

    create_table 'action_items' do |t|
      t.belongs_to 'retro'
      t.text 'description', null: false
      t.timestamps
      t.boolean 'done', default: false, null: false
      t.datetime 'archived_at'
      t.belongs_to 'archive'
      t.boolean 'archived', default: false, null: false
    end

    create_table 'archives' do |t|
      t.belongs_to 'retro'
      t.timestamps
    end

    create_table 'items' do |t|
      t.belongs_to 'retro'
      t.text 'description', null: false
      t.text 'category', null: false
      t.integer 'vote_count', default: 0, null: false
      t.timestamps
      t.boolean 'done', default: false, null: false
      t.datetime 'archived_at'
      t.integer 'archive_id'
      t.boolean 'archived', default: false, null: false
    end

    add_reference 'retros', 'highlighted_item', foreign_key: { to_table: 'items', on_delete: :nullify }
  end
end
