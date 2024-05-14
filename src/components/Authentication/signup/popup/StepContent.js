import React, { useState } from "react";
import "./VerticalStepper.css";
import { Link } from "react-router-dom";

const StepContent = () => {
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
        <Link to={"/ProfileDetails"}>
          {" "}
          <div className="step-title">Profile Details</div>{" "}
        </Link>
      </div>
      <div className="step-container" onClick={() => handleStepClick(2)}>
        <div className={`step ${activeStep === 2 ? "active" : ""}`} id="line2">
          2
        </div>
        <Link to={"/recognition"}>
          {" "}
          <div className="step-title">Facial recognition</div>
        </Link>
      </div>
      <div className="step-container" onClick={() => handleStepClick(3)}>
        <div className={`step ${activeStep === 3 ? "active" : ""}`}>3</div>
        <Link to={"/verification"}>
          {" "}
          <div className="step-title">Verification</div>
        </Link>
      </div>
    </div>
  );
};

export default StepContent;
