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
    old_index = params[:oldIndex]
    new_index = params[:newIndex]
    tasks = @current_user.tasks.where(date: params[:fromDate], is_completed: params[:fromCompleted])
    if old_index < new_index # 下げた時
      tasks.where('tasks.order > ? AND tasks.order <= ?', old_index, new_index)
           .update_all('tasks.order = tasks.order - 1')
    elsif old_index > new_index # 上げた時
      tasks.where('tasks.order >= ? AND tasks.order < ?', new_index, old_index)
           .update_all('tasks.order = tasks.order + 1')
    end
    tasks.find(params[:taskId]).update!(order: new_index) # 自身

    render json: { tasks: @current_user.tasks }
  end

  private

  def task_params
    params.require(:task).permit(:content, :expected_time, :elapsed_time, :order, :started_time, :stopped_time, :date, :on_progress, :is_current, :is_completed)
  end
end
