class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.string :name
      t.text :description
      t.integer :price, null: false, default: 0
      t.boolean :featured
      t.integer :stock, null: false, default: 0
      t.references :productable, polymorphic: true, null: false

      t.timestamps
    end
  end
end
