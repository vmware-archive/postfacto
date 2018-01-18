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
ActiveAdmin.register User do
  actions :all, except: [:update, :edit, :destroy]

  member_action :delete, method: :delete do
    if resource.retros.empty?
      resource.destroy!
      redirect_to admin_users_path, notice: 'User deleted!'
    else
      redirect_to admin_users_path, flash: { error: 'User owns Retros!' }
    end
  end

  permit_params :name, :email, :company_name

  scope('Retro Owners') { |users| users.joins(:retros).group('users.id') }
  scope('Activated Users') { |users| users.joins(retros: { archives: :items }).group('users.id') }

  index do
    column('ID', :id)
    column('Email', :email)
    column('Name', :name)
    column('Company Name', :company_name)
    column('Created At', :created_at)
    column('Updated At', :updated_at)
    column('Auth Token', :auth_token)
    actions defaults: true do |user|
      link_to 'Delete', delete_admin_user_path(user), method: :delete
    end
  end

  show do
    panel 'Retros' do
      table_for(user.retros) do |t|
        t.column('Id') { |retro| link_to retro.id, admin_retro_path(retro) }
        t.column('Team Name', :name)
      end
    end
  end
end
