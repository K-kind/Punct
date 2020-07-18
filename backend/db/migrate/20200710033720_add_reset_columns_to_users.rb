class AddResetColumnsToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :reset_digest, :string
    add_column :users, :remember_digest, :string
    add_column :users, :reset_sent_at, :datetime
    add_column :users, :is_test, :boolean, default: false, null: false
  end
end
