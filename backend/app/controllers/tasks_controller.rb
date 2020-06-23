class TasksController < ApplicationController
  def index
    tasks = @current_user.tasks
    render json: { tasks: tasks }
  end
end
