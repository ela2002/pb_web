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

  const handleApplyFilters = () => {
    onToggleAdvancedFilters(); // Hide advanced filters after applying
  };

  return (
    <div className={styles.searchBar}>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search for Jobs"
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
          <FaSearch />
        </button>
        <button className={styles.button} onClick={onReset}>
          Reset
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
                className={`${styles.filterInput} ${styles.loc_job}`} 
                value={advancedFilters.location} 
                onChange={handleInputChange} 
              />
            </div>
            <div className={styles.filterInputContainer}>
              <label htmlFor="salary" className={styles.filterLabel}>Salary</label>
              <input 
                type="text" 
                id="salary" 
                placeholder="Enter Salary" 
                className={styles.filterInput} 
                value={advancedFilters.salary} 
                onChange={handleInputChange} 
              />
            </div>
            <div className={styles.filterInputContainer}>
              <label htmlFor="companyName" className={styles.filterLabel}>Company Name</label>
              <input 
                type="text" 
                id="companyName" 
                placeholder="Enter Company Name" 
                className={styles.filterInput} 
                value={advancedFilters.companyName} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
