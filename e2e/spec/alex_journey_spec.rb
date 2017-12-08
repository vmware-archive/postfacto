require 'spec_helper'

describe 'Alex', type: :feature, js: true do
  describe 'on the users page' do
    context 'when a user has retros' do
      specify 'can delete that user' do
        visit_active_admin_page

        fill_in 'admin_user_email', with: 'admin@example.com'
        fill_in 'admin_user_password', with: 'secret'
        click_on 'Login'

        click_on 'Users'
        fill_in 'q_name', with: 'Alda Retros'
        click_on 'Filter'
        click_on 'Delete'

        expect(page).to have_content 'Alda Retros'
      end
    end

    context 'when a user does not have retros' do
      specify 'can delete that user' do
        visit_active_admin_page

        fill_in 'admin_user_email', with: 'admin@example.com'
        fill_in 'admin_user_password', with: 'secret'
        click_on 'Login'

        click_on 'Users'
        fill_in 'q_name', with: 'Rey Troless'
        click_on 'Filter'
        click_on 'Delete'

        expect(page).to_not have_content 'Rey Troless'
      end
    end
  end
end
