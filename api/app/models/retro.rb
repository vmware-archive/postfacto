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
class Retro < ActiveRecord::Base
  extend FriendlyId

  has_many :items, -> { order(:created_at).where(archived: false) }, dependent: :destroy
  has_many :action_items, -> { order(:created_at).where(archived: false) }, dependent: :destroy
  has_many :archives, dependent: :destroy

  belongs_to :user, optional: true
  enum item_order: { time: 'time', votes: 'votes' }

  MAX_SLUG_LENGTH = 236

  friendly_id :generate_slug, use: :slugged
  validates_uniqueness_of :slug
  validates_length_of :slug, maximum: MAX_SLUG_LENGTH
  validates_format_of :slug, with: /\A[a-zA-z0-9-]+\z/

  before_update :recompute_join_token, if: :should_recompute_join_token?

  def password=(val)
    unless val.blank?
      self.salt = BCrypt::Engine.generate_salt
      self.encrypted_password = BCrypt::Engine.hash_secret(val, salt)
    end
  end

  def requires_authentication?
    encrypted_password
  end

  def validate_login?(val)
    if encrypted_password.blank?
      true
    else
      BCrypt::Engine.hash_secret(val, salt) == encrypted_password
    end
  end

  def validate_join_token?(val)
    val == join_token
  end

  def magic_link_enabled=(val)
    if val.present?
      return if magic_link_enabled?

      recompute_join_token
    else
      clear_join_token
    end
  end

  def magic_link_enabled
    join_token?
  end

  alias magic_link_enabled? magic_link_enabled

  # aliasing this in order to limit changes required to API
  # TODO: change API and front end to refer to this key as just 'magic_link_enabled'
  alias_attribute :is_magic_link_enabled, :magic_link_enabled

  def create_instruction_cards!
    I18n.t('instruction_cards.items').each do |category, descriptions|
      descriptions.map do |d|
        items.create!(description: d, category: category)
      end
    end

    I18n.t('instruction_cards.actions').each do |description|
      action_items.create!(description: description)
    end
  end

  def owner_email
    user.try(:email)
  end

  def token_has_expired?(session_time_limit, current_time)
    current_time >= (updated_at + session_time_limit)
  end

  private

  def generate_slug
    slug_base = name.parameterize
    slug = slug_base

    loop do
      slug = "#{slug_base}-#{rand(100..9999)}"
      break unless Retro.exists?(slug: slug)
    end

    slug
  end

  def should_recompute_join_token?
    magic_link_enabled? && will_save_change_to_encrypted_password?
  end

  def recompute_join_token
    self.join_token = SecureRandom.alphanumeric(32)
  end

  def clear_join_token
    self.join_token = nil
  end
end
