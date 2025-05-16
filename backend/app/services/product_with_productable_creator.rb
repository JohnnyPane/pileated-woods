class ProductWithProductableCreator
  def self.call(product_params:, productable_params:)
    new(product_params, productable_params).call
  end

  def initialize(product_params, productable_params)
    @product_params = product_params
    @productable_params = productable_params
  end

  def call
    build_productable
    build_product

    if @product.save
      @product
    else
      raise ActiveRecord::RecordInvalid, @product
    end
  end

  private

  def productable_types
    %[LiveEdgeSlab CustomOrder]
  end

  def build_productable
    type = @product_params[:productable_type]
    raise ArgumentError, "Missing productable type" unless type.present?

    klass = type.safe_constantize
    raise ArgumentError, "Invalid productable type" unless klass&.ancestors&.include?(Productable)

    @productable = klass.new(@productable_params)
  end

  def build_product
    @product = Product.new(@product_params.except(:productable_type))
    @product.productable = @productable
  end
end