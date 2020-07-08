class WeeklyTask < LongTask
  class << self
    def from_this_day(from_today = 0)
      monday = Time.zone.today.beginning_of_week + from_today
      start_dates = [
        monday - 7,
        monday,
        monday + 7
      ]
      where(start_date: start_dates)
    end
  end
end
