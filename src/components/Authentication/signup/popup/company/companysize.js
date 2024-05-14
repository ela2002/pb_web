import React from 'react';
import styles from './CompanySize.module.css';
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { Link } from 'react-router-dom';
import StepContent from '../StepContent2';
const CompanySize = () => {
  return (
    <div className={styles.all}>

  
    <div className={styles.companySizeContainer}>
          <StepContent />
        <br />
        <div className={styles.topbuttons}>
          <Link to={'/industry'}>
            <button className={styles.topLeftButton}>
              <GrFormPreviousLink />Back
            </button>
          </Link>
          <Link to={'/Serviceorproduct'}>
            <button className={styles.topRightButton}>
              Skip <GrFormNextLink />
            </button>
          </Link>
        </div>
      <h2 className={styles.title}>Company Size</h2>
      <div className={styles.optionsRow}>
        <div className={styles.optionBox}> <p style={{color:'black', fontSize:'15px',marginTop:'-2px'}}> Small (1-50 employees) </p> </div>
      </div>
      <div className={styles.optionsRow}>
        <div className={styles.optionBox}> <p style={{color:'black', fontSize:'15px',marginTop:'-2px'}}>Medium (51-500 employees)</p> </div>
      </div>
      <div className={styles.optionsRow}>
        <div className={styles.optionBox}> <p style={{color:'black', fontSize:'15px',marginTop:'-2px'}}> Large (501+ employees)</p></div>
      </div>
      <Link to={'/Serviceorproduct'}>
            <button className={styles.bottomRightButton}>Next <GrFormNextLink /></button>
          </Link>
    </div>
    </div>
  );
};

export default CompanySize;
