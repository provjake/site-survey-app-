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
  const [formData, setFormData] = useState({
    customerName: "",
    region: "",
    projectName: "",
    siteName: "",
    siteOwner: "",
    siteID: "",
    baseStationName: "",
    siteLatitude: "",
    siteLongitude: "",
    altitude: "",
    siteAddress: "",
    contactPrimary: "",
    contactPhone: "",
    mastType: "",
    mastHeight: "",
    hasPower: false,
    powerType: "",
    shelterSize: "",
    cableLengthSector1: "",
    cableLengthSector2: "",
    cableLengthSector3: "",
    cableLengthSector4: "",
    lightningProtection: false,
    earthing: false,
    antennas: "",
    civilRequirements: "",
    antennaHeight: "",
    mountingPoleDiameter: "",
    excavationRequired: false,
    securityRequired: false,
    unstableGround: false,
    additionalLabour: false,
    notes: "",
  });

  const [photos, setPhotos] = useState([]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [field]: value });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => ({
      src: URL.createObjectURL(file),
      file: file,
      caption: "",
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleCaptionChange = (index, caption) => {
    const updatedPhotos = [...photos];
    updatedPhotos[index].caption = caption;
    setPhotos(updatedPhotos);
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const formatField = (key) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  const handleSubmit = async () => {
    const doc = new Document();

    const infoRows = Object.entries(formData).map(([key, value]) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ text: formatField(key), bold: true })],
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: [new Paragraph(String(value))],
          }),
        ],
      })
    );

    const infoTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: infoRows,
    });

    const photoParagraphs = await Promise.all(
      photos.map(async (photo) => {
        const imageBuffer = await photo.file.arrayBuffer();
        const image = Media.addImage(doc, imageBuffer, 400, 300);
        return [
          new Paragraph({ text: photo.caption, heading: HeadingLevel.HEADING_3 }),
          new Paragraph(image),
        ];
      })
    );

    doc.addSection({
      children: [
        new Paragraph({
          text: "Site Survey Report",
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 300 },
        }),
        infoTable,
        new Paragraph({ text: "Photos & Captions", heading: HeadingLevel.HEADING_2 }),
        ...photoParagraphs.flat(),
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Site_Survey_Report.docx");
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Site Survey - Base Station</h1>

      <div className="grid grid-cols-1 gap-4">
        <input type="text" placeholder="Customer Name" value={formData.customerName} onChange={handleChange("customerName")} />
        <input type="text" placeholder="Region" value={formData.region} onChange={handleChange("region")} />
        <input type="text" placeholder="Project Name" value={formData.projectName} onChange={handleChange("projectName")} />
        <input type="text" placeholder="Site / Building Name" value={formData.siteName} onChange={handleChange("siteName")} />
        <input type="text" placeholder="Site Owner" value={formData.siteOwner} onChange={handleChange("siteOwner")} />
        <input type="text" placeholder="Base Station Name" value={formData.baseStationName} onChange={handleChange("baseStationName")} />
        <input type="text" placeholder="Site Latitude" value={formData.siteLatitude} onChange={handleChange("siteLatitude")} />
        <input type="text" placeholder="Site Longitude" value={formData.siteLongitude} onChange={handleChange("siteLongitude")} />
        <textarea placeholder="Site Address" value={formData.siteAddress} onChange={handleChange("siteAddress")} />
        <input type="text" placeholder="Primary Contact" value={formData.contactPrimary} onChange={handleChange("contactPrimary")} />
        <input type="text" placeholder="Telephone" value={formData.contactPhone} onChange={handleChange("contactPhone")} />
        <input type="text" placeholder="Mast Type" value={formData.mastType} onChange={handleChange("mastType")} />
        <input type="text" placeholder="Mast Height" value={formData.mastHeight} onChange={handleChange("mastHeight")} />
        <input type="text" placeholder="Power Type" value={formData.powerType} onChange={handleChange("powerType")} />
        <textarea placeholder="Civil Requirements" value={formData.civilRequirements} onChange={handleChange("civilRequirements")} />
        <textarea placeholder="Notes" value={formData.notes} onChange={handleChange("notes")} />
        <input type="file" accept="image/*" multiple capture="environment" onChange={handlePhotoUpload} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {photos.map((photo, index) => (
          <div key={index} className="space-y-2 relative border p-2 rounded shadow">
            <img src={photo.src} alt={`Upload ${index}`} className="w-full h-auto rounded" />
            <textarea
              placeholder="Add a caption or description"
              value={photo.caption}
              onChange={(e) => handleCaptionChange(index, e.target.value)}
              className="w-full"
            />
            <button
              onClick={() => removePhoto(index)}
              style={{ position: "absolute", top: 8, right: 8 }}
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button onClick={handleSubmit} className="bg-blue-600 text-white py-2 px-4 rounded">
          Save as Word Document
        </button>
      </div>
    </div>
  );
}
