class CreateLongTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :long_tasks do |t|
      t.string :type, null: false
      t.date :start_date, null: false
      t.string :content, null: false
      t.integer :order, null: false
      t.boolean :is_checked, null: false, default: false
      t.bigint :user_id, null: false, foreign_key: true

      t.timestamps
    end
  end
end
