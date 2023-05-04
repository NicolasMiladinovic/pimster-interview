import { gql, useQuery } from "@apollo/client";
import type { GetStaticProps, NextPage } from "next";
import HomePageHead from "../components/head/homePageHead";
import { initializeApollo } from "../lib/apolloClient";
import styles from "../styles/Home.module.css";

const QUERY = gql`
  query exempleQuery {
    launchesPast {
      mission_name
      rocket {
        rocket_name
      }
      links {
        flickr_images
      }
      launch_site {
        site_name
      }
      launch_date_local
      details
    }
  }
`;

const Home: NextPage = () => {
  const { loading, error, data } = useQuery(QUERY);

  if (error) return <>{"An error occured fetching data"}</>;
  if (loading) return <>{"Loading"}</>;

  return (
    <div className={styles.container}>
      <HomePageHead />
      {/* Your code goes here */}
      {JSON.stringify(data)}
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
