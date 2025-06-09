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
      title: "Lightning and Earthing",
      fields: [
        "Is there lightning protection in place on the mast?", "Comments", "Is there an earth mat in place for the mast?", 
        "Is existing antenna and RF cable earthing in place?","Is future expansion on existing masts planned?","Existing cable tray(s)",
        "Spare capacity?","Routing problems: Specify"
      ].map(label => ({ label, type: "text" }))
    },
    {
      title: "Cabeling and Shelter / Building Requirements",
      fields: [
        "Shelter, remote shelter or building: (Existing or new)", "Specify owner: ", "Specify: (Share site infrastructure and or equipment.)", 
        "Approx. floor / room space available for Base Station equipment? LxW","Approx. container / shelter room size? LxW","Raised Floor ?",
        "Height of raised floor?","Wall texture (Fibreglass, concrete, steel, etc.)","Comment: ","19” Cabinet required?",
        "Is a modem tray required for 19” rack ?","Need the equipment shelf / rack to be bolted to the floor?",
        "If so, what is the floor composition? (Fibreglass, concrete, steel, etc.) ",
        "Existing Concrete Plinth in place?"
      ].map(label => ({ label, type: "text" }))
    },
    {
      title: "Base station cable requirements",
      fields: [
        "Specify cable lengths (Antenna / bracket to “indoor unit): Sector 1","Specify cable lengths (Antenna / bracket to “indoor unit): Sector 2",
        "Specify cable lengths (Antenna / bracket to “indoor unit): Sector 3","Specify cable lengths (Antenna / bracket to “indoor unit): Sector 4",
      ].map(label => ({ label, type: "text" }))
    },
    {
      title: "Point to point cable requirements",
      fields: [
        "PtP cable requirements - Specify cable lengths (Antenna / bracket to “indoor unit): Link 1",
        "PtP cable requirements - Specify cable lengths (Antenna / bracket to “indoor unit): Link 2",
        "PtP cable requirements - Specify cable lengths (Antenna / bracket to “indoor unit): Link 3",
        "PtP cable requirements - Specify cable lengths (Antenna / bracket to “indoor unit): Link 4"
      ].map(label => ({ label, type: "text" }))
    },
    {
      title: "Approximate length of IF feeder cable route",
      fields: [
        "Approximate length of IF feeder cable route: Top to bottom of mast? (Vertical distance)",
        "Approximate length of IF feeder cable route: Bottom of mast to building / shelter entry? (Horizontal distance)",
        "Approximate length of IF feeder cable route: Building entry to 19” cabinet (Horizontal distance)",
        "Approximate length of IF feeder cable route: Top of mast to antenna’s ( Horizontal distance)",
        "Approx. total length of IF cable",
        "Number of floors cable must transverse vertically",
        "IF cable entry into the room from mast via (Floor, Cabinet, Wall)?"
      ].map(label => ({ label, type: "text" }))
    },
    {
      title: "Open existing ducting in room and confirm with site owner the use thereof",
      fields: [
        "existing ducting in room: Is there space for more cable?",
        "existing ducting in room: Will conduit be required from the point of indoor entry to the equipment rack?",
        "existing ducting in room: Specify the distance required to be build?",
        "existing ducting in room: Provide details and routing? "

      ].map(label => ({ label, type: "text" }))
    },
    {
      title: "Cable tray / conduit requirements on mast",
      fields: [
        "Is there existing cable conduit from mast to the building or shelter?",
        "Specify the cable tray distance required to be build?",
        "Provide details and routing? ",
        "Number of additional conduits required? "

      ].map(label => ({ label, type: "text" }))
    },
    {
      title: "Cable earthing requirements",
      fields: [
        "Specify earth cable lengths: Sector 1",
        "Specify earth cable lengths: Sector 2",
        "Specify earth cable lengths: Sector 3",
        "Specify earth cable lengths: Sector 4",
        "Specify earth connection type (M8 or 10 Bolt, Line Tap)"

      ].map(label => ({ label, type: "text" }))
    },
    {
      title: "Power and ground provision",
      fields: [
        "Is AC power required for equipment?",
        "Distance to equipment to be installed? (AC Distribution box)",
        "Building Power: Commercial ?",
        "Building Power: Generator ?",
        "Comments",
        "AC Power Phase(s)",
        "Volts",
        "Frequency (Hz)",
        "Max Power Capacity",
        "KVA",
        "Will rectifier power be available?",
        "Is AC power dedicated or not dedicated?",
        "If not what other devices are on the circuits?",
        "Available power feed for equipment? (48DC Volt, DB Box)",
        "“A” Feed: distance to equipment to be installed?",
        "Specify position available?"

      ].map(label => ({ label, type: "text" }))
    },
    {
      title: "Electrical Ground",
      fields: [
        "Main earth bar (Electrical ground) available?",
        "Distance to equipment to be installed?",
        "Is lightning ground protection available?",
        "Cable tray’s / trunking / ducting available",
        "Existing cable tray’s / trunking / ducting: Type",
        "Existing cable tray’s / trunking / ducting: Size",
        "Additional cable tray’s required?",
        "Comments",
        "Cable tray length to equipment to be installed?",
        "Cable wall entries (Yes / No)",
        "Specify type (steel plate, cement)",
        "Distance to equipment to be installed?",
        "Diameter of cable entries?",
        "Grommet sizes required for cable entries?",
        "Number of grommets required?",
        "Comments",
        "Any unusual hazards",
        "Civil requirements for container or remote shelter (Plinth civil’s, etc) (Yes/No)",
        "Specify: (Requirements, position, responsibility) ",
        "Envisaged number of standoff brackets required on Mast",
        "Specify antenna height installation on mast or pole?",
        "Specify diameter of mounting pole on installation height (mm)",
        "Comments",
      ].map(label => ({ label, type: "text" }))
    },
    {
      title: "General",
      fields: [
        "Is excavation required? ",
        "What does excavation cut through? (E.g. paved areas, parking lot, etc.)",
        "Is security, guarding and or personal safety necessary?",
        "Is there any indication of unstable ground (Swamp ground, permafrost, clay, soft sand, etc?)",
        "Is additional labour available to assist with rigging?"
      ].map(label => ({ label, type: "text" }))
    },
    
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
