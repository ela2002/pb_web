// Import the necessary components
import React from "react";
import TotalNumberReviewsChart from "./TotalNumberReviewsChart";
import AverageInteractionsChart from "./AverageInteractionsChart";
import TotalRatingChart from "./TotalRatingChart";
import RatingDistributionChart from "./RatingDistributionChart";
import SentimentAnalysisChart from "./SentimentAnalysisChart";
import ReviewsPerDateChart from "./ReviewsPerDateChart";
import TopKeywordsChart from "./TopKeywordsChart";
import styles from "./ChartPage.module.css";
import Navbar from "../../Company/Navbar/Navbar";

const ChartPage = () => {
  return (
    <div className={styles.chartPage}>
      <Navbar></Navbar>
      {/* First row */}
      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.card}>
            <TotalNumberReviewsChart />
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.card}>
            <AverageInteractionsChart />
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.card}>
            <TotalRatingChart />
          </div>
        </div>
      </div>

      {/* Second row */}
      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.card}>
            <SentimentAnalysisChart />
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.card}>
            <RatingDistributionChart />
          </div>
        </div>
      </div>

      {/* Third row */}
      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.card}>
            <ReviewsPerDateChart />
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.card}>
            <TopKeywordsChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartPage;
