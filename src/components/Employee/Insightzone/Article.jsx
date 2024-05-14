import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import ClipLoader from "react-spinners/ClipLoader"; // Import ClipLoader
import styles from "./Article.module.css";
import Navbar from "../Navbar/Navbar";

function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleRef = doc(firestore, "articles", id);
        const articleSnap = await getDoc(articleRef);
        if (articleSnap.exists()) {
          const data = articleSnap.data();
          setArticle({ id: articleSnap.id, ...data });
        } else {
          console.error("Article not found");
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <ClipLoader color="#B69FEB" size={50} speedMultiplier={0.5} />
      </div>
    );
  }

  if (!article) {
    return <div>Error: Article not found</div>;
  }

  const { image, title, content, author, date } = article;
  const formattedDate = formatDate(date); // Format the date

  return (
    <div className={styles.articleContainer}>
        <Navbar></Navbar>
      <img src={image} alt="Article" className={styles.articleImage} />
      <div className={styles.articleDetails}>
        <h2 className={styles.articleTitle}>{title}</h2>
        <p className={styles.articleContent}>{content}</p>
        <div className={styles.authorDetails}>
          <p className={styles.author}>Author: {author}</p>
          <p className={styles.postedDate}>Posted Date: {formattedDate}</p> {/* Use the formatted date */}
        </div>
      </div>
    </div>
  );
}

// Function to format the date
function formatDate(timestamp) {
  const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default Article;