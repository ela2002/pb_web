import React, { useState } from 'react';
import styles from './SearchBar.module.css'; 
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchBar = ({ handleSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    handleSearch(searchQuery); // Call the handleSearch function passed as prop
  };

  const handleReset = () => {
    setSearchQuery(''); // Reset the search query
    handleSearch(''); // Call handleSearch with an empty string to reset the search
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search for Employee"
        className={styles.input}
        value={searchQuery}
        onChange={handleChange}
      />
<div className={styles.buttons}>
      {/* Search Button */}
      <button type="submit" className={styles.button}>
        <FaSearch /> Search
      </button>

      {/* Reset Button */}
      {searchQuery && (
        <button type="button" className={styles.resetButton} onClick={handleReset}>
          <FaTimes /> Reset
        </button>
      )}
      </div>
    </form>
  );
};

export default SearchBar;
