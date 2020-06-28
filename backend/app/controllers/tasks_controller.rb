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
    is_current = task.is_current
    task.destroy
    render json: { tasks: @current_user.tasks, is_current: is_current }
  end

  def order
    # params = { oldIndex, newIndex, fromDate, toDate, fromCompleted, toCompleted, taskId }
    logger.debug old_index = params[:oldIndex]
    logger.debug new_index = params[:newIndex]
    logger.debug from_date = params[:fromDate]
    logger.debug to_date = params[:toDate]
    logger.debug from_completed = params[:fromCompleted]
    logger.debug to_completed = params[:toCompleted]
    logger.debug task_id = params[:taskId]
    # if (from_date == to_date) && (from_completed == to_completed)
    #   tasks = @current_user.tasks.where(date: from_date, is_completed: from_completed)
    #   if old_index < new_index # 下げた時
    #     tasks.where('tasks.order > ? AND tasks.order <= ?', old_index, new_index)
    #          .update_all('tasks.order = tasks.order - 1')
    #   elsif old_index > new_index # 上げた時
    #     tasks.where('tasks.order >= ? AND tasks.order < ?', new_index, old_index)
    #          .update_all('tasks.order = tasks.order + 1')
    #   end
    #   Task.find(task_id).update!(order: new_index) # 自身
    # elsif (from_date != to_date) && (from_completed == to_completed)
    # if !from_completed && to_completed
    # end
    @current_user
      .tasks
      .where('tasks.date = ? AND tasks.order > ? AND tasks.is_completed = ?', from_date, old_index, from_completed)
      .update_all('tasks.order = tasks.order - 1')

    @current_user
      .tasks
      .where('tasks.date = ? AND tasks.order >= ? AND tasks.is_completed = ?', to_date, new_index, to_completed)
      .update_all('tasks.order = tasks.order + 1')

    unless new_index
      to_date = Time.zone.today
      to_completed = true
      new_index = @current_user.tasks.where(date: to_date, is_completed: to_completed).count
    end

    Task.find(task_id).update!(
      order: new_index,
      date: to_date,
      is_completed: to_completed
    )

    render json: { tasks: @current_user.tasks }
  end

  private

  def task_params
    params.require(:task).permit(:content, :expected_time, :elapsed_time, :order, :started_time, :stopped_time, :date, :on_progress, :is_current, :is_completed)
  end
end
