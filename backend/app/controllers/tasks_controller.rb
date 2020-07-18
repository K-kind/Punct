class TasksController < ApplicationController
  def index
    daily = @current_user.tasks.from_this_day
    weekly = @current_user.weekly_tasks.from_this_day
    monthly = @current_user.monthly_tasks.from_this_day

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

    @current_user
      .tasks
      .where('tasks.date = ? AND tasks.order > ? AND tasks.is_completed = ?', task.date, task.order, task.is_completed)
      .update_all('tasks.order = tasks.order - 1')
    task.destroy

    from_today = params[:fromToday].to_i
    tasks = @current_user.tasks.from_this_day(from_today)
    render json: { tasks: tasks }
  end

  def order
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

    tasks = @current_user.tasks.from_this_day(params[:fromToday].to_i)
    render json: { tasks: tasks }
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

  def chart
    start_date = Time.zone.today + (params[:fromBase].to_i * 30) - 27
    tasks = Calendar.with_tasks(start_date, @current_user.id)
    render json: { tasks: tasks }
  end

  private

  def task_params
    params.require(:task).permit(:content, :expected_time, :elapsed_time, :order, :started_time, :stopped_time, :date, :on_progress, :is_current, :is_completed)
  end
end
