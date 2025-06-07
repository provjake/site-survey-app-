import React, { useState } from "react";
import saveAs from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  Media,
} from "docx";

export default function SiteSurveyForm() {
  const [currentSection, setCurrentSection] = useState("siteInfo");
  const [formData, setFormData] = useState({
    customerName: "", region: "", projectName: "", siteName: "", siteOwner: "", siteID: "",
    siteStackCode: "", baseStationName: "", numberOfSectors: "", baseStationAzimuths: "",
    mastLegNumber: "", baseStationHeight: "", numberOfLinks: "", p2pLinkHeights: "",
    p2pLinkAzimuths: "", siteStreetAddress: "", contactPerson: "", alternateContact: "",
    contactPhone: "", inspectedBy: "", surveyPerformedBy: "", dateOfSiteSurvey: "",
    latitude: "", longitude: "", altitude: "", siteAddress: "", mastType: "", mastHeight: "",
    mastCondition: "", mountingPoleDiameter: "", antennaHeight: "", numberOfAntennas: "",
    antennasPerSector: "", cableEntryPoint: "", shelterSize: "", lightningProtection: false,
    earthing: false, equipmentLocation: "", powerType: "", powerAvailability: "",
    powerRating: "", cableLengthSector1: "", cableLengthSector2: "", cableLengthSector3: "",
    cableLengthSector4: "", excavationRequired: false, unstableGround: false,
    additionalLabour: false, notes: ""
  });
  const [photos, setPhotos] = useState([]);
  const sections = ["siteInfo", "locationMast", "power", "cabling", "environment", "photos", "review"];

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

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => ({
      src: URL.createObjectURL(file),
      file,
      caption: ""
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const handleCaptionChange = (index, value) => {
    const updated = [...photos];
    updated[index].caption = value;
    setPhotos(updated);
  };

  const handleRemovePhoto = (index) => {
    const updated = [...photos];
    updated.splice(index, 1);
    setPhotos(updated);
  };

  const renderInput = (label, key, type = "text") => (
    <input
      type={type}
      placeholder={label}
      value={formData[key] || ""}
      onChange={handleChange(key)}
      className="w-full border p-2 rounded"
    />
  );

  const handleSubmit = async () => {
    const doc = new Document();
    const makeTable = (title, data) => [
      new Paragraph({ text: title, heading: HeadingLevel.HEADING_2 }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: data.map(([label, value]) =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(label)] }),
              new TableCell({ children: [new Paragraph(String(value))] })
            ]
          })
        )
      }),
      new Paragraph("")
    ];

    const sectionsData = [
      makeTable("Site Info", [
        ["Customer Name", formData.customerName],
        ["Region", formData.region],
        ["Project Name", formData.projectName],
        ["Site Name", formData.siteName],
        ["Site Owner", formData.siteOwner],
        ["Site ID", formData.siteID],
        ["Stack Code", formData.siteStackCode],
        ["Base Station Name", formData.baseStationName],
        ["Number of Sectors", formData.numberOfSectors],
        ["Base Station Azimuths", formData.baseStationAzimuths],
        ["Mast Leg Number", formData.mastLegNumber],
        ["Base Station Height", formData.baseStationHeight],
        ["Number of Links", formData.numberOfLinks],
        ["P2P Link Heights", formData.p2pLinkHeights],
        ["P2P Link Azimuths", formData.p2pLinkAzimuths],
        ["Site Street Address", formData.siteStreetAddress],
        ["Primary Contact", formData.contactPerson],
        ["Alternate Contact", formData.alternateContact],
        ["Contact Phone", formData.contactPhone],
        ["Inspected By", formData.inspectedBy],
        ["Survey Performed By", formData.surveyPerformedBy],
        ["Date of Site Survey", formData.dateOfSiteSurvey]
      ])
    ];

    const photoParagraphs = await Promise.all(
      photos.map(async ({ caption, file }) => {
        const buffer = await file.arrayBuffer();
        const image = Media.addImage(doc, buffer, 400, 300);
        return [
          new Paragraph(image),
          caption && new Paragraph({ text: caption })
        ];
      })
    );

    doc.addSection({
      children: [
        new Paragraph({ text: "Site Survey Report", heading: HeadingLevel.HEADING_1 }),
        ...sectionsData.flat(),
        new Paragraph({ text: "Photos", heading: HeadingLevel.HEADING_2 }),
        ...photoParagraphs.flat().filter(Boolean)
      ]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Site_Survey_Report.docx");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        Site Survey - {currentSection.replace(/([A-Z])/g, " $1").toUpperCase()}
      </h1>

      {currentSection === "siteInfo" && (
        <div className="space-y-4">
          {renderInput("Customer Name", "customerName")}
          {renderInput("Region", "region")}
          {renderInput("Project Name", "projectName")}
          {renderInput("Site Name", "siteName")}
          {renderInput("Site Owner", "siteOwner")}
          {renderInput("Site ID", "siteID")}
          {renderInput("Stack Code", "siteStackCode")}
          {renderInput("Base Station Name", "baseStationName")}
          {renderInput("Number of Sectors", "numberOfSectors")}
          {renderInput("Base Station Azimuths", "baseStationAzimuths")}
          {renderInput("Mast Leg Number", "mastLegNumber")}
          {renderInput("Base Station Height", "baseStationHeight")}
          {renderInput("Number of Links", "numberOfLinks")}
          {renderInput("P2P Link Heights", "p2pLinkHeights")}
          {renderInput("P2P Link Azimuths", "p2pLinkAzimuths")}
          {renderInput("Site Street Address", "siteStreetAddress")}
          {renderInput("Primary Contact", "contactPerson")}
          {renderInput("Alternate Contact", "alternateContact")}
          {renderInput("Contact Phone", "contactPhone")}
          {renderInput("Inspected By", "inspectedBy")}
          {renderInput("Survey Performed By", "surveyPerformedBy")}
          {renderInput("Date of Site Survey", "dateOfSiteSurvey", "date")}
        </div>
      )}

      {currentSection === "locationMast" && (
        <div className="space-y-4">
          {renderInput("Latitude", "latitude")}
          {renderInput("Longitude", "longitude")}
          {renderInput("Altitude", "altitude")}
          {renderInput("Site Address", "siteAddress")}
          {renderInput("Mast Type", "mastType")}
          {renderInput("Mast Height", "mastHeight")}
          {renderInput("Mast Condition", "mastCondition")}
          {renderInput("Mounting Pole Diameter", "mountingPoleDiameter")}
          {renderInput("Antenna Height", "antennaHeight")}
          {renderInput("Number of Antennas", "numberOfAntennas")}
          {renderInput("Antennas per Sector", "antennasPerSector")}
          {renderInput("Cable Entry Point", "cableEntryPoint")}
          {renderInput("Shelter Size", "shelterSize")}
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.lightningProtection} onChange={handleChange("lightningProtection")} />
            Lightning Protection?
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.earthing} onChange={handleChange("earthing")} />
            Earthing?
          </label>
          {renderInput("Equipment Location", "equipmentLocation")}
        </div>
      )}

      {currentSection === "power" && (
        <div className="space-y-4">
          {renderInput("Power Source Type", "powerType")}
          {renderInput("Power Availability", "powerAvailability")}
          {renderInput("Power Rating", "powerRating")}
        </div>
      )}

      {currentSection === "cabling" && (
        <div className="space-y-4">
          {renderInput("Cable Length Sector 1", "cableLengthSector1")}
          {renderInput("Cable Length Sector 2", "cableLengthSector2")}
          {renderInput("Cable Length Sector 3", "cableLengthSector3")}
          {renderInput("Cable Length Sector 4", "cableLengthSector4")}
        </div>
      )}

      {currentSection === "environment" && (
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.excavationRequired} onChange={handleChange("excavationRequired")} />
            Excavation Required?
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.unstableGround} onChange={handleChange("unstableGround")} />
            Unstable Ground?
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.additionalLabour} onChange={handleChange("additionalLabour")} />
            Additional Labour Needed?
          </label>
          <textarea
            placeholder="Additional Notes"
            value={formData.notes}
            onChange={handleChange("notes")}
            className="w-full border p-2 rounded"
          />
        </div>
      )}

      {currentSection === "photos" && (
        <div className="space-y-4">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={handlePhotoUpload}
            className="w-full border p-2 rounded"
          />
          {photos.map((photo, idx) => (
            <div key={idx} className="border p-2 rounded">
              <img src={photo.src} alt={`photo-${idx}`} className="w-full rounded mb-2" />
              <textarea
                placeholder="Photo caption"
                className="w-full border p-2 mb-2 rounded"
                value={photo.caption}
                onChange={(e) => handleCaptionChange(idx, e.target.value)}
              />
              <button
                onClick={() => handleRemovePhoto(idx)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {currentSection === "review" && (
        <div>
          <pre className="bg-gray-100 p-4 text-sm overflow-x-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentSection === sections[0]}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        {currentSection === "review" ? (
          <button onClick={handleSubmit} className="bg-green-700 text-white px-4 py-2 rounded">
            Save Word Document
          </button>
        ) : (
          <button onClick={handleNext} className="bg-blue-700 text-white px-4 py-2 rounded">
            Next
          </button>
        )}
      </div>
    </div>
  );
}
