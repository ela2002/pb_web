import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CompanyCard.module.css';
import StarRating from './StarRating';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const CompanyCard = ({ company }) => {
  const { id, companyName, globalRating, recommended, unrecommended, location, companySize, industry, description, profilePic } = company;

  const handleRecommend = () => {
    // Logic for recommending the company
  };

  const handleUnrecommend = () => {
    // Logic for unrecommending the company
  };

  return (
    <Link to={`/companyprofile2/${id}`} className={styles.linkStyle}>
      <div className={styles.companyCard}>
        <img src={profilePic} alt={companyName} className={styles.logo} />
        <div className={styles.companyInfo}>
          <div className={styles.recommendationsContainer}>
            <span className={styles.recommendationsIcon} onClick={handleRecommend}>
              <FaThumbsUp />
              {recommended}
            </span>
            <span className={styles.unrecommendationsIcon} onClick={handleUnrecommend}>
              <FaThumbsDown />
              {unrecommended}
            </span>
          </div>
          <h3 className={styles.companyName}>{companyName}</h3>
          <div className={styles.ratingContainer}>
            <StarRating rating={globalRating} />
          </div>
          <div className='inline_items'>
            <p className={styles.location}>
              <span className={styles.label}>Location:</span> {location}
            </p>
            <p className={styles.size}>
              <span className={styles.label}>Size:</span> {companySize}
            </p>
            <p className={styles.industry}>
              <span className={styles.label}>Industry:</span> {industry}
            </p>
            <p className={styles.description}>
              <span className={styles.label}>Description:</span> {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CompanyCard;
