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
      args: ['--headless','--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage']
  )

  Capybara::Selenium::Driver.new(
      app,
      browser: :chrome,
      options: options
  )
end

RETRO_APP_BASE_URL = ENV['BASE_WEB_URL'] || 'http://localhost:4000'
RETRO_ADMIN_BASE_URL = ENV['BASE_ADMIN_URL'] || 'http://localhost:4000/admin'
RETRO_ADMIN_EMAIL = ENV['ADMIN_EMAIL'] || 'email@example.com'
RETRO_ADMIN_PASSWORD = ENV['ADMIN_PASSWORD'] || 'password'

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

  def visit_active_admin_page
    visit RETRO_ADMIN_BASE_URL
  end

  def login_as_admin
    visit_active_admin_page

    fill_in 'admin_user_email', with: RETRO_ADMIN_EMAIL
    fill_in 'admin_user_password', with: RETRO_ADMIN_PASSWORD
    click_on 'Login'
  end

  def create_retro_as_admin(name, slug, password)
    login_as_admin

    click_on 'Retros'
    click_on 'New Retro'

    fill_in 'retro_name', with: name
    fill_in 'retro_slug', with: slug
    fill_in 'retro_password', with: password

    click_on 'Create Retro'
  end

  def delete_retro_as_admin(slug)
    login_as_admin

    click_on 'Retros'
    fill_in 'q_slug', with: slug
    click_on 'Filter'

    click_on 'Delete'

    page.driver.browser.switch_to.alert.accept
  end

  def visit_retro_board(url, password)
    visit url
    fill_in 'Password', with: password
    click_button 'Login'
  end

  def scroll_to_top
    page.execute_script('window.scrollTo(0,0)')
  end

  def in_browser(name, &block)
    old_session = Capybara.session_name

    Capybara.session_name = name
    result = block.call
    Capybara.session_name = old_session

    return result
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
