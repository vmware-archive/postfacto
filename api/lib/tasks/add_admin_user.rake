namespace :admin do
  desc 'Setup admin user based on ADMIN_EMAIL and ADMIN_PASSWORD env variables'
  task create_user: :environment do
    unless AdminUser.where(email: ENV['ADMIN_EMAIL']).first
      AdminUser.create!(
        email: ENV['ADMIN_EMAIL'],
        password: ENV['ADMIN_PASSWORD'],
        password_confirmation: ENV['ADMIN_PASSWORD']
      )
    end
  end
end
