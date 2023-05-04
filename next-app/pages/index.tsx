import { gql, useQuery } from "@apollo/client";
import type { GetStaticProps, NextPage } from "next";
import HomePageHead from "../components/head/homePageHead";
import { initializeApollo } from "../lib/apolloClient";
import styles from "../styles/Home.module.css";
import Card from "../components/card/card";

const QUERY = gql`
  query exempleQuery {
    launchesPast(limit: 20) {
      id
      mission_name
      rocket {
        rocket_name
      }
      links {
        flickr_images
      }
      launch_date_local
      details
    }
  }
`;

interface Launch {
  id: number,
  mission_name: string;
  rocket: {
    rocket_name: string;
  };
  links: {
    flickr_images: string[];
  };
  launch_site: {
    site_name: string;
  };
  launch_date_local: string;
  details: string;
}

const Home: NextPage = () => {
  const { loading, error, data } = useQuery(QUERY);

  if (error) return <>{"An error occured fetching data"}</>;
  if (loading) return <>{"Loading"}</>;

  function getFormattedLaunchDate(date: string) {
    const newDate = new Date(date)
    const day = newDate.getDate()
    const month = newDate.getMonth() + 1
    const year = newDate.getFullYear()
    const formattedDate = `${day}/${month}/${year}`

    return formattedDate
  }

  return (
    <div className={styles.container}>
      <HomePageHead />
      {data?.launchesPast.map((item: Launch) => {
        if (item.links.flickr_images.length > 0) {
          return (
            <Card
              key={item.id}
              rocketName={item.rocket.rocket_name}
              launchDate={getFormattedLaunchDate(item.launch_date_local)}
              missionName={item.mission_name}
              image={item.links.flickr_images}
            />
          );
        }
      })}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({ query: QUERY });

  return {
    props: {},
  };
};

export default Home;
