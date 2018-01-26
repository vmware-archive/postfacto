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
require 'rails_helper'

describe '/admin/retros', type: :request do
  let!(:retro) do
    user = User.create!(email: 'user@example.com')
    retro = Retro.create!(
      name: 'My Retro', password: 'the-password', video_link: 'the-video-link',
      created_at: Time.at(12_345_678), updated_at: Time.at(123_456_789), is_private: true, user: user
    )
    1.times { Item.create!(retro: retro, description: 'Nonarchived item', category: :happy, vote_count: 0) }
    Item.create!(retro: retro, description: 'Archived item A', category: :happy, vote_count: 5, archived_at: Time.at(0))
    Item.create!(retro: retro, description: 'Archived item B', category: :happy, vote_count: 2, archived_at: Time.at(0))
    3.times { ActionItem.create!(retro: retro, description: 'Nonarchived action') }
    4.times { ActionItem.create!(retro: retro, description: 'Archived action', archived_at: Time.at(0)) }
    retro
  end

  let(:admin_user) do
    AdminUser.new(email: 'retro@example.com', password: 'password', password_confirmation: 'password')
  end

  before do
    sign_in admin_user
  end

  def authenticated_get(url)
    sign_in admin_user
    get url
  end

  describe 'retro page' do
    before do
      get admin_retro_path(retro.id)
      expect(status).to eq(200)
    end

    def column_href(doc, panel_name, column_name)
      doc.at_xpath('//div[h3="' + panel_name + '"]//th/a[text()="' + column_name + '"]/@href').value
    end

    def click_column(doc, panel_name, column_name, expected_order)
      url = column_href(doc, panel_name, column_name)
      expect(url).to include('order=' + expected_order)
      authenticated_get url
      expect(status).to eq(200)
      Nokogiri::HTML(response.body)
    end

    it 'displays the retro name' do
      doc = Nokogiri::HTML(response.body)
      expect(doc.at_css('#page_title').text).to eq('My Retro')
    end

    it 'displays an items section' do
      doc = Nokogiri::HTML(response.body)
      columns = doc.xpath('//div[h3="Items"]//th').map(&:text)
      expect(columns).to eq(['Id', 'Description', 'Category', 'Reaction Count', 'Done', 'Archived At'])
    end

    it 'has sortable items columns' do
      doc = Nokogiri::HTML(response.body)
      columns = doc.xpath('//div[h3="Items"]//th[contains(@class,"sortable")]').map(&:text)
      expect(columns).to eq(['Reaction Count'])
    end

    it 'sorts by reaction count' do
      doc = Nokogiri::HTML(response.body)
      doc = click_column(doc, 'Items', 'Reaction Count', 'items_reaction_count_desc')
      descriptions = doc.xpath('//div[h3="Items"]//tbody/tr/td[2]').map(&:text)
      expect(descriptions).to eq(['Archived item A', 'Archived item B', 'Nonarchived item'])

      doc = click_column(doc, 'Items', 'Reaction Count', 'items_reaction_count_asc')
      descriptions = doc.xpath('//div[h3="Items"]//tbody/tr/td[2]').map(&:text)
      expect(descriptions).to eq(['Nonarchived item', 'Archived item B', 'Archived item A'])
    end

    it 'displays an action items section' do
      doc = Nokogiri::HTML(response.body)
      columns = doc.xpath('//div[h3="Action Items"]//th').map(&:text)
      expect(columns).to eq(['Id', 'Description', 'Done', 'Created At', 'Archived At'])
    end
  end

  describe 'index' do
    it 'displays the list of retros' do
      get admin_retros_path
      expect(status).to eq(200)

      doc = Nokogiri::HTML(response.body)
      columns = doc.xpath('//table[@id="index_table_retros"]//th').map(&:text)
      columns.pop # Ignore actions column
      expect(columns).to eq([
                              'ID', 'Name', 'Slug',
                              'Items', 'Archived Items',
                              'Action Items', 'Archived Action Items',
                              'Created At', 'Updated At',
                              'Discussed Item', 'Discussed End Time',
                              'Video Link',
                              'Ordered By',
                              'Password',
                              'Private',
                              'User'
                            ])
    end

    it 'displays the correct data' do
      get admin_retros_path

      doc = Nokogiri::HTML(response.body)
      data = doc.xpath('//table[@id="index_table_retros"]//tbody/tr[1]/td').map(&:text)
      data.pop # Ignore actions column
      expect(data[0]).to include(retro.id.to_s)
      expect(data[1]).to eq('My Retro')
      expect(data[2]).to eq(retro.slug)
      expect(data[3]).to eq('3')
      expect(data[4]).to eq('2')
      expect(data[5]).to eq('7')
      expect(data[6]).to eq('4')
      expect(data[7]).to eq('May 23, 1970 21:21')
      expect(data[8]).to eq('November 29, 1973 21:33')
      expect(data[11]).to eq('the-video-link')
      expect(data[13]).to include('Yes')
      expect(data[14]).to include('Yes')
    end

    it 'has a filter for public/private retros' do
      get admin_retros_path

      doc = Nokogiri::HTML(response.body)

      filter_label = doc.xpath('//label[text()="Private"]')[0]
      expect(filter_label).to_not be_nil

      select = filter_label.next_element
      options = select.xpath('./option').map(&:text)

      expect(options).to match_array(['Any', 'No', 'Yes'])
    end
  end

  describe 'index CSV export' do
    it 'includes the desired columns' do
      get admin_retros_path + '.csv'
      expect(status).to eq(200)
      expect(response.body).to include(
        'ID,Name,Slug,Items,Archived items,Action items,Archived action items,' \
        'Created at,Updated at,Video link,Password,User' \
        "\n"
      )
      # Items & Action items include current & archived. This matches existing behaviour, but seems weird
      expect(response.body).to include(
        "\n" \
        "#{retro.id},My Retro,#{retro.slug},3,2,7,4," \
        '1970-05-23 21:21:18 UTC,1973-11-29 21:33:09 UTC,the-video-link,yes,' \
        "\n"
      )
    end
  end

  describe 'GET' do
    context '/:id' do
      specify { expect { get admin_retro_path(retro.id) }.not_to raise_error }

      it 'returns 404 for unknown IDs' do
        get admin_retro_path(-1)
        expect(status).to eq(404)
      end
    end

    context '/:slug' do
      specify { expect { get admin_retro_path(retro.slug) }.not_to raise_error }

      it 'returns 404 for unknown slugs' do
        get admin_retro_path('nope')
        expect(status).to eq(404)
      end
    end

    context '/:id/edit' do
      specify { expect { get edit_admin_retro_path(retro.id) }.not_to raise_error }
    end

    context '/:slug/edit' do
      specify { expect { get edit_admin_retro_path(retro.slug) }.not_to raise_error }
    end
  end

  describe 'PATCH' do
    let(:params) { { retro: { name: 'new retro' } } }

    context '/:id' do
      specify { expect { patch admin_retro_path(retro.id), params: params }.not_to raise_error }
    end

    context '/:slug' do
      specify { expect { patch admin_retro_path(retro.slug), params: params }.not_to raise_error }
    end
  end
end
