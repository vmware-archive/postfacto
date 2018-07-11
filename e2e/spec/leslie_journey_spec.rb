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

describe 'Leslie', type: :feature, js: true do
  after do
    Capybara.execute_script "localStorage.clear()"
  end

  describe 'viewing the home page' do
    before do
      visit_home_page
    end

    specify 'sees privacy policy link is in the footer' do
      scroll_to_bottom

      within('.footer') do
        expect(page).to have_link("Privacy Policy", :href=>"https://baconipsum.com/api/?type=all-meat&paras=1&start-with-lorem=1&format=html")
      end
    end

    specify 'sees terms link in the footer' do
      scroll_to_bottom

      within('.footer') do
        click_on('Terms & Conditions')
      end

      close_current_tab
      select_last_tab
      expect(page).to have_content 'Lorem ipsum'
    end

    specify 'sees banner with terms, privacy and cookie warning' do
      within(".banner") do
        expect(find_link('Terms of Use')[:href]).to eq("https://loripsum.net/api")
        expect(find_link('Terms of Use')[:target]).to eq("_blank")

        expect(find_link('Privacy Policy')[:href]).to eq("https://baconipsum.com/api/?type=all-meat&paras=1&start-with-lorem=1&format=html")
        expect(find_link('Privacy Policy')[:target]).to eq("_blank")

        expect(page).to have_content('use of cookies')
      end

      click_on "OK"
      expect(page).not_to have_css(".banner")

      visit_home_page
      expect(page).not_to have_css(".banner")
    end
   end

  describe 'joining private retro' do
    let!(:retro_url) {
      in_browser(:felicity) do
        register('leslie-user-joining-public-retro')
        create_private_retro
     end
    }

    specify 'links them to privacy policy and terms while signing in' do
      visit retro_url

      expect(page).to have_content 'use of cookies'

      click_on('Terms of Use')
      close_current_tab
      select_last_tab
      expect(page).to have_content 'Lorem ipsum'

      visit retro_url
      click_on('Privacy Policy')
      close_current_tab
      select_last_tab
      expect(page).to have_content 'Bacon ipsum'
    end
  end

  describe 'joining public retro' do
    specify 'when on mobile, links them to terms and privacy in banner' do
      # Resize the screen as small as a regular smart phone
      retro_url = ''
      page.driver.resize_window_to(page.driver.current_window_handle, 360, 600)

      in_browser(:leslie)do
        register('leslie-user-joining-public-retro2')
        retro_url = create_public_retro
      end
      visit retro_url

      within(".banner") do
        expect(find_link('Terms of Use')[:href]).to eq("https://loripsum.net/api")
        expect(find_link('Terms of Use')[:target]).to eq("_blank")

        expect(find_link('Privacy Policy')[:href]).to eq("https://baconipsum.com/api/?type=all-meat&paras=1&start-with-lorem=1&format=html")
        expect(find_link('Privacy Policy')[:target]).to eq("_blank")
      end

      click_on "OK"
      expect(page).not_to have_css(".banner")

      visit retro_url
      expect(page).not_to have_css(".banner")
    end

    specify 'links them to terms and privacy in banner' do
      retro_url = ''
      page.driver.resize_window_to(page.driver.current_window_handle, 360, 600)

      in_browser(:leslie)do
        register('leslie-user-joining-public-retro3')
        retro_url = create_public_retro
      end
      visit retro_url

      within(".banner") do
        expect(find_link('Terms of Use')[:href]).to eq("https://loripsum.net/api")
        expect(find_link('Terms of Use')[:target]).to eq("_blank")

        expect(find_link('Privacy Policy')[:href]).to eq("https://baconipsum.com/api/?type=all-meat&paras=1&start-with-lorem=1&format=html")
        expect(find_link('Privacy Policy')[:target]).to eq("_blank")

        expect(page).to have_content 'use of cookies'
      end

      click_on "OK"
      expect(page).not_to have_css(".banner")

      visit retro_url
      expect(page).not_to have_css(".banner")
    end

    describe 'then joining another one' do
      specify 'sees the banner on both retros' do
        retro_url = ''
        another_retro_url = ''
        in_browser(:leslie)do
          register('leslie-user-joining-public-retro4')
          retro_url = create_public_retro
        end
        in_browser(:felicity2) do
            register('leslie-user-joining-another-public-retro')
            another_retro_url= create_public_retro
        end
        visit retro_url
        expect(page).to have_css(".banner")

        click_on "OK"
        expect(page).not_to have_css(".banner")

        visit another_retro_url
        expect(page).to have_css(".banner")
      end
    end
  end
end
