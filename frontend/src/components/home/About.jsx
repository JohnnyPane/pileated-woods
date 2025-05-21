import { Image, Grid } from "@mantine/core";

const About = () => {
  return (
    <div className="about">
      <Image
        src="https://images.unsplash.com/photo-1620254519036-454ef6a9f6c7?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Workshop Image"
        className="workshop-image"
      />

      <div className="about-content margin-40-t">
        <div className="flex column center-content">
          <h1 className="non-bold">Wood Repurposed</h1>
          <p>
            We source wood from your neighborhood and put it in your home
          </p>
        </div>

        <div className="about-section margin-40-t">
          <Grid>
            <Grid.Col span={6}>
              <Image
                src="https://pileated-woods.s3.us-east-1.amazonaws.com/ryan_water.jpg"
                alt="Ryan Water"
                className="about-image"
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <div className="about-text flex horizontal-center align-left column full-height">
                <p className="label-large margin-none">WHO WE ARE</p>
                <p className="label-large">
                  Founded in 2025 with a simple mission: to repurpose wood from your neighborhood and put it in your home.
                  Our wood is "rescued" from the chipper and transformed into beautiful, functional pieces of furniture. Through
                  our strategic partnerships with local tree services, we are able to source wood that would otherwise be wasted.

                  Our founder Ryan started this company when a tree fell on his family's home. He felt the pain of losing a
                  tree that had been in his yard for years and did not want to see it destroyed. From there the first product was created and
                  our mission underway.
                </p>
              </div>
            </Grid.Col>
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default About;