FactoryBot.define do
  factory :task do
    user
    content { 'モデルテストを書く' }
    expected_time { 72000 }
    elapsed_time { 68000 }
    order { 0 }
  end
end
