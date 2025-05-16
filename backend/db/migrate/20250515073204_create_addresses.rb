class CreateAddresses < ActiveRecord::Migration[8.0]
  def change
    create_table :addresses do |t|
      t.references :addressable, polymorphic: true, null: false
      t.string :address_1, null: false
      t.string :address_2
      t.string :city
      t.string :state
      t.string :zip
      t.string :country, null: false, default: 'US'
      t.string :address_type, null: false, default: 'shipping'

      t.timestamps
    end

    add_index :addresses, [:addressable_type, :addressable_id, :address_type], name: "index_addresses_on_addressable_and_type"
  end
end
