import { gql, useQuery } from "@apollo/client";
import type { GetStaticProps, NextPage } from "next";
import HomePageHead from "../components/head/homePageHead";
import { initializeApollo } from "../lib/apolloClient";
import styles from "../styles/Home.module.css";

const QUERY = gql`
  query exempleQuery {
    launchesPast(limit: 8) {
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

// launch_site {
//   site_name
//}

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

  return (
    <div className={styles.container}>
      <HomePageHead />
      {/* Your code goes here */}
      {data?.launchesPast.map((item: Launch) => {
        return (
          <div key={item.id}>
            <h3>{item.mission_name}</h3>
            <p>Rocket: {item.rocket.rocket_name}</p>
            <p>Launch Date: {item.launch_date_local}</p>
            <p>Details: {item.details}</p>
          </div>
        );
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
