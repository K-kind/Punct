class User < ApplicationRecord
  has_secure_password
  has_many :tasks, dependent: :destroy
  has_many :weekly_tasks, dependent: :destroy
  has_many :monthly_tasks, dependent: :destroy

  validates :name, presence: true,
                   length: { maximum: 8 }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i.freeze
  validates :email, presence: true,
                    length: { maximum: 255 },
                    format: { with: VALID_EMAIL_REGEX },
                    uniqueness: { case_sensitive: false },
                    unless: :uid?
  validates :email, confirmation: true, on: :signup
  validates :email_confirmation, presence: true, on: :signup
  validates :password, presence: true,
                       length: { minimum: 6 },
                       allow_nil: true
  validates :password_confirmation, presence: true, on: :signup
  validates :provider, presence: true, if: :uid?
  validates :uid, presence: true, if: :provider?

  class << self
    def find_or_create_from_auth(auth)
      provider = auth[:provider]
      uid = auth[:uid]
      name = auth[:info][:name]
      email = auth[:info][:email]

      find_or_create_by!(provider: provider, uid: uid) do |user|
        user.name = name[0..7]
        user.email = email || 'not registered'
        user.password = SecureRandom.hex(9)
      end
    end
  end
end
