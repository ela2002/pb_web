// CommunityPage.js

import React from 'react';
import DiscussionForum from '../../../Employee/Community/DiscussionForum';
import ProfilesSection from '../../../Employee/Community/ProfilesSection';
import styles from './Community.module.css';
import Navbar from "../../../Employee/Navbar/Navbar"
const Community = () => {
  return (
    <div className={styles.communityPage}>
      <Navbar />
      <div className={styles.section}>
        <DiscussionForum />
      </div>
      <div className={styles.section}>
        <ProfilesSection />
      </div>
    </div>
  );
};
export default Community;
