// SearchBar.jsx
import React, { useState } from 'react';
import styles from './SearchBar.module.css'; 
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onReset, onSearch, showAdvancedFilters, onFilterChange, onToggleAdvancedFilters, advancedFilters }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    onFilterChange(id, value);
  };

  const toggleAdvancedFilters = () => {
    onToggleAdvancedFilters(); // Toggle the state of advanced filters
  };

  return (
    <div className={styles.searchBar}>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search for Company"
        className={styles.input}
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {/* Buttons */}
      <div className={styles.buttons}>
        <button className={styles.button} onClick={toggleAdvancedFilters}>
          {showAdvancedFilters ? 'Hide Advanced Search' : 'Show Advanced Search'}
        </button>
        <button className={styles.button} onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Advanced Search Filters */}
      {showAdvancedFilters && (
        <div className={styles.advancedSearchContainer}>
          {/* Filter inputs */}
          <div className={styles.filterInputRow}>
            <div className={styles.filterInputContainer}>
              <label htmlFor="location" className={styles.filterLabel}>Location</label>
              <input 
                type="text" 
                id="location" 
                placeholder="Enter Location" 
                className={styles.filterInput} 
                value={advancedFilters.location} 
                onChange={handleInputChange} 
              />
            </div>
            <div className={styles.filterInputContainer}>
              <label htmlFor="industry" className={styles.filterLabel}>Industry</label>
              <input 
                type="text" 
                id="industry" 
                placeholder="Enter Industry" 
                className={styles.filterInput} 
                value={advancedFilters.industry} 
                onChange={handleInputChange} 
              />
            </div>
            <div className={styles.filterInputContainer}>
              <label htmlFor="globalRating" className={styles.filterLabel}>Global Rating</label>
              <input 
                type="text" 
                id="globalRating" 
                placeholder="Enter Rating" 
                className={styles.filterInput} 
                value={advancedFilters.globalRating} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
          <button className={styles.button} onClick={onReset}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
