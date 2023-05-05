import { gql, useQuery } from "@apollo/client";
import type { GetStaticProps, NextPage } from "next";
import { useState } from "react";
import Modal from 'react-modal';
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
    }
  }
`;

const MODAL_QUERY = gql`
query exempleQuery($launchId: ID!) {
  launch(id: $launchId) {
    mission_name
    links {
      flickr_images
    }
  }
}`;

interface Launch {
  id: string,
  mission_name: string;
  rocket: {
    rocket_name: string;
  };
  links: {
    flickr_images: string[];
  };
  launch_date_local: string;
  launch_site: {
    site_name: string;
  };
  details: string;
}

interface ModalData {
  mission_name: string;
  links: {
    flickr_images: string[];
  };
}

const Home: NextPage = () => {
  const { loading, error, data } = useQuery(QUERY);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLaunchId, setSelectedLaunchId] = useState("");
  const [modalData, setModalData] = useState(null);

  const { loading: loadingModal, error: errorModal, data: dataModal } = useQuery(MODAL_QUERY, {
    variables: { launchId: selectedLaunchId },
    onCompleted: (data) => {
      setModalData(data.launch);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  if (error || errorModal) return <>{"An error occured fetching data"}</>;
  if (loading) return <>{"Loading"}</>;

  function getFormattedLaunchDate(date: string) {
    const newDate = new Date(date)
    const day = newDate.getDate()
    const month = newDate.getMonth() + 1
    const year = newDate.getFullYear()
    const formattedDate = `${day}/${month}/${year}`

    return formattedDate
  }

  const handleOpenModal = (launchId: string): void => {
    setSelectedLaunchId(launchId);
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setSelectedLaunchId("");
    setIsModalOpen(false);
  };

  console.log(modalData);
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
              onCardClick={() => handleOpenModal(item.id)}
            />
          );
        }
      })}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        ariaHideApp={false}
        style={{
          content: {
            width: '50%',
            height: '50%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }
        }}
      >
        <button onClick={handleCloseModal}>X</button>
        {loadingModal
          ?
          (<div>Loading</div>)
          :
          (modalData && (
            <div>
              <h2>{modalData.mission_name}</h2>
              <img src={modalData.links.flickr_images}
                alt="Rocket"
                className={styles.image}
              />
            </div>
          )
          )}
      </Modal>
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
