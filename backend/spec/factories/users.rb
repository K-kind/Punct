FactoryBot.define do
  sequence :email do |n|
    "test#{n}@example.com"
  end

  factory :user do
    name { 'テストユーザー' }
    email
    password { 'password' }
  end

  # trait :skill_900 do
  #   association :user_skill, factory: :user_skill_900
  # end
end
