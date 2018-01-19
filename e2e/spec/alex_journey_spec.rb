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
