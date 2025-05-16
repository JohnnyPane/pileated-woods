import { Image, Grid } from '@mantine/core';

const FeaturedProduct = () => {
  return (
    <div className="featured-product">
      <Grid>
        <Grid.Col span={6}>
          <div className="flex-container flex-column horizontal-center featured-product-description">
            <h2>Featured Product</h2>
            <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.".</p>
            <button>Buy Now</button>
          </div>
        </Grid.Col>

        <Grid.Col span={6}>
          <div className="flex-container horizontal-center">
            <Image
              className="featured-product-image"
              src="https://pileated-woods.s3.us-east-1.amazonaws.com/homemade_guitar.jpg"
              alt="Featured Product"
              style={{ maxWidth: '80%', height: 'auto' }} radius="md"
            />
          </div>
        </Grid.Col>
      </Grid>
    </div>
  );
}

export default FeaturedProduct;