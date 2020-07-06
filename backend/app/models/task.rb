class Task < ApplicationRecord
  belongs_to :user
  validates :content, presence: true,
                      length: { maximum: 255 }
  validates :expected_time, presence: true,
                            numericality: { greater_than_or_equal_to: 0 }
  validates :elapsed_time, presence: true,
                           numericality: { greater_than_or_equal_to: 0 }
  validates :order, presence: true,
                    numericality: { greater_than_or_equal_to: 0 }

  class << self
    def from_this_day(today:, monday: nil)
      if monday
        date_range = (monday - 7)..(monday + 13)
        where(date: [date_range, nil, today])
      else
        date_range = (today - 31)..(today + 13)
        where(date: [date_range, nil])
      end
    end
  end
end
