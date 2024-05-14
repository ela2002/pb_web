import React, { useState, useEffect } from 'react';
import styles from './JobOpportunities.module.css';
import SearchBar from '../../../Employee/JobOpportunities/SearchBar'; 
import JobCard from '../../../Employee/JobOpportunities/JobCard'; 
import { firestore, auth } from '../../../../firebase/firebase';
import { collection, getDocs, query, where } from "firebase/firestore";
import Navbar from "../../../Employee/Navbar/Navbar";
import ClipLoader from "react-spinners/ClipLoader";

const JobOpportunities = () => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({}); // State for filters
  const [loading, setLoading] = useState(true);
  const [userCompanyIndustry, setUserCompanyIndustry] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, showAdvancedFilters, filters, userCompanyIndustry]);

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      let jobsCollection = collection(firestore, "jobs");
  
      // Apply search query
      if (searchQuery.trim() !== '') {
        jobsCollection = query(jobsCollection, where("title", ">=", searchQuery.trim()), where("title", "<=", searchQuery.trim() + '\uf8ff'));
      }
  
      // Apply filters
      if (filters.location || filters.Salary || filters.companyName) {
        if (filters.location) {
          jobsCollection = query(jobsCollection, where("location", ">=", filters.location), where("location", "<=", filters.location ));
        }
        if (filters.Salary) {
          jobsCollection = query(jobsCollection, where("salary", ">=", filters.Salary), where("salary", "<=", filters.Salary));
        }
        if (filters.companyName) {
          const companyName = filters.companyName; // Convert to lowercase
          jobsCollection = query(jobsCollection, where("companyName", ">=", companyName), where("companyName", "<=", companyName));
        }
      }
  
      // Add filter based on the user's company industry
      if (userCompanyIndustry) {
        jobsCollection = query(jobsCollection, where("industry", "==", userCompanyIndustry));
      }
  
      const jobsSnapshot = await getDocs(jobsCollection);
      const jobsData = [];
  
      for (const jobDoc of jobsSnapshot.docs) {
        const jobData = jobDoc.data();
  
        const companyId = jobData.companyId;
        const companyQuerySnapshot = await getDocs(query(collection(firestore, "companiesprofile"), where("uid", "==", companyId)));
        if (!companyQuerySnapshot.empty) {
          const companyDoc = companyQuerySnapshot.docs[0];
          const companyData = companyDoc.data();
  
          const jobWithCompany = {
            id: jobDoc.id,
            ...jobData,
            companyName: companyData.companyName,
            companyLogoUrl: companyData.profilePic
          };
  
          jobsData.push(jobWithCompany);
        } else {
          console.error(`Company data not found for companyId: ${companyId}`);
        }
      }
  
      setJobs(jobsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs from Firestore:", error);
      setLoading(false);
    }
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
    <div className={styles.jobOpportunitiesPage}>
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
      {loading ? (
        <div className={styles.loading}>
          <ClipLoader color="#B69FEB" size={50} speedMultiplier={0.5} />
        </div>
      ) : (
        <div className={styles.jobList}>
          {jobs.length > 0 ? (
            jobs.map(job => (
              <JobCard job={job} key={job.id}  />
            ))
          ) : (
            <p>No jobs found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobOpportunities;
