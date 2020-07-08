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
    def from_this_day(from_today = 0)
      today = Time.zone.today
      if from_today.zero?
        date_range = (today - 31)..(today + 13)
        where(date: [date_range, nil])
      else
        monday = today.beginning_of_week + from_today
        date_range = (monday - 7)..(monday + 13)
        where(date: [date_range, nil, today])
      end
    end
  end
end
