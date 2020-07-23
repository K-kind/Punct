FactoryBot.define do
  factory :monthly_task do
    user
    content { '月間タスク' }
    order { 0 }
    start_date { Time.zone.today.beginning_of_month }
  end
end
