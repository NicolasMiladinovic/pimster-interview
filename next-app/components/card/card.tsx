import React, { Component } from 'react';
import styles from "../../styles/Card.module.css";

interface CardProps {
    missionName: string;
    rocketName: string;
    launchDate: string;
    image: string[];
    onCardClick: () => void;
}

class Card extends Component<CardProps> {
    render() {
        const {
            missionName,
            rocketName,
            launchDate,
            image,
            onCardClick
        } = this.props;

        const handleCardClick = () => {
            onCardClick();
        };

        return (
            <div
                className={styles.card}
                onClick={handleCardClick}
            >
                <img
                    src={image[0]}
                    className={styles.image}
                />
                <div className={styles.info}>
                    <p>{rocketName}</p>
                    <p>{launchDate}</p>
                </div>
                <h3>{missionName}</h3>
            </div>
        );
    }
}

export default Card;