import React, { Component } from 'react';
import styles from "../../styles/Card.module.css";

interface CardProps {
    missionName: string;
    rocketName: string;
    launchDate: string;
    image: string[];
}

class Card extends Component<CardProps> {
    render() {
        const {
            missionName,
            rocketName,
            launchDate,
            image
        } = this.props;

        return (
            <div className={styles.card}>
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