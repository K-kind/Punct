class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.integer :user_id, null: false, foreign_key: true
      t.string :content, null: false
      t.integer :expected_time, null: false, default: 0
      t.integer :elapsed_time, null: false, default: 0
      t.integer :order
      t.integer :started_time
      t.integer :stopped_time
      t.date :date
      t.boolean :on_progress, null: false, default: false
      t.boolean :is_current, null: false, default: false
      t.boolean :is_completed, null: false, default: false

      t.timestamps
    end
  end
end
