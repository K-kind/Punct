class User < ApplicationRecord
  has_secure_password
  has_many :tasks
  has_many :weekly_tasks
  has_many :monthly_tasks

  validates :name, presence: true,
                   length: { maximum: 8 }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i.freeze
  validates :email, presence: true,
                    length: { maximum: 255 },
                    format: { with: VALID_EMAIL_REGEX },
                    uniqueness: { case_sensitive: false },
                    confirmation: true
  validates :email_confirmation, presence: true
  validates :password, presence: true,
                       length: { minimum: 6 },
                       allow_nil: true
  validates :password_confirmation, presence: true
end
