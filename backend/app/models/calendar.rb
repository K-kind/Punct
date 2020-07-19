class Calendar < ApplicationRecord
  scope :with_tasks, ->(start_date, end_date, user_id) {
    where('calendars.date > ? AND calendars.date <= ?', start_date, end_date)
      .joins(
        "LEFT OUTER JOIN tasks
        ON calendars.date = tasks.date
        AND tasks.user_id = #{user_id}"
      )
      .select(
        'calendars.date,
        SUM(tasks.expected_time) AS expected_sum,
        SUM(tasks.elapsed_time) AS elapsed_sum'
      ).group('calendars.id')
  }
end
