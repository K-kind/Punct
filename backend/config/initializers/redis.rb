if Rails.env.test?
  REDIS = MockRedis.new
else
  REDIS = Redis.new(url: Settings.session.url)
end
