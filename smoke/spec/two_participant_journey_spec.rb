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
require 'securerandom'

describe 'A Journey Of Two Participants', type: :feature, js: true do

  before(:all) do
    test_id = SecureRandom.alphanumeric(6)
    @retro_slug = 'my-awesome-new-private-retro' + test_id
    @retro_url = RETRO_APP_BASE_URL + '/retros/' + @retro_slug
    @retro_name = 'My awesome new private retro'
    @retro_password = SecureRandom.alphanumeric(32)
  end

  after(:all) do
    delete_retro_as_admin(@retro_slug)
    expect(page).not_to have_content(@retro_slug), "Failed to delete retro with slug #{@retro_slug}. This was created for testing purposes, please delete manually."
  end

  specify 'Journey' do
    in_browser(:alex) do
      create_retro_as_admin(@retro_name, @retro_slug, @retro_password)
    end

    in_browser(:peter) do
      visit_retro_board(@retro_url, @retro_password)
      expect(page).to have_content(@retro_name)
    end

    in_browser(:felicity) do
      visit_retro_board(@retro_url, @retro_password)
      expect(page).to have_content(@retro_name)

      fill_in("I'm glad that...", with: 'this is a happy item')
      find('.column-happy textarea.retro-item-add-input').native.send_keys(:return)

      expect(page).to have_content 'this is a happy item'
    end

    in_browser(:peter) do
      expect(page).to have_content 'this is a happy item'

      fill_in("It wasn't so great that...", with: 'this is a sad item')
      find('.column-sad textarea.retro-item-add-input').native.send_keys(:return)

      expect(page).to have_content 'this is a sad item'
    end

    in_browser(:felicity) do
      expect(page).to have_content 'this is a sad item'

      fill_in("Add an action item", with: 'this is an action')
      find('.retro-action-header .retro-item-add-input').native.send_keys(:return)

      expect(page).to have_content('this is an action')
    end

    in_browser(:peter) do
      expect(page).to have_content('this is an action')
    end

    in_browser(:felicity) do
      click_menu_item 'Archive this retro'
      click_button 'Archive'
    end

    in_browser(:peter) do
      expect(page).to_not have_css('.retro-item')
    end
  end
end
