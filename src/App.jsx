// App.jsx - All Pages with exact field labels and short per-section pages
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

function createInput(label, value, onChange, type = "text") {
  return (
    <div className="space-y-1">
      <label className="block font-medium">{label}</label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(label, e.target.value)}
        className="w-full border p-2 rounded"
      />
    </div>
  );
}

function createCheckbox(label, value, onChange) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={value || false}
        onChange={(e) => onChange(label, e.target.checked)}
      />
      {label}
    </label>
  );
}

function Page({ fields, formData, handleChange }) {
  return (
    <div className="space-y-4">
      {fields.map(({ label, type }) =>
        type === "checkbox"
          ? createCheckbox(label, formData[label], handleChange)
          : createInput(label, formData[label], handleChange, type)
      )}
    </div>
  );
}

function PhotosPage({ photos, setPhotos }) {
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => ({ file, caption: "", src: URL.createObjectURL(file) }));
    setPhotos([...photos, ...newPhotos]);
  };
  const updateCaption = (i, caption) => {
    const updated = [...photos];
    updated[i].caption = caption;
    setPhotos(updated);
  };
  const remove = (i) => {
    const updated = [...photos];
    updated.splice(i, 1);
    setPhotos(updated);
  };
  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" multiple onChange={handleUpload} />
      {photos.map((photo, i) => (
        <div key={i}>
          <img src={photo.src} className="w-full" alt="" />
          <textarea
            value={photo.caption}
            onChange={(e) => updateCaption(i, e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button onClick={() => remove(i)} className="text-red-600">Remove</button>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [formData, setFormData] = useState({});
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(0);

  const handleChange = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const pageDefs = [
    {
      title: "Site Address and Information",
      fields: [
        "Customer Name", "Region", "Project Name", "Site / Building Name", "Site Owner",
        "Site Stack Code", "Site ID Number", "Base Station Name", "Number of Sectors",
        "Base Station Azimuths", "Mast leg Number as per drawing", "Base Station Height",
        "Number of Links", "Point to Point link Heights", "Point to Point link Azimuths",
        "Site Street Address", "Primary Site Contact", "Telephone No", "Alternate Contact",
        "Telephone No (Alternate)", "Inspected By: Sentech Representative", "Employee Number (Rep 1)",
        "Inspected By: Second Sentech Representative", "Employee Number (Rep 2)",
        "Survey Performed By", "Date of Site Survey"
      ].map(label => ({ label, type: label.includes("Date") ? "date" : "text" }))
    },
    {
      title: "GPS Location and Accessibility",
      fields: [
        "Site latitude", "Site longitude", "Altitude above sea level (meters)",
        "Direction to the site location", "Road accessibility and road surface to the site",
        "Access to site: access codes/procedure", "Site accessibility and limitations: By car?",
        "Site accessibility and limitations: By 4WD?",
        "Site accessibility and limitations: By high ground clearance vehicle (GCV)?",
        "Is there parking at site?", "Comments", "Is there cell phone coverage on Site?",
        "Specify service provider"
      ].map(label => ({ label, type: "text" }))
    },
    {
      title: "Site Configuration and Environment",
      fields: [
        "Available mains power at shelter / building", "Available mains power on mast",
        "Standby Generator on Site", "Other power available (e.g. Solar, 12V / 24V / 48V)",
        "Specify other power", "Any unusual site hazards", "Noticeable dust",
        "Geography: Mountainous", "Geography: Rolling hills", "Geography: Flat and spacious",
        "Nearest hotel/lodge from site", "Town", "Phone no"
      ].map(label => ({ label, type: "text" }))
    },
    {
      title: "Infrastructure – Mast",
      fields: [
        "Mast / tower: Existing", "Mast / tower: New", "Specify owner", "Specify share site infrastructure/equipment",
        "Type of mast (Lattice, Concrete, Sectional pole, Guyed, Free-standing)",
        "Full mast height in meters", "Comments on mast", "Existing antennas on the mast?",
        "Specify: type, height, etc."
      ].map(label => ({ label, type: "text" }))
    },
    {
      title: "Antenna Mounting and Cabling",
      fields: [
        "Type of Mounting Pole used", "Diameter of pole (mm)", "Height of pole (m)",
        "Cable entry to shelter/equipment room", "Antenna mounting brackets required?",
        "If yes, specify bracket details"
      ].map(label => ({ label, type: "text" }))
    },
    {
      title: "Power and Earthing",
      fields: [
        "Power socket available at shelter?", "Specify voltage and socket type",
        "AC or DC power?", "Grounding/Earthing availability?", "Is Lightning Protection present?"
      ].map(label => ({ label, type: "text" }))
    },
    {
      title: "Shelter / Equipment Room Details",
      fields: [
        "Shelter / room: Size (L x W x H)", "Type of construction (brick, prefab, container)",
        "Ventilation available?", "Cooling equipment (fans, AC)?",
        "Available rack space?", "Lighting inside shelter?", "Access secured?"
      ].map(label => ({ label, type: "text" }))
    },
    {
      title: "Additional Notes and Recommendations",
      fields: [
        "Installer notes or constraints", "Recommended equipment setup",
        "Final recommendation summary", "Name of person completing this form"
      ].map(label => ({ label, type: "text" }))
    }
  ];

  const pages = [
    ...pageDefs.map((def, i) => <Page key={i} fields={def.fields} formData={formData} handleChange={handleChange} />),
    <PhotosPage photos={photos} setPhotos={setPhotos} />
  ];

   const handleExport = async () => {
  const makeTable = (title, data) => [
    new Paragraph({ text: title, heading: HeadingLevel.HEADING_2 }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: Object.entries(data).map(([label, value]) =>
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(label)] }),
            new TableCell({ children: [new Paragraph(String(value))] }),
          ],
        })
      ),
    }),
    new Paragraph(""),
  ];

  // Collect content in a temp array first
  const content = [
    new Paragraph({ text: "Site Survey Report", heading: HeadingLevel.HEADING_1 }),
    ...makeTable("Collected Data", formData),
  ];

  const validTypes = ["image/jpeg", "image/png"];

  if (photos.length) {
    content.push(new Paragraph({ text: "Photos", heading: HeadingLevel.HEADING_2 }));

    for (const { file, caption } of photos) {
      try {
        if (!validTypes.includes(file.type)) {
          console.warn(`Skipped image: ${file.name} (unsupported type ${file.type})`);
          continue;
        }

        for (const { file, caption } of photos) {
          try {
            const buffer = await file.arrayBuffer();
            const image = Media.addImage(doc, buffer, 400, 300); // ✅ Use existing `doc`
            children.push(new Paragraph(image));
            if (caption) {
              children.push(new Paragraph({ text: caption }));
            }
          } catch (err) {
            console.error(`Failed to include image: ${file.name}`, err);
            children.push(new Paragraph({ text: `Failed to include image: ${file.name}`, bullet: { level: 0 } }));
          }
        }


        // Delay doc creation until here
        if (!window.__docForImages) {
          window.__docForImages = new Document();
        }
        const tempDoc = window.__docForImages;

        const image = Media.addImage(tempDoc, buffer, 400, 300);
        content.push(new Paragraph(image));

        if (caption) {
          content.push(new Paragraph({ text: caption }));
        }
      } catch (err) {
        console.error("Error processing image:", file.name, err);
        content.push(new Paragraph({ text: `Failed to include image: ${file.name}` }));
      }
    }
  }

  // Now create the actual doc using the final children array
  const doc = new Document({
    sections: [{ children: content }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Site_Survey_Report.docx");
};

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Site Survey Editor</h1>
      {pages[page]}
      <div className="flex justify-between mt-6">
        <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="bg-gray-400 text-white px-4 py-2 rounded disabled:opacity-50">Previous</button>
        {page === pages.length - 1 ? (
          <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded">Download Word</button>
        ) : (
          <button onClick={() => setPage((p) => p + 1)} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
        )}
      </div>
    </div>
  );
}