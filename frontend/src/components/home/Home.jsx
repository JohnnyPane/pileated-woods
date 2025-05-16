import { Title, Image } from '@mantine/core';
import './Home.scss'
import FeaturedProduct from "./FeaturedProduct.jsx";

const Home = () => {
  return (
    <>
      <div className="home-hero">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Rampart+One&display=swap');
  
            .rampartFont {
              font-family: 'Rampart One', cursive;
            }
          `}
        </style>

        <Title className="rampartFont home-logo" order={1}  align="center">
          SUSTAINABLE WOODWORKS
        </Title>

        <Image
          src="https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Sustainable Woodworks"
          style={{ maxWidth: '100%', height: '600px' }}
          caption="Crafting a Greener Future"
        />
      </div>

      <div className="home-content">
        <FeaturedProduct />
      </div>
    </>
  );
}

export default Home;