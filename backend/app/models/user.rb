class User < ApplicationRecord
  has_secure_password
  has_many :tasks
  has_many :weekly_tasks
  has_many :monthly_tasks
end
