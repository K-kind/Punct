class MonthlyTasksController < ApplicationController
  def index
    start_dates = []
    first_of_this_month = Time.zone.today.beginning_of_month
    from_today = params[:fromToday].to_i
    (-1..1).each do |n|
      start_dates << first_of_this_month.next_month(from_today + n)
    end
    tasks = @current_user.monthly_tasks.where(start_date: start_dates)

    render json: { tasks: tasks }
  end

  def create
    task = @current_user.monthly_tasks.build(task_params)
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
    task = MonthlyTask.find(params[:id])
    if task.update(task_params)
      head :no_content
    else
      render json: { error: task.errors.full_messages.join("\n") }
    end
  end

  def destroy
    task = MonthlyTask.find(params[:id])
    @current_user
      .monthly_tasks
      .where('long_tasks.start_date = ? AND long_tasks.order > ?', task.start_date, task.order)
      .update_all('long_tasks.order = long_tasks.order - 1')
    task.destroy
    render json: { tasks: @current_user.monthly_tasks }
  end

  def order
    # params = { oldIndex, newIndex, startDate, taskId }
    old_index = params[:oldIndex]
    new_index = params[:newIndex]
    start_date = params[:startDate]
    task_id = params[:taskId]

    @current_user
      .monthly_tasks
      .where('long_tasks.start_date = ? AND long_tasks.order > ?', start_date, old_index)
      .update_all('long_tasks.order = long_tasks.order - 1')

    @current_user
      .monthly_tasks
      .where('long_tasks.start_date = ? AND long_tasks.order >= ?', start_date, new_index)
      .update_all('long_tasks.order = long_tasks.order + 1')

      MonthlyTask.find(task_id).update!(order: new_index)

    render json: { tasks: @current_user.monthly_tasks }
  end

  private

  def task_params
    params.require(:task).permit(:content, :is_checked, :start_date, :order)
  end
end
