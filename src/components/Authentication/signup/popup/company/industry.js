import React from 'react';
import styles from './industry.module.css';
import { CgMediaPodcast } from "react-icons/cg";
import { MdCastForEducation } from "react-icons/md";
import { MdOutlinePrecisionManufacturing } from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { LiaHeartbeatSolid } from "react-icons/lia";
import { LuBrainCircuit } from "react-icons/lu";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { Link } from 'react-router-dom';
import StepContent from '../StepContent2';
const Industry = () => {
  return (
    <div className={styles.Industryback}>

    <div className={styles.industryContainer}>
         
    <StepContent />
        <br />
        <div className={styles.topbuttons}>
          <Link to={'/companyDetails'}>
            <button className={styles.topLeftButton}>
              <GrFormPreviousLink />Back
            </button>
          </Link>
          <Link to={'/companysize'}>
            <button className={styles.topRightButton}>
              Skip <GrFormNextLink />
            </button>
          </Link>
        </div>

      <h2 className={styles.title}>Industry</h2>
      <div className={styles.optionsRow}>
        <div className={styles.optionBox}> <LuBrainCircuit style={{marginLeft:'40px'}}/><br/> <p className={styles.options} style={{marginLeft:'12px'}}> Technology </p></div>
        <div className={styles.optionBox}> <LiaHeartbeatSolid style={{marginLeft:'40px'}}/><br/> <p className={styles.options} style={{marginLeft:'11px'}}>Healthcare</p> </div>
        <div className={styles.optionBox}> <RiMoneyDollarCircleLine style={{marginLeft:'35px'}} /><br/> <p className={styles.options} style={{marginLeft:'20px'}}>Finance</p></div>
      </div>
      <div className={styles.optionsRow}>
        <div className={styles.optionBox}> <MdOutlinePrecisionManufacturing style={{marginLeft:'40px'}} /> <br/> <p className={styles.options}>Manufacturing</p></div>
        <div className={styles.optionBox}> <MdCastForEducation style={{marginLeft:'38px'}} /><br/ ><p className={styles.options} style={{marginLeft:'15px'}}>Education</p></div>
        <div className={styles.optionBox}> <CgMediaPodcast style={{marginLeft:'35px'}}/> <br/><p className={styles.options} style={{marginLeft:'25px'}}>Media</p></div>
      </div>
      <Link to={'/companysize'}>
            <button className={styles.bottomRightButton}> Next <GrFormNextLink /></button>
          </Link>
    </div>
      </div>
  );
};

export default Industry;
