# ENV.each { |k, v| env(k, v) }
# require File.expand_path(File.dirname(__FILE__) + '/environment')
rails_env = ENV['RAILS_ENV'] || :development
set :environment, rails_env
# set :output, "#{Rails.root}/log/cron.log"
# env :PATH, ENV['PATH']

# every '0 0 * * *' do # 毎日0時0分
#   command "echo 'learned_contents.till_next_review -1'"
#   runner 'lib/tasks/set_date.rb', :environment_variable => 'RAILS_ENV'
# end

# every '*/10 * * * *' do # 0分 10分 ..
#   command 'echo `date`'
#   runner 'lib/tasks/update_test_user.rb', :environment_variable => 'RAILS_ENV'
# end

every '0 4 * * *' do # 毎日4時
  command 'echo [CRONTAB LOGGER] `date`'
  runner 'UpdateTestUser.new'
end
