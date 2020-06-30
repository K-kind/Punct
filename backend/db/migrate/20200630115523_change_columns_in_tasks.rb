class ChangeColumnsInTasks < ActiveRecord::Migration[6.0]
  def up
    change_column :tasks, :user_id, :bigint
    change_column :tasks, :started_time, :bigint
    change_column :tasks, :stopped_time, :bigint
  end

  def down
    change_column :tasks, :user_id, :integer
    change_column :tasks, :started_time, :integer
    change_column :tasks, :stopped_time, :integer
  end
end
