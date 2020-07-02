class Task < ApplicationRecord
  belongs_to :user

  validates :content, presence: true, length: { maximum: 255 }
  validates :expected_time, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :elapsed_time, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :order, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :is_current, inclusion: [true, false]
  validates :is_completed, inclusion: [true, false]
  validates :on_progress, inclusion: [true, false]
end
