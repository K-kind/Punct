class TasksController < ApplicationController
  def index
    tasks = @current_user.tasks
    render json: { tasks: tasks }
  end

  def create
    task = @current_user.tasks.build(task_params)
    if task.save
      payload = { task: task }
      status = :created
    else
      payload = { message: task.errors.full_messages.join("\n") }
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
    render json: { tasks: @current_user.tasks }
  end

  def order
    # params = { oldIndex, newIndex, fromDate, toDate, fromCompleted, toCompleted, taskId, isCurrent }
    logger.debug old_index = params[:oldIndex]
    logger.debug new_index = params[:newIndex]
    logger.debug from_date = params[:fromDate]
    logger.debug to_date = params[:toDate]
    logger.debug from_completed = params[:fromCompleted]
    logger.debug to_completed = params[:toCompleted]
    logger.debug task_id = params[:taskId]
    logger.debug current = params[:isCurrent] || false

    @current_user
      .tasks
      .where('tasks.date = ? AND tasks.order > ? AND tasks.is_completed = ?', from_date, old_index, from_completed)
      .update_all('tasks.order = tasks.order - 1')

    @current_user
      .tasks
      .where('tasks.date = ? AND tasks.order >= ? AND tasks.is_completed = ?', to_date, new_index, to_completed)
      .update_all('tasks.order = tasks.order + 1')

    # if current # current = { isSetting: boolean }
    #   Task.find(task_id).update!(
    #     order: new_index,
    #     date: to_date,
    #     is_completed: to_completed,
    #     is_current: current[:isSetting]
    #   )
      # unless new_index
      #   to_date = Time.zone.today
      #   to_completed = true
      #   new_index = @current_user.tasks.where(date: to_date, is_completed: to_completed).count
      # end
    # else
    # end
    Task.find(task_id).update!(
      order: new_index,
      date: to_date,
      is_completed: to_completed,
      is_current: current
    )
    render json: { tasks: @current_user.tasks }
  end

  def start
    task = Task.find(params[:id])
    raise RuntimeError, 'The task is already started.' if task.on_progress

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
    raise RuntimeError, 'The task is already stopped.' unless task.on_progress

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
