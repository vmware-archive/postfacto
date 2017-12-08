class Retro < ActiveRecord::Base
  extend FriendlyId

  has_many :items, -> { order(:created_at).where(archived: false) }, dependent: :destroy
  has_many :action_items, -> { order(:created_at).where(archived: false) }, dependent: :destroy
  has_many :archives
  belongs_to :user
  enum item_order: { time: 'time', votes: 'votes' }
  after_initialize :generate_video_link

  MAX_SLUG_LENGTH = 236

  friendly_id :generate_slug, use: :slugged
  validates_uniqueness_of :slug
  validates_length_of :slug, maximum: MAX_SLUG_LENGTH
  validates_format_of :slug, with: /\A[a-zA-z0-9-]+\z/

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

  def generate_video_link
    self.video_link = video_link.presence ||
                      'https://appear.in/retro-app-' + Array.new(8) { [*'0'..'9', *'a'..'z'].sample }.join
  end
end
