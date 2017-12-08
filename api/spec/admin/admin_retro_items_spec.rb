require 'rails_helper'

describe '/admin/retro_items', type: :request do
  let!(:retro) do
    Retro.create!(name: 'My Retro')
  end
  let!(:item) do
    Item.create!(retro: retro, description: 'Item A', category: Item.categories.fetch(:happy), vote_count: 1)
  end
  let(:admin_user) do
    AdminUser.new(email: 'retro@example.com', password: 'password', password_confirmation: 'password')
  end

  describe 'index' do
    it 'blocks unauthenticated access' do
      get admin_retro_items_path
      expect(status).to eq(302) # redirect to login page
    end

    context 'authenticated' do
      before do
        sign_in admin_user
        get admin_retro_items_path
      end

      it 'displays a title' do
        expect(status).to eq(200)
        doc = Nokogiri::HTML(response.body)
        expect(doc.at_css('#page_title').text).to eq('Retro Items')
      end

      it 'displays the items' do
        doc = Nokogiri::HTML(response.body)
        columns = doc.xpath('//table[@id="index_table_retro_items"]//th').map(&:text)
        expect(columns).to eq([
                                'ID', 'Description', 'Category', 'Reaction Count',
                                'Done', 'Created At', 'Updated At', 'Archived At'
                              ])
      end

      it 'displays the data' do
        doc = Nokogiri::HTML(response.body)
        values = doc.xpath('//table[@id="index_table_retro_items"]//tbody/tr[1]/td').map(&:text)
        expect(values[0]).to eq(item.id.to_s)
        expect(values[1]).to eq('Item A')
        expect(values[2]).to eq('happy')
        expect(values[3]).to eq('1')
        expect(values[4]).to include('No')
        # 5 and 6 are timestamps (created/updated)
        expect(values[7]).to eq('')
      end

      it 'displays a filter box' do
        doc = Nokogiri::HTML(response.body)
        expect(doc.xpath('//h3[text()="Filters"]').length).to eq(1)
      end
    end
  end
end
