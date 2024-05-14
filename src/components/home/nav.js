import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/logo_1.png';
import { BsSun } from "react-icons/bs";
import styles from './nav.module.css';




const Navbar = ({  isLightMode, toggleMode }) => {
  const [activeButton, setActiveButton] = useState('signin'); // State to track active button

  const handleSignInClick = () => {
    setActiveButton('signin');
  };

  const handleSignUpClick = () => {
    setActiveButton('signup');
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.logo}>
        <img className={styles.logoo} src={logo} alt="Logo" /> 
 
      </div>
      <div className={styles.navlinks}>
        <Link to="/"><a className={styles.links}>Home</a></Link>
        <Link to="/features"><a className={styles.links}>Features</a></Link>
        <Link to="/customers"><a className={styles.links}>Customers</a></Link>
        <Link to="/support"><a className={styles.links}>Support</a></Link>
      </div>
      <div className={styles.authbuttons}>
      <button
          className={`${styles.inbutton} ${activeButton === 'signin' ? styles.active : ''}`}
          style={{ backgroundColor: 'transparent', fontSize: '15px' }}
          onClick={handleSignInClick}
        >
          <Link  to={'/signin'}><a className={styles.links}>Sign In</a></Link>
        </button>
        <button
          className={`${activeButton === 'signup' ? styles.active : ''}`}
          style={{ backgroundColor: '#7D55C7', fontSize: '15px' }}
          onClick={handleSignUpClick}
        >
          <Link to={'/signup'}><a className={styles.links}>Sign Up</a></Link>
        </button>
 
      </div>
    </nav>
  );
};

export default Navbar;
