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
                       allow_nil: true
end
