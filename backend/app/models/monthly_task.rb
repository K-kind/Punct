class MonthlyTask < LongTask
  class << self
    def from_this_day(from_today = 0)
      first_date = Time.zone.today.beginning_of_month
      start_dates = []
      [-1, 0, 1].each do |n|
        start_dates << first_date.next_month(from_today + n)
      end
      where(start_date: start_dates)
    end

    def create_samples
      start_date = Time.zone.today.beginning_of_month
      create!(
        content: 'ビジネス書を3冊読み切る',
        order: 0,
        start_date: start_date,
        is_checked: true
      )
      create!(
        content: '技術書を3冊読み切る',
        order: 1,
        start_date: start_date
      )
      create!(
        content: '勉強会に3回参加する',
        order: 2,
        start_date: start_date
      )
    end
  end
end
