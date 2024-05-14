import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom"; 
import { firestore } from "../../../firebase/firebase";
import styles from "./TrendTrack.module.css";

function TrendTrack() {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articlesCollection = collection(firestore, "articles");
        const articlesSnapshot = await getDocs(articlesCollection);
        const articlesData = articlesSnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setArticles(articlesData);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    // Function to switch to the next article after a few seconds
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === articles.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change this value to adjust the duration for each article

    return () => clearTimeout(timer); // Cleanup function to clear the timer
  }, [currentIndex, articles]);

  return (
    <div className={styles.trendTrack}>
      <h2 className={styles.heading}>TrendTrack</h2>
      <div className={styles.cardContainer}>
        {articles.map((article, index) => (
          <Link
          to={`/article/${article.id}`} // Link to the article page with the article ID as a parameter
          key={article.id}
          className={`${styles.card} ${
            index === currentIndex ? styles.show : ""
          }`}
        >
          <div
            className={styles.articleContent}
            style={{
              backgroundImage: `url(${article.image})`,
              width: "430px",
              height: "330px"
            }}
            onClick={() => setCurrentIndex(index)} // Set the current index when clicking on the article content
          >
            <h3 className={styles.articleTitle}>{article.title}</h3>
          </div>
        </Link>
        ))}
      </div>
    </div>
  );
}

export default TrendTrack;