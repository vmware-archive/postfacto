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
require 'capybara/rspec'
require 'rspec/retry'
require 'selenium/webdriver'
require 'securerandom'

Capybara.register_driver(:headless_chrome) do |app|
  options = ::Selenium::WebDriver::Chrome::Options.new(
    args: ['--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage']
  )

  Capybara::Selenium::Driver.new(
    app,
    browser: :chrome,
    options: options
  )
end

RETRO_APP_BASE_URL = ENV['BASE_WEB_URL'] || 'http://localhost:4000'
RETRO_ADMIN_BASE_URL = ENV['BASE_ADMIN_URL'] || 'http://localhost:4000/admin'

Capybara.run_server = false
Capybara.default_driver = :headless_chrome
Capybara.app_host = RETRO_APP_BASE_URL
Capybara.javascript_driver = :headless_chrome
Capybara.default_max_wait_time = 10

module SpecHelpers
  def click_menu_item(menu_item)
    scroll_to_top

    find('.retro-menu button').click
    expect(page).to have_content(menu_item)
    find('.retro-menu-item', text: menu_item).click
    expect(page).not_to have_content(menu_item)
  end

  def in_browser(name, &block)
    old_session = Capybara.session_name

    Capybara.session_name = name
    result = block.call
    Capybara.session_name = old_session

    return result
  end

  def close_current_tab
    page.driver.browser.close
  end

  def select_last_tab
    page.driver.browser.switch_to.window(page.driver.browser.window_handles.last)
  end

  def add_auth_token
    page.driver.execute_script("window.localStorage.setItem('authToken', 'secret-test-user-token-ef87c521b979');")
  end

  def create_private_retro(team_name = nil)
    fill_in_create_retro_form
    submit_create_retro_form(team_name)
  end

  def create_public_retro(team_name = nil, slug = nil)
    fill_in_create_retro_form(team_name, slug)
    find('#retro_is_private', visible: :all).click  # visible all should not be required. Not sure why it fails
    submit_create_retro_form(team_name)
  end

  def fill_in_create_retro_form(team_name = nil, slug = nil)
    visit RETRO_APP_BASE_URL + '/'

    visit_retro_new_page

    expect(current_url).to have_content(RETRO_APP_BASE_URL + '/retros/new')

    fill_in 'Team name', with: team_name || 'My Retro'
    fill_in 'team-name', with: slug || SecureRandom.uuid
    fill_in 'Create password', with: 'password'
  end

  def submit_create_retro_form(team_name = nil)
    click_button 'Create'
    expect(page).to have_content(team_name || 'My Retro') # DONT DELETE ME: We need to make sure that we are on the retro board page before returning the current_url
    current_url
  end

  def register(email)
    logout
    visit_home_page
    page.driver.execute_script("window.mock_google_auth = 'expected-valid-access-token_#{email}';")

    find('.top-start-retro').click()

    fill_in 'Full Name', with: 'my edited full name'
    fill_in 'Company Name', with: 'my company name'

    scroll_to_bottom
    click_on 'Next: Make a retro'

    expect(page).to have_content('Time to make your team retro!')
  end

  def login(email)
    logout
    visit_home_page
    page.driver.execute_script("window.mock_google_auth = 'expected-valid-access-token_#{email}';")

    find('.top-start-retro').click()

    expect(page).to have_content('My Retros')
  end

  def logout
    visit RETRO_APP_BASE_URL + '/config.js'
    page.driver.execute_script('window.localStorage.clear();')
  end

  def visit_home_page(countryCode = 'GB')
    visit RETRO_APP_BASE_URL + "/?countryCode=#{countryCode}"
  end

  def visit_my_retros_page
    visit RETRO_APP_BASE_URL + '/retros'
  end

  def visit_retro_new_page
    visit RETRO_APP_BASE_URL + '/retros/new'
  end

  def visit_active_admin_page
    visit RETRO_ADMIN_BASE_URL
  end

  def login_as_admin
    visit_active_admin_page

    fill_in 'admin_user_email', with: 'admin@example.com'
    fill_in 'admin_user_password', with: 'secret'
    click_on 'Login'
  end

  def scroll_to_bottom
    page.execute_script('window.scrollTo(0,100000)')
  end

  def scroll_to_top
    page.execute_script('window.scrollTo(0,0)')
  end

  def mark_all_retro_items_as_done
    sleep(0.3)
    find_all('div.retro-item').each do |retro_item|
      retro_item.click
      sleep(0.3)
      retro_item.find('.item-done').click
    end
  end

  def in_browser(name, &block)
    old_session = Capybara.session_name

    Capybara.session_name = name
    value = block.call
    Capybara.session_name = old_session

    value
  end

  def select_item(item_text)
    find('.item-text', text: item_text).click
    sleep 1
  end
end

RSpec.configure do |c|
  c.include SpecHelpers
  c.filter_run focus: true
  c.run_all_when_everything_filtered = true
  c.verbose_retry = true
  c.display_try_failure_messages = true
  c.around :each, :js do |ex|
    ex.run_with_retry retry: 1
  end
end
