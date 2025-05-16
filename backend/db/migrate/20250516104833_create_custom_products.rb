class CreateCustomProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :custom_products do |t|
      t.jsonb :metadata

      t.timestamps
    end
  end
end
