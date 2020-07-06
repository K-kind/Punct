class MonthlyTask < LongTask
  class << self
    def from_this_day(today:, from_today: 0)
      first_date = today.beginning_of_month
      start_dates = []
      [-1, 0, 1].each do |n|
        start_dates << first_date.next_month(from_today + n)
      end
      where(start_date: start_dates)
    end
  end
end
