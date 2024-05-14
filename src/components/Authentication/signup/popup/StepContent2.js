import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./VerticalStepper.css";

const StepContent2 = () => {
  const [activeStep, setActiveStep] = useState(1); // Initial active step

  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  return (
    <div className="vertical-stepper">
      <div className="step-container" onClick={() => handleStepClick(1)}>
        <div className={`step ${activeStep === 1 ? "active" : ""}`} id="line1">
          1
        </div>
        <Link to={"/companyDetails"}>
          {" "}
          <div className="step-title">Company Details</div>{" "}
        </Link>
      </div>
      <div className="step-container" onClick={() => handleStepClick(2)}>
        <div className={`step ${activeStep === 2 ? "active" : ""}`} id="line2">
          2
        </div>
        <Link to={"/industry"}>
          {" "}
          <div className="step-title"> Industry</div>
        </Link>
      </div>
      <div className="step-container" onClick={() => handleStepClick(3)}>
        <div className={`step ${activeStep === 3 ? "active" : ""}`} id="line3">
          3
        </div>
        <Link to={"/companysize"}>
          {" "}
          <div className="step-title">companysize</div>
        </Link>
      </div>
      <div className="step-container" onClick={() => handleStepClick(4)}>
        <div className={`step ${activeStep === 4 ? "active" : ""}`}>4</div>
        <Link to={"/serviceorproduct"}>
          {" "}
          <div className="step-title">ServiceOrProduct</div>
        </Link>
      </div>
    </div>
  );
};

export default StepContent2;
