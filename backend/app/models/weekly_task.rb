class WeeklyTask < LongTask
  class << self
    def from_this_day(monday)
      start_dates = [
        monday - 7,
        monday,
        monday + 7
      ]
      where(start_date: start_dates)
    end
  end
end
