import React, { useState } from "react";
import saveAs from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
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
    customerName: "",
    region: "",
    projectName: "",
    siteName: "",
    siteOwner: "",
    siteID: "",
    siteStackCode: "",
    baseStationName: "",
    numberOfSectors: "",
    baseStationAzimuths: "",
    mastLegNumber: "",
    baseStationHeight: "",
    numberOfLinks: "",
    p2pLinkHeights: "",
    p2pLinkAzimuths: "",
    siteStreetAddress: "",
    contactPerson: "",
    alternateContact: "",
    contactPhone: "",
    inspectedBy: "",
    surveyPerformedBy: "",
    dateOfSiteSurvey: "",
    latitude: "",
    longitude: "",
    altitude: "",
    siteAddress: "",
    mastType: "",
    mastHeight: "",
    mastCondition: "",
    mountingPoleDiameter: "",
    antennaHeight: "",
    numberOfAntennas: "",
    antennasPerSector: "",
    cableEntryPoint: "",
    shelterSize: "",
    lightningProtection: false,
    earthing: false,
    equipmentLocation: "",
    powerType: "",
    powerAvailability: "",
    powerRating: "",
    cableLengthSector1: "",
    cableLengthSector2: "",
    cableLengthSector3: "",
    cableLengthSector4: "",
    excavationRequired: false,
    unstableGround: false,
    additionalLabour: false,
    notes: ""
  });

  const [photos, setPhotos] = useState([]);

  const sections = [
    "siteInfo",
    "locationMast",
    "power",
    "cabling",
    "environment",
    "photos",
    "review"
  ];

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

  const handleSubmit = async () => {
    const doc = new Document();

    const makeTable = (title, data) => [
      new Paragraph({ text: title, heading: HeadingLevel.HEADING_2 }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: data.map(([label, value]) =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: label, bold: true })] }),
              new TableCell({ children: [new Paragraph(String(value))] })
            ]
          })
        )
      }),
      new Paragraph({ text: "" })
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
        ["Azimuths", formData.baseStationAzimuths],
        ["Mast Leg Number", formData.mastLegNumber],
        ["Base Station Height", formData.baseStationHeight],
        ["Number of Links", formData.numberOfLinks],
        ["Link Heights", formData.p2pLinkHeights],
        ["Link Azimuths", formData.p2pLinkAzimuths],
        ["Street Address", formData.siteStreetAddress],
        ["Contact Person", formData.contactPerson],
        ["Alternate Contact", formData.alternateContact],
        ["Contact Phone", formData.contactPhone],
        ["Inspected By", formData.inspectedBy],
        ["Survey Performed By", formData.surveyPerformedBy],
        ["Survey Date", formData.dateOfSiteSurvey]
      ]),
      makeTable("Location & Mast", [
        ["Latitude", formData.latitude],
        ["Longitude", formData.longitude],
        ["Altitude", formData.altitude],
        ["Site Address", formData.siteAddress],
        ["Mast Type", formData.mastType],
        ["Mast Height", formData.mastHeight],
        ["Mast Condition", formData.mastCondition],
        ["Mounting Pole Diameter", formData.mountingPoleDiameter],
        ["Antenna Height", formData.antennaHeight],
        ["Number of Antennas", formData.numberOfAntennas],
        ["Antennas per Sector", formData.antennasPerSector],
        ["Cable Entry Point", formData.cableEntryPoint],
        ["Shelter Size", formData.shelterSize],
        ["Lightning Protection", formData.lightningProtection ? "Yes" : "No"],
        ["Earthing", formData.earthing ? "Yes" : "No"],
        ["Equipment Location", formData.equipmentLocation]
      ]),
      makeTable("Power", [
        ["Power Type", formData.powerType],
        ["Availability", formData.powerAvailability],
        ["Rating", formData.powerRating]
      ]),
      makeTable("Cabling", [
        ["Sector 1", formData.cableLengthSector1],
        ["Sector 2", formData.cableLengthSector2],
        ["Sector 3", formData.cableLengthSector3],
        ["Sector 4", formData.cableLengthSector4]
      ]),
      makeTable("Environment", [
        ["Excavation Required", formData.excavationRequired ? "Yes" : "No"],
        ["Unstable Ground", formData.unstableGround ? "Yes" : "No"],
        ["Additional Labour", formData.additionalLabour ? "Yes" : "No"],
        ["Notes", formData.notes]
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

  const renderInput = (placeholder, key, type = "text") => (
    <input
      type={type}
      placeholder={placeholder}
      value={formData[key] || ""}
      onChange={handleChange(key)}
      className="w-full border p-2 rounded"
    />
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        Site Survey - {currentSection.replace(/([A-Z])/g, " $1").toUpperCase()}
      </h1>

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
              <img src={photo.src} alt={photo-${idx}} className="w-full rounded mb-2" />
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
          <pre className="bg-gray-100 p-4 text-sm overflow-x-auto">{JSON.stringify(formData, null, 2)}</pre>
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
