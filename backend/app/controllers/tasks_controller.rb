class TasksController < ApplicationController
  def index
    today = Time.zone.today
    daily_range = (today - 31)..(today + 13)
    daily = @current_user.tasks.where(date: [daily_range, nil])

    week_start = today.beginning_of_week
    week_start_dates = [(week_start - 7), week_start, (week_start + 7)]
    weekly = @current_user.weekly_tasks.where(start_date: week_start_dates)

    month_start_dates = []
    first_of_this_month = today.beginning_of_month
    (-1..1).each do |n|
      month_start_dates << first_of_this_month.next_month(n)
    end
    monthly = @current_user.monthly_tasks.where(start_date: month_start_dates)

    render json: { tasks: { daily: daily, weekly: weekly, monthly: monthly } }
  end

  def create
    task = @current_user.tasks.build(task_params)
    if task.save
      payload = { task: task }
      status = :created
    else
      payload = { error: task.errors.full_messages.join("\n") }
      status = :ok
    end
    render json: payload, status: status
  end

  def update
    task = Task.find(params[:id])
    if task.update(task_params)
      head :no_content
    else
      render json: { error: task.errors.full_messages.join("\n") }
    end
  end

  def destroy
    task = Task.find(params[:id])
    date = task.date&.to_s
    is_completed = task.is_completed

    @current_user
      .tasks
      .where('tasks.date = ? AND tasks.order > ? AND tasks.is_completed = ?', date, task.order, is_completed)
      .update_all('tasks.order = tasks.order - 1')
    task.destroy

    tasks = @current_user.tasks.where(date: date, is_completed: is_completed)
    render json: { tasks: tasks, date: date, is_completed: is_completed }
  end

  def order
    # params = { oldIndex, newIndex, fromDate, toDate, fromCompleted, toCompleted, taskId, isCurrent }
    old_index = params[:oldIndex]
    new_index = params[:newIndex]
    from_date = params[:fromDate]
    to_date = params[:toDate]
    from_completed = params[:fromCompleted]
    to_completed = params[:toCompleted]
    task_id = params[:taskId]
    current = params[:isCurrent] || false

    @current_user
      .tasks
      .where('tasks.date = ? AND tasks.order > ? AND tasks.is_completed = ?', from_date, old_index, from_completed)
      .update_all('tasks.order = tasks.order - 1')

    @current_user
      .tasks
      .where('tasks.date = ? AND tasks.order >= ? AND tasks.is_completed = ?', to_date, new_index, to_completed)
      .update_all('tasks.order = tasks.order + 1')

    Task.find(task_id).update!(
      order: new_index,
      date: to_date,
      is_completed: to_completed,
      is_current: current
    )

    # tasks = @current_user.tasks.where('tasks.date = ? OR tasks.date = ? OR tasks.id = ?', from_date, to_date, task_id)
    tasks = @current_user.tasks.where(date: from_date).or(@current_user.tasks.where(date: to_date))
    from_date_string = from_date ? Date.parse(from_date).to_s : nil
    to_date_string = to_date ? Date.parse(to_date).to_s : nil
    render json: { tasks: tasks, from_date: from_date_string, to_date: to_date_string, task_id: task_id }
  end

  def start
    task = Task.find(params[:id])
    raise 'The task is already started.' if task.on_progress

    unix_time_now = (Time.zone.now.to_f * 1000).to_i # ミリ秒
    if task.started_time
      task.stopped_time = unix_time_now
    else
      task.started_time = unix_time_now
    end
    task.on_progress = true
    task.save!

    render json: { task: task }
  end

  def stop
    task = Task.find(params[:id])
    raise 'The task is already stopped.' unless task.on_progress

    initial_time = task.stopped_time || task.started_time
    unix_time_now = (Time.zone.now.to_f * 1000).to_i
    task.elapsed_time += (unix_time_now - initial_time)
    task.stopped_time = unix_time_now
    task.on_progress = false
    task.save!

    render json: { task: task }
  end

  private

  def task_params
    params.require(:task).permit(:content, :expected_time, :elapsed_time, :order, :started_time, :stopped_time, :date, :on_progress, :is_current, :is_completed)
  end
end
