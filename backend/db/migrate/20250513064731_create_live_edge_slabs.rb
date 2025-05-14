class CreateLiveEdgeSlabs < ActiveRecord::Migration[8.0]
  def change
    create_table :live_edge_slabs do |t|
      t.string :species
      t.decimal :width, precision: 10, scale: 2
      t.decimal :length, precision: 10, scale: 2
      t.decimal :height, precision: 10, scale: 2
      t.boolean :dried, default: false

      t.timestamps
    end
  end
end
