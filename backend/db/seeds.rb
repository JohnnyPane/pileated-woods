# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end


live_edge_slab = LiveEdgeSlab.create!(
  species: 'Oak',
  width: 24.5,
  length: 96.0,
  height: 2.0,
  dried: true,
)

product = Product.create!(
  name: 'Live Edge Oak Slab',
  description: 'A beautiful live edge oak slab, perfect for tabletops or custom furniture.',
  price: 50000,
  featured: true,
  stock: 10,
  productable: live_edge_slab,
)

puts "Created Live Edge Slab with ID: #{live_edge_slab.id}"
puts "Created Product with ID: #{product.id}"