class LongTask < ApplicationRecord
  belongs_to :user
  validates :content, presence: true, length: { maximum: 255 }
  validates :start_date, presence: true
  validates :type, presence: true
  validates :order, presence: true
  validates :is_checked, inclusion: [true, false]
end
