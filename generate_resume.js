const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createZip(files) {
  // Simple ZIP file generator without external dependencies
  const entries = [];
  let offset = 0;
  const parts = [];

  for (const file of files) {
    const nameBuf = Buffer.from(file.name, 'utf8');
    const uncompressedData = Buffer.from(file.content, 'utf8');
    const compressedData = zlib.deflateRawSync(uncompressedData);
    
    // CRC32 calculation
    let crc = 0 ^ (-1);
    for (let i = 0; i < uncompressedData.length; i++) {
      crc = (crc >>> 8) ^ crc32Table[(crc ^ uncompressedData[i]) & 0xFF];
    }
    crc = (crc ^ (-1)) >>> 0;

    // Local file header (30 bytes + filename length)
    const localHeader = Buffer.alloc(30 + nameBuf.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // signature
    localHeader.writeUInt16LE(20, 4); // min version
    localHeader.writeUInt16LE(0, 6); // general flags
    localHeader.writeUInt16LE(8, 8); // compression method (deflate)
    localHeader.writeUInt16LE(0, 10); // mod time
    localHeader.writeUInt16LE(0, 12); // mod date
    localHeader.writeUInt32LE(crc, 14); // crc32
    localHeader.writeUInt32LE(compressedData.length, 18); // comp size
    localHeader.writeUInt32LE(uncompressedData.length, 22); // uncomp size
    localHeader.writeUInt16LE(nameBuf.length, 26); // file name len
    localHeader.writeUInt16LE(0, 28); // extra field len
    nameBuf.copy(localHeader, 30);

    parts.push(localHeader);
    parts.push(compressedData);

    entries.push({
      name: file.name,
      nameBuf,
      crc,
      compSize: compressedData.length,
      uncompSize: uncompressedData.length,
      offset
    });

    offset += localHeader.length + compressedData.length;
  }

  const cdOffset = offset;
  let cdSize = 0;

  // Central Directory headers
  for (const entry of entries) {
    const cdHeader = Buffer.alloc(46 + entry.nameBuf.length);
    cdHeader.writeUInt32LE(0x02014b50, 0); // central dir signature
    cdHeader.writeUInt16LE(20, 4); // version made by
    cdHeader.writeUInt16LE(20, 6); // min version
    cdHeader.writeUInt16LE(0, 8); // general flags
    cdHeader.writeUInt16LE(8, 10); // compression method (deflate)
    cdHeader.writeUInt16LE(0, 12); // mod time
    cdHeader.writeUInt16LE(0, 14); // mod date
    cdHeader.writeUInt32LE(entry.crc, 16);
    cdHeader.writeUInt32LE(entry.compSize, 20);
    cdHeader.writeUInt32LE(entry.uncompSize, 24);
    cdHeader.writeUInt16LE(entry.nameBuf.length, 28);
    cdHeader.writeUInt16LE(0, 30); // extra len
    cdHeader.writeUInt16LE(0, 32); // comment len
    cdHeader.writeUInt16LE(0, 34); // disk num start
    cdHeader.writeUInt16LE(0, 36); // internal attrs
    cdHeader.writeUInt32LE(0, 38); // external attrs
    cdHeader.writeUInt32LE(entry.offset, 42); // relative offset
    entry.nameBuf.copy(cdHeader, 46);

    parts.push(cdHeader);
    cdSize += cdHeader.length;
  }

  // End of Central Directory Record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // EOCD signature
  eocd.writeUInt16LE(0, 4); // disk number
  eocd.writeUInt16LE(0, 6); // disk where CD starts
  eocd.writeUInt16LE(entries.length, 8); // num entries on this disk
  eocd.writeUInt16LE(entries.length, 10); // total num entries
  eocd.writeUInt32LE(cdSize, 12); // CD size
  eocd.writeUInt32LE(cdOffset, 16); // CD offset
  eocd.writeUInt16LE(0, 20); // comment len
  parts.push(eocd);

  return Buffer.concat(parts);
}

// CRC-32 table
const crc32Table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  }
  crc32Table[i] = c;
}

const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="48"/><w:color w:val="1E293B"/></w:rPr><w:t>ANJANA R.</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:i/><w:sz w:val="24"/><w:color w:val="0284C7"/></w:rPr><w:t>B.Tech — Artificial Intelligence &amp; Machine Learning</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:sz w:val="20"/><w:color w:val="475569"/></w:rPr><w:t>Bangalore, Karnataka | Phone: +91 9148037010 | Email: anjuarchu30@gmail.com</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:sz w:val="20"/><w:color w:val="475569"/></w:rPr><w:t>GitHub: github.com/anjanaa-sys | LinkedIn: linkedin.com/in/anjana-r-811936358</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>

    <w:p>
      <w:pPr><w:pBdr><w:bottom w:val="single" w:sz="12" w:space="4" w:color="0284C7"/></w:pBdr></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="0284C7"/></w:rPr><w:t>PROFILE SUMMARY</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>Motivated and detail-oriented second-year B.Tech student in Artificial Intelligence and Machine Learning at MVJ College of Engineering with an exceptional 9.10 CGPA. Strong academic foundation in programming, data structures, operating systems, and object-oriented design. Enthusiastic learner seeking opportunities to gain practical exposure, contribute to real-world technical projects, and develop industry-grade software solutions.</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>

    <w:p>
      <w:pPr><w:pBdr><w:bottom w:val="single" w:sz="12" w:space="4" w:color="0284C7"/></w:pBdr></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="0284C7"/></w:rPr><w:t>EDUCATION</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>B.Tech in Artificial Intelligence and Machine Learning (2024 — 2028)</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>MVJ College of Engineering, ITPL Main Road, Channasandra, Whitefield, Bangalore</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="22"/><w:color w:val="16A34A"/></w:rPr><w:t>Current CGPA: 9.10 (2nd Year)</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>

    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>Pre-University Course / Class XII (2022 — 2024)</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>St. Anne's Pre University College | Aggregate: 85%</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>

    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>Secondary School / Class X (2020 — 2022)</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>St. Joseph Convent High School | Aggregate: 95.05%</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>

    <w:p>
      <w:pPr><w:pBdr><w:bottom w:val="single" w:sz="12" w:space="4" w:color="0284C7"/></w:pBdr></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="0284C7"/></w:rPr><w:t>TECHNICAL SKILLS</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="22"/></w:rPr><w:t>Programming Languages: </w:t></w:r>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>Python, C, C++</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="22"/></w:rPr><w:t>Core Computer Science: </w:t></w:r>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>Data Structures and Applications, Operating Systems, Object-Oriented Programming (OOPS)</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="22"/></w:rPr><w:t>Databases &amp; Tools: </w:t></w:r>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>MySQL, Visual Studio Code, MS Office, Git &amp; GitHub</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="22"/></w:rPr><w:t>Soft Skills: </w:t></w:r>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>Teamwork, Problem Solving, Communication, Time Management, Event Coordination</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>

    <w:p>
      <w:pPr><w:pBdr><w:bottom w:val="single" w:sz="12" w:space="4" w:color="0284C7"/></w:pBdr></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="0284C7"/></w:rPr><w:t>KEY PROJECTS &amp; TECHNICAL ACTIVITIES</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>1. Skyline — Weather Application</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>A full-featured responsive meteorological application with live weather tracking, atmospheric physics visualizations, 24-hour hourly trajectory, solar arcs, and air quality telemetry.</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>

    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>2. Mark Sorter Pro — Interactive Algorithm Workbench</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>An interactive data structures and algorithms educational suite built to visualize sorting of academic marks. Features 5 sorting algorithms (Selection, Bubble, Insertion, Quick, Merge), dual visualizer modes (height pillars and student cards), real-time Web Audio API sound generator, and line-by-line code walk.</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>

    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>3. Mini Hackathon Participation (AI Buildathon)</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>Participated in a collaborative technical hackathon focusing on rapid prototyping, AI-assisted development, and team-driven project engineering.</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>

    <w:p>
      <w:pPr><w:pBdr><w:bottom w:val="single" w:sz="12" w:space="4" w:color="0284C7"/></w:pBdr></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="0284C7"/></w:rPr><w:t>ACTIVITIES &amp; RESPONSIBILITIES</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>• Event Coordinator — Swayam</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>• Active Member — Cultural Club</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>• Active participant in college technical symposiums, sports, and cultural events</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>

    <w:p>
      <w:pPr><w:pBdr><w:bottom w:val="single" w:sz="12" w:space="4" w:color="0284C7"/></w:pBdr></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="0284C7"/></w:rPr><w:t>PERSONAL DETAILS</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>Languages: English, Malayalam, Kannada, Tamil | Date of Birth: 30-11-2005</w:t></w:r>
    </w:p>
  </w:body>
</w:document>`;

const files = [
  { name: '[Content_Types].xml', content: contentTypesXml },
  { name: '_rels/.rels', content: relsXml },
  { name: 'word/document.xml', content: documentXml }
];

const zipBuf = createZip(files);
const targetPath = path.join(__dirname, 'Anjana_R_Resume.docx');
fs.writeFileSync(targetPath, zipBuf);
console.log('Successfully generated', targetPath, 'Size:', zipBuf.length, 'bytes');
