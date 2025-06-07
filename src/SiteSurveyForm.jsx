import React, { useState } from "react";

export default function SiteSurveyForm() {
  const [currentSection, setCurrentSection] = useState("siteInfo");
  const [formData, setFormData] = useState({
    customerName: "",
    siteName: "",
    siteID: "",
    siteStackCode: "",
    contactPerson: "",
    alternateContact: "",
    inspectedBy: "",
    surveyPerformedBy: "",
    dateOfSiteSurvey: "",
  });

  const sections = ["siteInfo", "review"];

  const handleChange = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [key]: value });
  };

  const handlePrevious = () => {
    const index = sections.indexOf(currentSection);
    if (index > 0) setCurrentSection(sections[index - 1]);
  };

  const handleNext = () => {
    const index = sections.indexOf(currentSection);
    if (index < sections.length - 1) setCurrentSection(sections[index + 1]);
  };

  const handleSubmit = () => {
    console.log("Form Submitted", formData);
    alert("Form Submitted. Word export not included in this version.");
  };

  const renderInput = (label, key, type = "text") => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={formData[key]}
        onChange={handleChange(key)}
        className="w-full border border-gray-300 p-2 rounded"
      />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Site Survey – {currentSection.replace(/([A-Z])/g, " $1")}
      </h1>

      {currentSection === "siteInfo" && (
        <div className="space-y-4">
          {renderInput("Customer Name", "customerName")}
          {renderInput("Site Name", "siteName")}
          {renderInput("Site ID", "siteID")}
          {renderInput("Site Stack Code", "siteStackCode")}
          {renderInput("Primary Contact", "contactPerson")}
          {renderInput("Alternate Contact", "alternateContact")}
          {renderInput("Inspected By", "inspectedBy")}
          {renderInput("Survey Performed By", "surveyPerformedBy")}
          {renderInput("Date of Site Survey", "dateOfSiteSurvey", "date")}
        </div>
      )}

      {currentSection === "review" && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Review</h2>
          <pre className="text-sm">{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentSection === sections[0]}
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>

        {currentSection === "review" ? (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
