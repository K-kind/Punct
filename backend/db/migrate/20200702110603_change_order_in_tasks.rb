class ChangeOrderInTasks < ActiveRecord::Migration[6.0]
  def up
    change_column :tasks, :order, :integer, null: false
  end

  def down
    change_column :tasks, :order, :integer
  end
end
