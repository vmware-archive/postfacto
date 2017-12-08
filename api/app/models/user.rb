require 'securerandom'

class User < ActiveRecord::Base
  has_many :retros
  validates_uniqueness_of :email
  validates_format_of :email, with: Devise.email_regexp

  before_create :generate_auth_token

  def generate_auth_token
    self.auth_token ||= SecureRandom.uuid
  end
end
