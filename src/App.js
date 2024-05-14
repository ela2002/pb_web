import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AppContext from "./AppContext/AppContext";
import SignIn from "./components/Authentication/signin/signin";
import SignUp from "./components/Authentication/signup/signup";
import JobOffers from "./components/pages/Company/JobOffers/jobOffers";
import Employees from "./components/pages/Company/Employees/Employees";
import EmployeeProfile from "./components/pages/Company/EmployeeProfile/EmployeeProfile";
import CompanyProfile from "./components/pages/Company/CompanyProfile/CompanyProfile";
import ProfileDetails from "./components/Authentication/signup/popup/profileDetails";
import Facialrecognition from "./components/Authentication/signup/popup/facialrecognition";
import Verification from "./components/Authentication/signup/popup/verification";
import Approvement from "./components/Authentication/signup/popup/approvement";
import Industry from "./components/Authentication/signup/popup/company/industry";
import CompanySize from "./components/Authentication/signup/popup/company/companysize";
import ServiceOrProduct from "./components/Authentication/signup/popup/company/serviceorproduct";
import FirstPopup from "./components/Authentication/signup/popup/firstpopup";
import Autherror from "./components/errors/autherror";
import CompanyProfile1 from "./components/Authentication/signup/popup/company/companyprofile1";
import Chartpage from "./components/Company/companyhome/chartpage";
import ConsultApplications from "./components/pages/Company/jobapplications/Jobapplication";
import Insightzone from "./components/pages/Employee/Insightzone/Insightzone";
import EmployeeProfile1 from "./components/pages/Employee/EmployeeProfile/EmployeeProfile";
import Chat from "./components/pages/Employee/Chat/Chat";
import Community from "./components/pages/Employee/Community/Community";
import Companies from "./components/pages/Employee/Companies/Companies";
import CompanyProfile2 from "./components/pages/Employee/CompanyProfile/CompanyProfile";
import Article from "./components/Employee/Insightzone/Article";
import JobDetails from "./components/Employee/JobOpportunities/JobDetails";
import Applications from "./components/Employee/JobOpportunities/Applications";
import JobOpportunities from "./components/pages/Employee/JobOpportunities/JobOpportunities";
import EmployeeProfile2 from "./components/pages/Employee/EmployeeProfile2/EmployeeProfile2";
import ForgotPassword from "./components/Authentication/signin/ForgotPassword";
const App = () => {
  return (
    <Router>
      <div>
        <AppContext>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/dashboard" element={<Chartpage />} />
            <Route path="/insightzone" element={<Insightzone />} />
            <Route path="/employeeprofile" element={<EmployeeProfile1 />} />
            <Route
              path="/employeeprofile2/:id"
              element={<EmployeeProfile2 />}
            />
            <Route path="/community" element={<Community />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/job-opportunities" element={<JobOpportunities />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/companyprofile2/:id" element={<CompanyProfile2 />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/jobdetails/:id" element={<JobDetails />} />
            <Route path="/applications" element={<Applications />} />

            <Route path="/ProfileDetails" element={<ProfileDetails />} />
            <Route path="/recognition" element={<Facialrecognition />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/approvment" element={<Approvement />} />
            <Route path="/companyDetails" element={<CompanyProfile1 />} />
            <Route path="/industry" element={<Industry />} />
            <Route path="/companysize" element={<CompanySize />} />
            <Route path="/Serviceorproduct" element={<ServiceOrProduct />} />
            <Route path="/popup" element={<FirstPopup />} />
            <Route path="/Autherror" element={<Autherror />} />
            <Route
              path="/consult-applications"
              element={<ConsultApplications />}
            />
            <Route path="/job-offers" element={<JobOffers />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/companyprofile" element={<CompanyProfile />} />
            <Route path="/employeeprofile/:id" element={<EmployeeProfile />} />
          </Routes>
        </AppContext>
      </div>
    </Router>
  );
};

export default App;
