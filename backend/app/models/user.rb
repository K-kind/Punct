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
                    uniqueness: { case_sensitive: false }
  validates :email, confirmation: true, on: :signup
  validates :email_confirmation, presence: true, on: :signup
  validates :password, presence: true,
                       length: { minimum: 6 },
                       confirmation: true,
                       allow_nil: true
  validates :password, presence: true, on: :reset
  validates :provider, presence: true, if: :uid?
  validates :uid, presence: true, if: :provider?

  before_save :downcase_email
  attr_accessor :remember_token, :reset_token

  class << self
    def digest(string)
      cost = if ActiveModel::SecurePassword.min_cost
               BCrypt::Engine::MIN_COST
             else
               BCrypt::Engine.cost
             end
      BCrypt::Password.create(string, cost: cost)
    end

    def new_token
      SecureRandom.urlsafe_base64
    end

    def find_or_create_from_auth(auth)
      provider = auth[:provider]
      uid = auth[:uid]
      name = auth[:info][:name]
      email = auth[:info][:email]

      find_or_create_by!(provider: provider, uid: uid) do |user|
        user.name = name[0..7]
        user.email = email
        user.password = SecureRandom.hex(9)
      end
    end

    def create_test
      user = create!(
        name: '体験用ユーザー',
        email: "test#{Time.zone.now.to_i}@punct.work",
        password: SecureRandom.hex(9),
        is_test: true
      )
    end
  end

  def remember
    self.remember_token = User.new_token
    update_attribute(:remember_digest, User.digest(remember_token))
  end

  def authenticated?(attribute, token)
    digest = send("#{attribute}_digest")
    return false if digest.nil?

    BCrypt::Password.new(digest).is_password?(token)
  end

  def forget
    update(remember_digest: nil)
  end

  def create_reset_digest
    self.reset_token = User.new_token
    update!(reset_digest: User.digest(reset_token), reset_sent_at: Time.zone.now)
  end

  def send_password_reset_email
    UserMailer.password_reset(user: self, user_reset_token: reset_token).deliver_later
  end

  def password_reset_expired?
    reset_sent_at < 2.hours.ago
  end

  def mypage_json
    { name: name, email: email, provider: provider, is_test: is_test }
  end

  private

  def downcase_email
    self.email = email&.downcase
  end
end
