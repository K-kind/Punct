FactoryBot.define do
  factory :weekly_task do
    user
    content { '週間タスク' }
    order { 0 }
    start_date { Time.zone.today.beginning_of_week }
  end
end
