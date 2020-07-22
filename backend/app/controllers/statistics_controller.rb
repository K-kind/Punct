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
    all_tasks = Task.all
    regular_user_tasks = Task.joins(:user).where('users.is_test = false')
    new_regular_user_tasks = regular_user_tasks.where('tasks.created_at > ?', Time.zone.today - 7)

    render json: {
      all_tasks: all_tasks.count,
      regular_user_tasks: {
        all: regular_user_tasks.count,
        this_week: new_regular_user_tasks.count
      }
    }
  end
end
