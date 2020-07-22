User.is_test(true).find_each do |user|
  next if user.created_at > Time.zone.today - 7

  user.destroy
end
