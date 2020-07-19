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

    def create_samples
      start_date = Time.zone.today.beginning_of_week
      create!(
        content: 'ビジネス書を1冊読み切る',
        order: 0,
        start_date: start_date,
        is_checked: true
      )
      create!(
        content: '技術書を1冊読み切る',
        order: 1,
        start_date: start_date
      )
      create!(
        content: '英単語を30個覚える',
        order: 2,
        start_date: start_date
      )
    end
  end
end
