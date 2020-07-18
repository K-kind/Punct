User.find_or_create_by!(email: 'test@example.com') do |user|
  user.name = 'テストユーザー'
  user.password = 'password'
end

unless Calendar.any?
  con = ActiveRecord::Base.connection
  (Date.parse('2020-07-01')..Date.parse('2025-12-31')).each do |date|
    con.execute("INSERT INTO calendars(date) VALUES('#{date}')")
  end
end
