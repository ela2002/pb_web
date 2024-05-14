import React, { useState } from 'react';
import styles from './SearchBar.module.css'; 
import { FaSearch} from "react-icons/fa";
const SearchBar = ({  allCompanies, setFilteredCompanies }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClick = () => {
    const filteredCompanies = allCompanies.filter((company) =>
      company.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCompanies(filteredCompanies);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className={styles.searchBar}>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search for Employee"
        className={styles.input}
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
      />


      {/* Buttons */}
      <div className={styles.buttons}>
       
        <button className={styles.button}  onClick={handleSearchClick}>
  Search
</button>


      </div>

      {/* Advanced Search Filters */}

    
    </div>
  );
};

export default SearchBar;
