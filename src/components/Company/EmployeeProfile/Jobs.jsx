import React from "react";
import styles from "./Jobs.module.css";

const Jobs = () => {
  return (
    <div className={styles.container}>
      <h1>Job Experience</h1>
      <div className={styles.job}>
        <h2 className={styles.jobTitle}>Software Developer</h2>
        <p className={styles.companyName}>ABC Technologies</p>
        <p className={styles.duration}>May 2018 - Present</p>
        <p className={styles.jobDescription}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
          ullamcorper lectus eu risus interdum, nec ultricies magna
          ullamcorper. Duis vitae suscipit nulla, ac rhoncus libero. Nulla
          facilisi.
        </p>
      </div>
      <div className={styles.job}>
        <h2 className={styles.jobTitle}>Project Manager</h2>
        <p className={styles.companyName}>XYZ Corporation</p>
        <p className={styles.duration}>September 2015 - April 2018</p>
        <p className={styles.jobDescription}>
          Vivamus id orci mauris. Duis euismod nec augue et ultricies. Nulla
          in sapien nec enim viverra congue. In sed velit vitae est
          efficitur efficitur vel vitae ex. Ut ac ligula sapien. Phasellus
          fermentum justo sed tempor iaculis.
        </p>
      </div>
      {/* Add more job experiences as needed */}
    </div>
  );
};

export default Jobs;
