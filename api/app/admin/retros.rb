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
require 'queries/safe_order_by'

ActiveAdmin.register Retro do
  menu priority: 1
  actions :all
  permit_params :name, :slug, :video_link, :password, :encrypted_password, :is_private, :is_magic_link_enabled

  filter :name
  filter :slug
  filter :id
  filter :created_at
  filter :updated_at
  filter :is_private, :label => 'Private'

  index do
    column('ID', sortable: :id) { |retro| link_to "#{retro.id} ", admin_retro_path(retro) }
    column('Name', :name)
    column('Slug', :slug)
    column 'Items' do |retro|
      retro.items.length
    end
    column 'Archived Items' do |retro|
      Item.unscoped.where(retro_id: retro.id).count(:archived_at)
    end
    column 'Action Items' do |retro|
      retro.action_items.length
    end
    column 'Archived Action Items' do |retro|
      ActionItem.unscoped.where(retro_id: retro.id).count(:archived_at)
    end
    column('Created At', :created_at)
    column('Updated At', :updated_at)
    column('Discussed Item', :highlighted_item_id)
    column('Discussed End Time', :retro_item_end_time)
    column('Video Link', :video_link)
    column('Ordered By', :item_order)
    column 'Password', sortable: :encrypted_password do |retro|
      retro.encrypted_password? ? status_tag('yes') : status_tag('no')
    end

    column('Private', :is_private)

    column('User', :user)
    actions
  end

  csv do
    column('ID', humanize_name: false) { |retro| retro.id }
    column('Name') { |retro| retro.name }
    column('Slug') { |retro| retro.slug }
    column('Items') { |retro| retro.items.length }
    column('Archived items') { |retro|
      Item.unscoped.where(retro_id: retro.id).count(:archived_at)
    }
    column('Action items') { |retro| retro.action_items.length }
    column('Archived action items') { |retro|
      ActionItem.unscoped.where(retro_id: retro.id).count(:archived_at)
    }
    column('Created at') { |retro| retro.created_at }
    column('Updated at') { |retro| retro.updated_at }
    column('Video link') { |retro| retro.video_link }
    column('Password') { |retro| retro.encrypted_password? ? 'yes' : 'no' }
    column('User') { |retro| retro.user ? retro.user.name : '' }
  end

  show do
    if retro.user
      h2 'Created by:'
      h3 link_to retro.user.email, admin_user_path(retro.user)
    else
      h2 'No Owner'
    end

    panel 'Items' do
      items = Item.unscoped.where(retro_id: retro.id)
      query = SafeOrderBy.new(items, { 'items_reaction_count' => 'vote_count' }).order(params[:order])
      table_for(query, sortable: true, class: 'index_table') do |t|
        t.column('Id', :id, sortable: false)
        t.column('Description', :description, sortable: false)
        t.column('Category', :category, sortable: false)
        t.column('Reaction Count', :vote_count, sortable: 'items_reaction_count')
        t.column('Done', :done, sortable: false)
        t.column('Archived At', :archived_at, sortable: false)
      end
    end
    panel 'Action Items' do
      table_for(ActionItem.unscoped.where(retro_id: retro.id)) do |t|
        t.column('Id', :id)
        t.column('Description', :description)
        t.column('Done', :done)
        t.column('Created At', :created_at)
        t.column('Archived At', :archived_at)
      end
    end
  end

  form do |f|
    f.semantic_errors

    f.inputs 'Details' do
      f.input :name
      f.input :slug
      f.input :video_link
      f.input :owner_email
      f.input :is_private
      f.input :magic_link_enabled, as: :boolean
    end

    f.inputs do
      if f.object.encrypted_password?
        f.input :remove_password, label: 'Remove old Password?', as: :check_boxes, collection: ['Remove']
      else
        f.input :password, label: 'Create new Password'
      end
    end
    f.actions
  end

  controller do
    before_action :load_retro, only: [:show, :edit, :update, :destroy]

    def load_retro
      @retro = Retro.friendly.find(params.fetch(:id))
    end

    def find_user_by_email(owner_email)
      User.find_by_email(owner_email)
    end

    def new
      super do
        @retro.is_private = true
      end
    end

    def update
      owner_email = params['retro']['owner_email']

      if owner_email.blank?
        @retro.user = nil
      else
        user = find_user_by_email(owner_email)

        redirect_to edit_admin_retro_path(@retro), flash: {error: 'Could not change owners. User not found by email.'} and return unless user
        @retro.user = user
      end

      if params['retro']['remove_password'] && params['retro']['remove_password'][1] == 'Remove'
        params[:retro][:encrypted_password] = nil
      end

      params[:retro].delete('remove_password')
      update!
    end
  end
end
