import React, { useState, useEffect } from 'react';
import styles from './Companies.module.css';
import SearchBar from '../../../Employee/Companies/SearchBar';
import CompanyCard from '../../../Employee/Companies/CompanyCard';
import Navbar from "../../../Employee/Navbar/Navbar";
import { firestore, auth } from '../../../../firebase/firebase';
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import ClipLoader from "react-spinners/ClipLoader";

const Companies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({}); // State for filters
  const [employeeData, setEmployeeData] = useState(null); // State for employee data

  

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true);
        let companiesCollection = collection(firestore, "companiesprofile");
        
        // Apply filters
        if (employeeData && employeeData.industry) {
          companiesCollection = query(companiesCollection, where("industry", "==", employeeData.industry));
        }

        if (searchQuery.trim() !== '') {
          companiesCollection = query(companiesCollection, where("companyName", ">=", searchQuery.trim()), where("companyName", "<=", searchQuery.trim() + '\uf8ff'));
        }

        if (filters.location) {
          companiesCollection = query(companiesCollection, where("location", ">=", filters.location), where("location", "<=", filters.location + '\uf8ff')) ;
        }

        if (filters.industry) {
          companiesCollection = query(companiesCollection, where("industry", ">=", filters.industry), where("industry", "<=", filters.industry  + '\uf8ff'));
        }

        if (filters.globalRating) {
          companiesCollection = query(companiesCollection, where("globalRating", "==", parseInt(filters.globalRating)));
        }

        const companiesSnapshot = await getDocs(companiesCollection);
        const companiesData = companiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setCompanies(companiesData);
        setLoadingCompanies(false);
      } catch (error) {
        console.error("Error fetching companies from Firestore:", error);
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, [searchQuery, employeeData, filters]); // Fetch companies whenever searchQuery, employeeData, or filters change

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const handleReset = () => {
    setSearchQuery('');
    setFilters({});
  };

  return (
    <div className={styles.companiesPage}>
      <Navbar />
      <div className={styles.searchContainer}>
        <SearchBar 
          onReset={handleReset}
          onSearch={handleSearch}
          showAdvancedFilters={showAdvancedFilters}
          onToggleAdvancedFilters={toggleAdvancedFilters}
          onFilterChange={handleFilterChange}
          advancedFilters={filters} // Pass the filters state as advancedFilters
        />
      </div>
      {loadingCompanies ? (
        <div className={styles.loading}>
          <ClipLoader color="#B69FEB" size={50} speedMultiplier={0.5} />
        </div>
      ) : (
        <div className={styles.companyList}>
          {companies.length > 0 ? (
            companies.map(company => (
              <CompanyCard company={company} key={company.id} />
            ))
          ) : (
            <p>No companies found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Companies;
