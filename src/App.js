import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AppContext from "./AppContext/AppContext";
import SignIn from "./components/Authentication/signin/signin";
import SignUp from "./components/Authentication/signup/signup";
import JobOffers from "./components/pages/Company/JobOffers/jobOffers";
import Employees from "./components/pages/Company/Employees/Employees";
import CompanyProfile from "./components/pages/Company/CompanyProfile/CompanyProfile";
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
import EmployeeProfile3 from "./components/pages/Company/EmployeeProfile1/EmployeeProfile1";
import ForgotPassword from "./components/Authentication/signin/ForgotPassword";
import ProtectedRoute from "./components/Authentication/protected/ProtectedRoute";
import PublicRoute from "./components/Authentication/protected/PublicRoute";

const App = () => {
  return (
    <Router>
      <div>
        <AppContext>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route
              path="/signin"
              element={
                <PublicRoute>
                  <SignIn />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Chartpage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/insightzone"
              element={
                <ProtectedRoute>
                  <Insightzone />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employeeprofile"
              element={
                <ProtectedRoute>
                  <EmployeeProfile1 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employeeprofile2/:id"
              element={
                <ProtectedRoute>
                  <EmployeeProfile2 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employeeprofile3/:id"
              element={
                <ProtectedRoute>
                  <EmployeeProfile3 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:id"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/job-opportunities"
              element={
                <ProtectedRoute>
                  <JobOpportunities />
                </ProtectedRoute>
              }
            />
            <Route
              path="/companies"
              element={
                <ProtectedRoute>
                  <Companies />
                </ProtectedRoute>
              }
            />
            <Route
              path="/companyprofile2/:id"
              element={
                <ProtectedRoute>
                  <CompanyProfile2 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/article/:id"
              element={
                <ProtectedRoute>
                  <Article />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobdetails/:id"
              element={
                <ProtectedRoute>
                  <JobDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute>
                  <Applications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/consult-applications"
              element={
                <ProtectedRoute>
                  <ConsultApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/job-offers"
              element={
                <ProtectedRoute>
                  <JobOffers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/companyprofile"
              element={
                <ProtectedRoute>
                  <CompanyProfile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AppContext>
      </div>
    </Router>
  );
};

export default App;
