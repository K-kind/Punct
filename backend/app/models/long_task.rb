class LongTask < ApplicationRecord
  belongs_to :user
  validates :content, presence: true, length: { maximum: 255 }
  validates :start_date, presence: true
  validates :type, presence: true
  validates :order, presence: true,
                    numericality: { greater_than_or_equal_to: 0 }
end
