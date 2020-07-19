class AddIndexDateToTasks < ActiveRecord::Migration[6.0]
  def change
    add_index :tasks, :date
  end
end
