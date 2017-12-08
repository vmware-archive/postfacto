unless AdminUser.where(email: 'admin@example.com').first
  AdminUser.create!(
    email: 'admin@example.com',
    password: 'secret',
    password_confirmation: 'secret'
  )
end

User.find_or_create_by!(
  email: 'labs-sydney-devs@example.com',
  name: 'Test User',
  auth_token: 'secret-test-user-token-ef87c521b979'
)

User.find_or_create_by!(
  email: 'user-without-retro@example.com',
  name: 'Rey Troless',
  auth_token: 'secret-test-user-token-ef87c521b970'
)

alda = User.find_or_create_by!(
  email: 'user-with-retro@example.com',
  name: 'Alda Retros',
  auth_token: 'secret-test-user-token-ef87c521b971'
)

Retro.find_or_create_by!(
  name: "Alda's personal retro",
  user: alda
)
