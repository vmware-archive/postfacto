require 'spec_helper'

describe 'Leslie', type: :feature, js: true do
  after do
    Capybara.execute_script "localStorage.clear()"
  end

  describe 'viewing new privacy policy' do
    before do
      visit_privacy_page
    end

    specify 'sees the new policy' do
      visit_privacy_page
      expect(page).to have_content 'Privacy Policy'
    end
  end

  describe 'viewing new terms page' do
    specify 'sees the new terms' do
      visit_new_terms_page
      expect(page).to have_content 'Postfacto Services Agreement'
    end
  end

  describe 'viewing old terms page' do
    specify 'sees 404' do
      visit_old_terms_page
      expect(page).to have_content 'page you\'re looking for doesn\'t exist'
    end
  end

  describe 'viewing the home page' do
    before do
      visit_home_page
    end

    specify 'sees privacy policy link is in the footer' do
      scroll_to_bottom

      within('.footer') do
        expect(page).to have_link("Privacy Policy", :href=>"https://pivotal.io/privacy-policy")
      end
    end

    specify 'sees terms link in the footer' do
      scroll_to_bottom

      within('.footer') do
        find('a[href="/terms"]', text: 'Terms & Conditions').click
      end
        
      close_current_tab
      select_last_tab
      expect(page).to have_content 'Postfacto Services Agreement'
    end
   end

   describe 'visiting the home page in the EU' do
     before do
       visit_home_page('DE')
     end

     specify 'sees banner with terms, privacy and cookie warning' do
       within(".banner") do
         expect(find_link('Terms of Use')[:href]).to eq("#{RETRO_APP_BASE_URL}/terms")
         expect(find_link('Terms of Use')[:target]).to eq("_blank")

         expect(find_link('Privacy Policy')[:href]).to eq("https://pivotal.io/privacy-policy")
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

      find('.password-terms-text a[href="/terms"]', text: 'Terms of Use').click
      close_current_tab
      select_last_tab
      expect(page).to have_content 'Postfacto Services Agreement'

      visit retro_url
      find('.password-terms-text a[href="https://pivotal.io/privacy-policy"]', text: 'Privacy Policy').click
      close_current_tab
      select_last_tab
      expect(page).to have_content 'Privacy Policy'
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
        expect(find_link('Terms of Use')[:href]).to eq("#{RETRO_APP_BASE_URL}/terms")
        expect(find_link('Terms of Use')[:target]).to eq("_blank")

        expect(find_link('Privacy Policy')[:href]).to eq("https://pivotal.io/privacy-policy")
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
        expect(find_link('Terms of Use')[:href]).to eq("#{RETRO_APP_BASE_URL}/terms")
        expect(find_link('Terms of Use')[:target]).to eq("_blank")

        expect(find_link('Privacy Policy')[:href]).to eq("https://pivotal.io/privacy-policy")
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
