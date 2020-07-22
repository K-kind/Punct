class StatisticsController < ApplicationController
  skip_before_action :check_xhr_header

  def users
    regular_users = User.is_test(false)
    new_regular_users = regular_users.where('created_at > ?', Time.zone.today - 7)
    test_users = User.is_test(true)

    render json: {
      regular_users: {
        all: regular_users.count,
        this_week: new_regular_users.count
      },
      test_users: test_users.count
    }
  end

  def tasks

  end
end
