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

context 'Peter the mobile user', type: :feature, js: true do
  specify 'Journey' do

    # Resize the screen as small as a regular smart phone
    page.driver.resize_window_to(page.driver.current_window_handle, 360, 600)
    visit_home_page
    page.execute_script('window.scrollTo(0,250)')
    register('journey-mobile-user')

    # Creating a new retro
    visit_retro_new_page
    fill_in 'Team name', with: 'My Retro'
    fill_in 'team-name', with: Time.now.strftime('%Y%m%d%H%M%s')
    fill_in 'Create password', with: 'password'

    scroll_to_bottom
    click_button 'Create'

    expect(page).not_to have_content 'Time to make your team retro!'

    # Adding some retro items
    try_count = 3

    # Add retrying to searching for mobile tab.
    # For some reason this is necessary and we were desperate.
    begin
      find('.mobile-tab-meh').click
    rescue => e
      puts 'Retrying mobile tab!'
      try_count -= 1
      retry if try_count > 0
      raise e
    end

    fill_in("I'm wondering about...", with: 'this is a meh item')
    find('.column-meh .retro-item-add-input').native.send_keys(:return)
    find('div.retro-item', text: 'this is a meh item')

    size = all('div.retro-item').length
    # Adding an empty item
    find('.column-meh .retro-item-add-input').native.send_keys(:return)
    expect(all('div.retro-item').length).to eq(size)

    # Vote
    within('div.retro-item', text: 'this is a meh item') do
      find('.item-vote-submit').click
      expect(page).to have_content '1'
    end

    # Try to highlight but can't
    find('div.retro-item div.item-text', text: 'this is a meh item').click
    expect(page).not_to have_css('.highlight')

    # Update an item
    within('div.retro-item', text: 'this is a meh item') do
      find('.item-edit i').click
      fill_in 'edit-text-field', with: 'this is an updated item'
      find('.edit-save').click
    end
    expect(page).not_to have_content 'this is a meh item'
    expect(page).to have_content 'this is an updated item'

    # Delete an item
    within('div.retro-item', text: 'this is an updated item') do
      find('.item-edit i').click
      expect(page).to have_css('.edit-delete')
      find('.edit-delete i').click
    end
    expect(page).not_to have_content 'this is an updated item'

    # Adding some action items
    find('.mobile-tab-action').click
    fill_in('Add an action item', with: 'that is an action to do')
    find('.retro-action-header .retro-item-add-input').native.send_keys(:return)

    expect(page).to have_content 'that is an action to do'
  end
end
