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
require 'pry-byebug'

context 'Felicity', type: :feature, js: true, if: ENV['USE_MOCK_GOOGLE'] == 'true' do
  context 'when they have not registered before' do
    describe 'they visit the home page' do
      before do
        logout
        visit_home_page
      end

      specify 'they can learn about retros' do
        click_on 'What\'s a retro?'
        select_last_tab
        expect(page).to have_content('How to Run a Really Good Retrospective')
      end

      specify 'they can get help' do
        expect(page).to have_css('a[href="mailto:postfacto@example.com"]', text: 'Contact Us')
      end

      specify 'they can register and create a retro' do
        page.driver.execute_script("window.mock_google_auth = 'expected-valid-access-token_my-email';")
        find('.top-start-retro').click()

        expect(page).to have_field('Email', with: 'my-email@example.com', disabled: true)
        expect(page).to have_field('Full Name', with: 'my full name')
        fill_in 'Full Name', with: 'my edited full name'
        expect(page).to have_field('Company Name', with: '')
        fill_in 'Company Name', with: 'my company name'

        expect(page).to have_content('By continuing, you agree to Postfacto\'s Terms of Use and Privacy Policy')
        expect(page).to have_link('Terms of Use', href: '/terms')
        expect(page).to have_link('Privacy Policy', href: '/privacy')


        click_on 'Next: Make a retro'
        expect(page).to have_content('Time to make your team retro!')

        logout

        visit_home_page
        page.driver.execute_script("window.mock_google_auth = 'expected-valid-access-token_my-email';")

        find('.top-start-retro').click()

        expect(page).to have_content('Time to make your team retro!')
        fill_in 'Team name', with: 'My New User Retro'

        expect(page).to have_content(RETRO_APP_BASE_URL.split('://')[1] + '/retros/')
        fill_in 'team-name', with: Time.now.strftime('%Y%m%d%H%M%s')

        fill_in 'Create password', with: 'password'
        click_button 'Create'

        expect(page).to have_content('My New User Retro')
        expect(page).to have_content('When you\'ve addressed the item, mark it as "Done".')
      end
    end
  end

  context 'when they have registered before' do
    before(:all) do
      register('multiple-retro-user')
      create_public_retro('best team', 'best-team')
      create_public_retro('worst team', 'worst-team')
    end

    before(:each) do
      login('multiple-retro-user')
    end

    describe 'visiting the home page' do
      before do
        visit_home_page
      end

      specify 'sees their retro list' do
        expect(page).to have_content('best team')
        expect(page).to have_content('worst team')

        find('.retro-list-tile', text: 'best team').click
        expect(current_url).to end_with('retros/best-team')
      end

      describe 'clicking new retro' do
        specify 'lets them create a new retro' do
          click_on 'NEW RETRO'
          expect(current_url).to end_with('retros/new')
        end
      end

      describe 'clicking sign out' do
        specify 'returns to the home page and signs them out' do
          click_on 'SIGN OUT'

          expect(current_url).to eq(RETRO_APP_BASE_URL + "/")
          expect(page).to have_content("Postfacto helps you run better retrospectives.")

          visit_home_page
          expect(page).to have_content("Postfacto helps you run better retrospectives.")
          expect(page).to_not have_content('best team')
          expect(page).to_not have_content('worst team')
        end
      end
    end

    describe 'changing retro settings' do
      before do
        retro_url = create_public_retro('Settings Retro')
        visit retro_url
        click_menu_item 'Retro settings'
      end

      specify 'can change retro url' do
        expect(page).to have_content(RETRO_APP_BASE_URL.split('://')[1] + '/retros/')

        fill_in 'retro_url', with: 'changed-url'
        click_on 'Save changes'

        expect(page).to have_content('Action items')
        expect(current_url).to end_with('/changed-url')
      end

      specify 'can add video url' do
        fill_in 'video_link', with: 'https://example.com'
        click_on 'Save changes'

        click_on 'VIDEO'
        select_last_tab
        expect(current_url).to eq('https://example.com/')
      end

      specify 'can remove video url' do
        fill_in 'video_link', with: ' '
        find('#retro_video_link').send_keys(:backspace)
        click_on 'Save changes'

        expect(page).to_not have_content('VIDEO')
      end
    end

    describe 'archiving a retro' do
      describe 'summary email option' do
        xspecify 'is remembered from the last retro' do
          retro_url = create_public_retro

          visit retro_url
          fill_in("I'm glad that...", with: 'this is the first item')
          find('.column-happy textarea.retro-item-add-input').native.send_keys(:return)

          find('div.retro-item', text: 'this is the first item').click
          within('div.retro-item', text: 'this is the first item') do
            expect(page).to have_css('.item-done')
            find('.item-done').click
          end

          expect(page).to have_content('Archive this retro?')
          within('.archive-dialog') do
            expect(page).to have_content('Yes')
            expect(page).to have_content('Archive & send email')
          end

          find('#send_archive_email', visible: :all).click
          click_on 'Archive'

          visit retro_url
          fill_in("I'm glad that...", with: 'this is the first item')
          find('.column-happy textarea.retro-item-add-input').native.send_keys(:return)

          find('div.retro-item', text: 'this is the first item').click
          within('div.retro-item', text: 'this is the first item') do
            expect(page).to have_css('.item-done')

            sleep(5)
            find('.item-done').click
          end

          expect(page).to have_content('Archive this retro?')
          within('.archive-dialog') do
            expect(page).to have_content('No')
            expect(page).to_not have_content('Archive & send email')
          end
        end
      end
    end
  end

  specify 'Auto facilitation journey' do
    register('felicity-auto-facilitate-user')
    create_public_retro
    retro_url = create_public_retro
    visit retro_url

    fill_in("I'm glad that...", with: 'something really happy')
    find('.column-happy textarea.retro-item-add-input').native.send_keys(:return)
    within('div.retro-item', text: 'something really happy') do
      4.times do |index|
        find('.item-vote-submit').click
        expect(page).to have_content(index + 1)
      end
    end

    fill_in("I'm glad that...", with: 'something happy 1')
    find('.column-happy textarea.retro-item-add-input').native.send_keys(:return)
    fill_in("I'm wondering about...", with: 'something meh 1')
    find('.column-meh textarea.retro-item-add-input').native.send_keys(:return)
    fill_in("It wasn't so great that...", with: 'something sad 1')
    find('.column-sad textarea.retro-item-add-input').native.send_keys(:return)

    def send_right_key
      # Chrome web driver only allows sending key events on focusable elements, this button has a tabindex so is focusable
      keyEventReciever = first('a')
      keyEventReciever.native.send_keys(:right)
    end

    send_right_key
    expect(page).to have_css('.highlight .item-text', text: 'something happy 1')

    # Should not affect right keypresses in textareas
    keyEventReciever = first('.retro-item-add-input')
    keyEventReciever.native.send_keys(:right)
    sleep(1)
    expect(page).to have_css('.highlight .item-text', text: 'something happy 1')

    send_right_key
    expect(page).to have_css('.highlight .item-text', text: 'something meh 1')

    send_right_key
    expect(page).to have_css('.highlight .item-text', text: 'something sad 1')

    send_right_key
    expect(page).to have_css('.highlight .item-text', text: 'something really happy')

    send_right_key
    sleep(1)
    expect(page).to have_content('The board will be cleared ready for your next retro and incomplete action items will be carried across.')
  end

  specify 'Journey' do
    logout
    # Visiting create a new retro
    visit_home_page
    expect(page).to have_content('A retro app for successful teams.')
    expect(page).to have_content('Postfacto helps you run better retrospectives.')

    # Creating a new retro
    register('felicity-journey-user')
    visit_retro_new_page

    expect(page).to have_content('Time to make your team retro!')
    fill_in 'Team name', with: 'My Retro'
    fill_in 'team-name', with: Time.now.strftime('%Y%m%d%H%M%s')
    fill_in 'Create password', with: 'password'
    click_button 'Create'

    expect(page).to have_css '.column-happy .retro-item-list-header'
    expect(page).to have_css '.column-meh .retro-item-list-header'
    expect(page).to have_css '.column-sad .retro-item-list-header'

    # Add two items
    # Adding some retro items
    fill_in("I'm glad that...", with: 'this is the first item')
    find('.column-happy textarea.retro-item-add-input').native.send_keys(:return)

    fill_in("I'm wondering about...", with: 'this is the last item')
    find('.column-meh textarea.retro-item-add-input').native.send_keys(:return)

    mark_all_retro_items_as_done

    expect(page).to have_content('The board will be cleared ready for your next retro and incomplete action items will be carried across.')

    # Archive
    click_button 'Archive & send email'
    expect(page).to have_content('Archived!')
    expect(page).to_not have_content('The board will be cleared ready for your next retro and incomplete action items will be carried across.')

    # Adding some retro items
    fill_in("I'm glad that...", with: 'this is a happy item')
    find('.column-happy textarea.retro-item-add-input').native.send_keys(:return)

    sleep(1) # make sure these actually happen one after the other
    fill_in("I'm wondering about...", with: 'this is a meh item')
    find('.column-meh textarea.retro-item-add-input').native.send_keys(:return)

    sleep(1) # make sure these actually happen one after the other
    fill_in("It wasn't so great that...", with: 'this is a sad item')
    find('.column-sad textarea.retro-item-add-input').native.send_keys(:return)

    expect(page).to have_content 'this is a happy item'
    expect(page).to have_content 'this is a meh item'
    expect(page).to have_content 'this is a sad item'

    fill_in("I'm glad that...", with: '2nd happy item')
    find('.column-happy textarea.retro-item-add-input').native.send_keys(:return)
    fill_in("I'm glad that...", with: '3rd happy item')
    find('.column-happy textarea.retro-item-add-input').native.send_keys(:return)

    # Update an item
    fill_in("I'm glad that...", with: 'happy item to be updated')
    find('.column-happy textarea.retro-item-add-input').native.send_keys(:return)

    within('div.retro-item', text: 'happy item to be updated') do
      find('.item-edit i').click
      fill_in 'edit-text-field', with: 'updated happy item'
      find('.edit-save').click
    end
    expect(page).not_to have_content 'happy item to be updated'
    expect(page).to have_content 'updated happy item'

    # Delete an item
    within('div.retro-item', text: 'updated happy item') do
      find('.item-edit i').click
      expect(page).to have_css('.edit-delete')
      find('.edit-delete i').click
    end
    expect(page).not_to have_content 'updated happy item'

    # Vote
    within('div.retro-item', text: '2nd happy item') do
      4.times do |index|
        find('.item-vote-submit').click
        expect(page).to have_content(index + 1)
      end
    end

    # Columns Sorted By Time By Default
    happy_items = all('.column-happy div.retro-item div.item-text').map(&:text)
    expect(happy_items).to eq(['3rd happy item', '2nd happy item', 'this is a happy item'])

    # Felicity Can Sort By Votes
    within('div.retro-item', text: 'this is a happy item') do
      2.times do
        find('.item-vote-submit').click
      end
    end

    # No timer is displayed (no highlighted item)
    expect(page).not_to have_css('.retro-item-timer')

    # Highlight an item
    select_item('this is a meh item')
    expect(page).to have_css('.highlight .item-text', text: 'this is a meh item')

    # Timer is now displayed
    time_left = Time.parse('00:' + find('.retro-item-timer .retro-item-timer-clock').text)
    expect(time_left.min).to be <= 5

    # Try to highlight another item
    find('div.retro-item', text: 'this is a happy item').click
    expect(page).to have_css('.highlight .item-text', text: 'this is a meh item')

    # Un-highlight the item
    find('div.retro-item', text: 'this is a meh item').click
    expect(page).not_to have_css '.highlight'
    expect(page).not_to have_css '.retro-item-timer-clock'

    # Retry highlighting
    select_item('this is a happy item')

    within('.highlight .item-text button') do
      expect(page).to have_content('this is a happy item')
    end

    expect(page).to have_css '.retro-item-timer-clock'

    # Cancel highlight
    within('div.retro-item', text: 'this is a happy item') do
      find('.retro-item-cancel').click
    end
    expect(page).not_to have_css '.highlight'

    # Re-highlight
    find('div.retro-item', text: 'this is a happy item').click

    # Done an item
    sleep(1)
    within('div.retro-item.highlight', text: 'this is a happy item') do
      expect(page).to have_css('.item-done')
      find('.item-done').click
    end

    expect(page).not_to have_css '.highlight'
    expect(page).not_to have_css '.retro-item-timer-clock'

    within(find('div.retro-item.discussed', text: 'this is a happy item')) do
      expect(page).to have_css('.item-discussed')
      expect(page).to_not have_css('.item-delete')
    end

    # Re-highlight the done item
    select_item('this is a happy item')

    expect(page).to have_css('.highlight .item-text', text: 'this is a happy item')
    expect(page).to have_css('.retro-item-timer-clock')
    within('div.retro-item', text: 'this is a happy item') do
      find('.retro-item-cancel').click
    end
    expect(page).not_to have_css '.highlight'
    within('div.retro-item', text: 'this is a happy item') do
      expect(page).to_not have_css('.item-discussed')
    end

    # Highlight another item
    find('div.retro-item', text: '2nd happy item').click
    expect(page).to have_css('.highlight .item-text', text: '2nd happy item')
    expect(page).to have_css('.retro-item-timer-clock')

    # Adding some action items
    fill_in('Add an action item', with: 'this is an action to be deleted')
    find('.retro-action-header .retro-item-add-input').native.send_keys(:return)
    fill_in('Add an action item', with: 'completed older action')
    find('.retro-action-header .retro-item-add-input').native.send_keys(:return)
    fill_in('Add an action item', with: 'action never to be completed')
    find('.retro-action-header .retro-item-add-input').native.send_keys(:return)
    fill_in('Add an action item', with: 'this is an action needs to be edi_ed')
    find('.retro-action-header .retro-item-add-input').native.send_keys(:return)

    expect(page).to have_content 'this is an action to be deleted'
    expect(page).to have_content 'completed older action'
    expect(page).to have_content 'action never to be completed'
    expect(page).to have_content 'this is an action needs to be edi_ed'

    # Edit an action
    within('div.retro-action', text: 'this is an action needs to be edi_ed') do
      find('.action-edit').click
      find('textarea').set('this is an action that has been changed')
      find('.edit-save').click

      expect(page).to have_content('this is an action that has been changed')
    end

    # Delete an action
    scroll_to_bottom
    within('div.retro-action', text: 'this is an action to be deleted') do
      find('.action-edit').click
      find('.edit-delete').click
    end
    expect(page).not_to have_content 'this is an action to be deleted'

    # Complete an action item
    within('div.retro-action', text: 'completed older action') do
      expect(page).to have_css '.action-tick-unchecked'
      find('.action-tick img').click
      expect(page).to have_css '.action-tick-checked'
    end

    # Try to add an empty action
    actions_number = all('div.retro-action').length
    find('.retro-action-header .retro-item-add-input').native.send_keys(:return)
    expect(all('div.retro-action').length).to eq(actions_number)

    # Change the retro settings
    click_menu_item 'Retro settings'

    expect(page).to have_content 'My Retro'

    fill_in('name', with: '')
    fill_in('name', with: 'Yet Another Retro')
    click_button('Save changes')

    expect(find('.retro-name')).to have_content('Yet Another Retro')
    expect(page).to have_content('Settings saved!')

   # Archive the retro
    click_menu_item 'Archive this retro'
    click_button 'Archive & send email'
    expect(page).to have_content('Archived!')

    expect(page).to_not have_css('.retro-item')
    expect(page).to_not have_content('completed older action')
    expect(page).to have_content('action never to be completed')

    # Setup for archived retro
    fill_in("I'm glad that...", with: 'archived happy item')
    find('.column-happy textarea.retro-item-add-input').native.send_keys(:return)

    fill_in("I'm wondering about...", with: 'archived meh item')
    find('.column-meh textarea.retro-item-add-input').native.send_keys(:return)

    fill_in("It wasn't so great that...", with: 'archived sad item')
    find('.column-sad textarea.retro-item-add-input').native.send_keys(:return)

    fill_in('Add an action item', with: 'archived action item')
    find('.retro-action-header textarea.retro-item-add-input').native.send_keys(:return)

    within('div.retro-action', text: 'archived action item') do
      find('.action-tick img').click
    end

    fill_in('Add an action item', with: 'action not to be archived')
    find('.retro-action-header .retro-item-add-input').native.send_keys(:return)

    # double check that the action to be archived is ticked off
    # as doneing an action item can take time before it gets updated in the db.
    within('div.retro-action', text: 'archived action item') do
      expect(page).to have_css '.action-tick-checked'
    end

    click_menu_item 'Archive this retro'
    click_button 'Archive & send email'
    expect(page).to have_content('Archived!')

    expect(page).not_to have_content('archived happy item')

    # Input an item to current retro
    fill_in("I'm glad that...", with: 'item not to be archived')
    find('.column-happy textarea.retro-item-add-input').native.send_keys(:return)
    within('.column-happy .retro-item') do
      expect(page).to have_content 'item not to be archived'
    end

    # View archived retros via menu
    click_menu_item 'View archives'

    expect(page).to have_content('Archives')
    all('.archive-link')[0].click

    expect(page).to have_content('archived happy item')
    expect(page).to have_content('archived meh item')
    expect(page).to have_content('archived sad item')
    expect(page).to have_content('archived action item')
    expect(page).not_to have_content('action not to be archived')
    expect(page).not_to have_content('item not to be archived')

    # Archived items should be read only
    expect(page).not_to have_css('.item-delete')
    expect(page).not_to have_css('.action-delete')
    expect(page).not_to have_css('.order-by-radio-button')
    expect(page).not_to have_css('.retro-item-add-input')
    expect(page).not_to have_css('.retro-action-header .retro-item-add-input')
    expect(page).not_to have_css('.retro-name a')

    # It should not display archived items older than the latest archive
    expect(page).not_to have_content('this is a happy item')
    expect(page).not_to have_content('this is a meh item')
    expect(page).not_to have_content('this is a sad item')

    # Click BACK button to return
    click_button('Archives')
    click_button('Current retro')

    expect(page).to have_content('action not to be archived')
    expect(page).to have_content('item not to be archived')
  end
end
