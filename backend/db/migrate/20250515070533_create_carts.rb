class CreateCarts < ActiveRecord::Migration[8.0]
  def change
    create_table :carts do |t|
      t.references :user, null: true, foreign_key: true
      t.string :guest_token, null: true

      t.timestamps
    end

    add_index :carts, :guest_token, unique: true
  end
end
