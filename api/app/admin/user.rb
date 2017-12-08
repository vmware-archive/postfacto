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
