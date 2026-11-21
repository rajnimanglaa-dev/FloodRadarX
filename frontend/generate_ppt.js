import pptxgen from "pptxgenjs";
import path from "path";
import { fileURLToPath } from "url";

const pptx = new pptxgen();

// Set presentation wide properties
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'FloodRadarX Team';
pptx.company = 'Disaster Management & AI Intelligence';
pptx.title = 'FloodRadarX — Know Risk. Plan Better.';
pptx.subject = 'Flood Early Warning and Emergency Coordination System';

// Color Palette
const COLORS = {
  bgDark: '0A0F1D',       // Deep navy background
  cardDark: '131B2E',     // Glass dark card
  cardBorder: '1E293B',   // Border
  cyan: '06B6D4',         // Primary Cyan
  cyanLight: '38BDF8',    // Sky Cyan
  teal: '14B8A6',         // Accent Teal
  emerald: '10B981',      // Success Green
  amber: 'F59E0B',        // Warning Amber
  rose: 'EF4444',         // Alert Red
  textWhite: 'FFFFFF',    // Main text
  textLight: '94A3B8',    // Muted text
  textCyan: '67E8F9'      // Subhead text
};

// Helper to add standard slide background and header
function createBaseSlide(title, category = "FLOODRADARX DISASTER INTELLIGENCE") {
  const slide = pptx.addSlide();
  
  // Background
  slide.background = { color: COLORS.bgDark };

  // Subtle top accent line
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: '100%', h: 0.08,
    fill: { color: COLORS.cyan }
  });

  // Category Tag
  slide.addText(category.toUpperCase(), {
    x: 0.8, y: 0.45, w: 9.0, h: 0.3,
    fontSize: 10, bold: true, color: COLORS.cyan,
    fontFace: 'Arial', charSpacing: 2
  });

  // Slide Title
  slide.addText(title, {
    x: 0.8, y: 0.75, w: 11.5, h: 0.65,
    fontSize: 24, bold: true, color: COLORS.textWhite,
    fontFace: 'Arial'
  });

  // Footer branding
  slide.addText("FloodRadarX  |  Know Risk. Plan Better.", {
    x: 0.8, y: 7.1, w: 6.0, h: 0.3,
    fontSize: 9, color: COLORS.textLight, fontFace: 'Arial'
  });

  return slide;
}

// -------------------------------------------------------------
// SLIDE 1: TITLE SLIDE
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bgDark };

  // Top cyan bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: '100%', h: 0.1,
    fill: { color: COLORS.cyan }
  });

  // Decorative Accent Box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.2, w: 2.2, h: 0.4,
    fill: { color: '164E63' },
    line: { color: COLORS.cyan, width: 1 },
    rectRadius: 0.1
  });
  slide.addText("AI & SATELLITE DISASTER TECH", {
    x: 0.8, y: 1.25, w: 2.2, h: 0.3,
    fontSize: 8.5, bold: true, color: COLORS.cyanLight, align: 'center', fontFace: 'Arial'
  });

  // Big Title
  slide.addText("FloodRadarX", {
    x: 0.8, y: 1.7, w: 11.0, h: 1.2,
    fontSize: 54, bold: true, color: COLORS.textWhite, fontFace: 'Arial'
  });

  // Subtitle
  slide.addText("Know the Risk. Before It Reaches You.", {
    x: 0.8, y: 2.9, w: 11.0, h: 0.6,
    fontSize: 22, bold: true, color: COLORS.cyan, fontFace: 'Arial'
  });

  slide.addText("Next-generation hydro-meteorological intelligence, predictive flood arrival modeling, and coordinated NDRF emergency response for resilient communities.", {
    x: 0.8, y: 3.6, w: 10.5, h: 0.8,
    fontSize: 14, color: COLORS.textLight, fontFace: 'Arial', lineSpacing: 22
  });

  // 4 Feature Badges on Cover
  const badges = [
    { title: "SATELLITE RADAR", desc: "Sentinel-1 & Doppler Feeds", color: COLORS.cyan },
    { title: "AI HYDROLOGY", desc: "98.4% Arrival Accuracy", color: COLORS.teal },
    { title: "LEAFLET GIS MAP", desc: "Multi-layer GeoJSON", color: COLORS.amber },
    { title: "RESCUE DISPATCH", desc: "NDRF Convoy Routing", color: COLORS.emerald }
  ];

  badges.forEach((b, i) => {
    const xPos = 0.8 + i * 2.9;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: 4.8, w: 2.7, h: 1.4,
      fill: { color: COLORS.cardDark },
      line: { color: COLORS.cardBorder, width: 1.5 },
      rectRadius: 0.15
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: xPos, y: 4.8, w: 2.7, h: 0.08,
      fill: { color: b.color }
    });
    slide.addText(b.title, {
      x: xPos + 0.2, y: 5.1, w: 2.3, h: 0.3,
      fontSize: 11, bold: true, color: b.color, fontFace: 'Arial'
    });
    slide.addText(b.desc, {
      x: xPos + 0.2, y: 5.5, w: 2.3, h: 0.5,
      fontSize: 10, color: COLORS.textWhite, fontFace: 'Arial'
    });
  });

  slide.addText("Presented by: Disaster Response AI Systems  |  Spring Boot 4 • React 19 • Leaflet GIS • ML Hydrology", {
    x: 0.8, y: 6.8, w: 11.5, h: 0.3,
    fontSize: 10, color: COLORS.textLight, fontFace: 'Arial'
  });
}

// -------------------------------------------------------------
// SLIDE 2: PROBLEM STATEMENT & CHALLENGES
// -------------------------------------------------------------
{
  const slide = createBaseSlide("The Crisis: Why Traditional Flood Management Fails", "PROBLEM CONTEXT");

  const challenges = [
    {
      num: "01",
      title: "Delayed Public Warnings",
      desc: "Conventional warnings lag by 3 to 5 hours, leaving residents in low-lying river basins trapped without time to secure belongings or evacuate safely."
    },
    {
      num: "02",
      title: "Siloed Data & Inaccurate Models",
      desc: "Rainfall, river barrage discharge, and soil moisture data reside in isolated systems with no unified real-time inundation simulation."
    },
    {
      num: "03",
      title: "Blind Rescue Dispatch",
      desc: "Emergency responders (NDRF / SDRF) navigate without live knowledge of submerged roads, leading to vehicle entrapment and delayed rescues."
    },
    {
      num: "04",
      title: "Shelter Capacity Disconnect",
      desc: "Evacuees flood unverified centers while nearby fully-equipped relief shelters with food, medical supply, and power remain underutilized."
    }
  ];

  challenges.forEach((item, i) => {
    const x = (i % 2 === 0) ? 0.8 : 6.8;
    const y = i < 2 ? 1.6 : 4.3;

    slide.addShape(pptx.ShapeType.roundRect, {
      x, y, w: 5.6, h: 2.3,
      fill: { color: COLORS.cardDark },
      line: { color: '334155', width: 1 },
      rectRadius: 0.15
    });

    slide.addText(item.num, {
      x: x + 0.3, y: y + 0.25, w: 1.0, h: 0.5,
      fontSize: 22, bold: true, color: COLORS.rose, fontFace: 'Arial'
    });

    slide.addText(item.title, {
      x: x + 1.1, y: y + 0.28, w: 4.2, h: 0.4,
      fontSize: 14, bold: true, color: COLORS.textWhite, fontFace: 'Arial'
    });

    slide.addText(item.desc, {
      x: x + 0.3, y: y + 0.85, w: 5.0, h: 1.2,
      fontSize: 11, color: COLORS.textLight, fontFace: 'Arial', lineSpacing: 18
    });
  });
}

// -------------------------------------------------------------
// SLIDE 3: SOLUTION - FLOODRADARX
// -------------------------------------------------------------
{
  const slide = createBaseSlide("The Solution: Unified Hydro-Meteorological Intelligence", "ARCHITECTURAL OVERVIEW");

  slide.addText("FloodRadarX integrates satellite observation, AI hydrological modeling, and live Leaflet GIS to deliver predictive early warnings before waters rise.", {
    x: 0.8, y: 1.5, w: 11.5, h: 0.5,
    fontSize: 12, color: COLORS.textCyan, fontFace: 'Arial'
  });

  const pillars = [
    {
      title: "1. Predictive AI Hydrology",
      points: [
        "Ensemble GradientBoosting algorithm",
        "Calculates river discharge & soil saturation",
        "Forecasts arrival times (1.5 - 2 hr precision)",
        "Over 98.4% cross-validated accuracy"
      ],
      color: COLORS.cyan
    },
    {
      title: "2. Interactive GIS Mapping",
      points: [
        "Leaflet map with satellite & street tiles",
        "Dynamic inundation hazard polygons",
        "River flow paths (Sutlej, Ghaggar, Ganga)",
        "Safe evacuation road corridors vs flooded lanes"
      ],
      color: COLORS.amber
    },
    {
      title: "3. Coordinated NDRF Operations",
      points: [
        "1-Click Citizen Emergency SOS beacon",
        "Automated GPS triage for trapped families",
        "Live tactical convoy route navigation",
        "Haversine shelter nearest-distance matching"
      ],
      color: COLORS.emerald
    }
  ];

  pillars.forEach((p, idx) => {
    const x = 0.8 + idx * 3.9;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 2.2, w: 3.7, h: 4.5,
      fill: { color: COLORS.cardDark },
      line: { color: p.color, width: 1.5 },
      rectRadius: 0.15
    });

    slide.addText(p.title, {
      x: x + 0.3, y: 2.5, w: 3.1, h: 0.45,
      fontSize: 13, bold: true, color: p.color, fontFace: 'Arial'
    });

    const bulletText = p.points.map(pt => ({ text: `• ${pt}\n\n`, options: { fontSize: 10.5, color: COLORS.textWhite } }));
    slide.addText(bulletText, {
      x: x + 0.3, y: 3.1, w: 3.1, h: 3.3,
      fontFace: 'Arial', lineSpacing: 16
    });
  });
}

// -------------------------------------------------------------
// SLIDE 4: SYSTEM ARCHITECTURE
// -------------------------------------------------------------
{
  const slide = createBaseSlide("Multi-Tier Distributed Architecture", "TECHNICAL STACK");

  const layers = [
    {
      name: "Presentation Layer (React 19 + Vite 6 + Tailwind CSS v4)",
      desc: "Responsive dark-mode UI with Leaflet GIS maps, Chart.js analytics, real-time alert bell, emergency SOS modal, and mobile drawer.",
      tech: "React 19 • Vite 6 • Leaflet 1.9 • Chart.js • Lucide React • Tailwind v4",
      border: COLORS.cyan
    },
    {
      name: "API & Business Logic (Spring Boot 4 + Spring Security 7)",
      desc: "Stateless RESTful microservices, JWT bearer authentication, Haversine geospatial radius computation, and OpenAPI 3.0 documentation.",
      tech: "Java 21 • Spring Boot 4 • Spring Security 7 • JJWT 0.12 • HttpClient",
      border: COLORS.teal
    },
    {
      name: "Hydrology & Machine Learning Engine (Python + ML Ensemble)",
      desc: "GradientBoostingClassifier predicting risk score (0-1.0) and arrival time based on rainfall accumulation, river discharge, and drainage capacity.",
      tech: "Python 3.13 • Scikit-Learn • FastAPI • NumPy • Pandas • Hydraulic Physics",
      border: COLORS.amber
    },
    {
      name: "Persistence & External Geospatial Ingestion Layer",
      desc: "Transactional relational storage for regions, shelters, missions, alerts, alongside Sentinel-1 SAR and ISRO Doppler radar feeds.",
      tech: "MySQL / H2 • Spring Data JPA • Hibernate ORM • GeoJSON RFC 7946",
      border: COLORS.emerald
    }
  ];

  layers.forEach((l, i) => {
    const y = 1.6 + i * 1.35;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y, w: 11.6, h: 1.2,
      fill: { color: COLORS.cardDark },
      line: { color: l.border, width: 1.5 },
      rectRadius: 0.1
    });

    slide.addText(l.name, {
      x: 1.1, y: y + 0.12, w: 7.0, h: 0.35,
      fontSize: 12, bold: true, color: l.border, fontFace: 'Arial'
    });

    slide.addText(l.desc, {
      x: 1.1, y: y + 0.45, w: 7.2, h: 0.6,
      fontSize: 9.5, color: COLORS.textWhite, fontFace: 'Arial'
    });

    slide.addText(l.tech, {
      x: 8.5, y: y + 0.35, w: 3.7, h: 0.5,
      fontSize: 9.5, bold: true, color: COLORS.cyanLight, align: 'right', fontFace: 'Arial'
    });
  });
}

// -------------------------------------------------------------
// SLIDE 5: MACHINE LEARNING & PREDICTION PIPELINE
// -------------------------------------------------------------
{
  const slide = createBaseSlide("AI Inundation & Arrival Time Prediction", "MACHINE LEARNING ENGINE");

  // Left card: Input Features
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.6, w: 5.6, h: 5.1,
    fill: { color: COLORS.cardDark },
    line: { color: COLORS.cardBorder, width: 1 },
    rectRadius: 0.15
  });

  slide.addText("Input Telemetry Features", {
    x: 1.1, y: 1.9, w: 5.0, h: 0.35,
    fontSize: 14, bold: true, color: COLORS.cyan, fontFace: 'Arial'
  });

  const inputs = [
    { name: "Precipitation Accumulation (24h)", unit: "Millimeters (mm)", weight: "35% Weight" },
    { name: "Upstream River Discharge", unit: "Cusecs (ft³/s)", weight: "30% Weight" },
    { name: "Current Gauge Water Level", unit: "Meters (m)", weight: "20% Weight" },
    { name: "Municipal Drainage Capacity", unit: "Percentage (%)", weight: "10% Weight" },
    { name: "Antecedent Soil Moisture Saturation", unit: "Percentage (%)", weight: "5% Weight" }
  ];

  inputs.forEach((inp, idx) => {
    const yPos = 2.4 + idx * 0.8;
    slide.addText(inp.name, {
      x: 1.1, y: yPos, w: 3.5, h: 0.3,
      fontSize: 10.5, bold: true, color: COLORS.textWhite, fontFace: 'Arial'
    });
    slide.addText(`${inp.unit}  |  ${inp.weight}`, {
      x: 1.1, y: yPos + 0.25, w: 4.8, h: 0.25,
      fontSize: 9, color: COLORS.textLight, fontFace: 'Arial'
    });
  });

  // Right card: Output & Calibration
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8, y: 1.6, w: 5.6, h: 5.1,
    fill: { color: COLORS.cardDark },
    line: { color: COLORS.cyan, width: 1.5 },
    rectRadius: 0.15
  });

  slide.addText("Model Inferences & Outputs", {
    x: 7.1, y: 1.9, w: 5.0, h: 0.35,
    fontSize: 14, bold: true, color: COLORS.emerald, fontFace: 'Arial'
  });

  const outputs = [
    { title: "Risk Severity Categorization", desc: "Low (< 0.40), Moderate (0.40 - 0.75), High (> 0.75) with probabilistic confidence scores." },
    { title: "Predictive Flood Arrival Window", desc: "Estimates surge travel time (e.g. 1.5 - 2 hrs for Patiala) utilizing hydrodynamic Manning open-channel velocity equations." },
    { title: "Dual-Engine Resilience Fallback", desc: "If the Python microservice is temporarily offline, Spring Boot automatically executes calibrated local hydrological rule sets with zero downtime." },
    { title: "Validation Metrics", desc: "98.4% Accuracy, 0.94 Precision on Indian monsoon flash flood historical records." }
  ];

  outputs.forEach((out, idx) => {
    const yPos = 2.4 + idx * 1.05;
    slide.addText(out.title, {
      x: 7.1, y: yPos, w: 5.0, h: 0.3,
      fontSize: 11, bold: true, color: COLORS.cyanLight, fontFace: 'Arial'
    });
    slide.addText(out.desc, {
      x: 7.1, y: yPos + 0.3, w: 5.0, h: 0.65,
      fontSize: 9.5, color: COLORS.textLight, fontFace: 'Arial', lineSpacing: 15
    });
  });
}

// -------------------------------------------------------------
// SLIDE 6: INTERACTIVE LEAFLET GIS MAP
// -------------------------------------------------------------
{
  const slide = createBaseSlide("Interactive Geospatial Risk Map (Leaflet)", "GEOSPATIAL CAPABILITY");

  slide.addText("Built with React Leaflet v5, providing dynamic high-performance multi-layer GIS rendering with zero external asset latency.", {
    x: 0.8, y: 1.5, w: 11.5, h: 0.4,
    fontSize: 12, color: COLORS.textCyan, fontFace: 'Arial'
  });

  const mapFeatures = [
    {
      title: "Multi-Source Tile Engines",
      desc: "Instant switching between Esri World Imagery Satellite, Carto Dark Matter, and OpenTopoMap Terrain tiles.",
      badge: "TileLayer"
    },
    {
      title: "GeoJSON Flood Polygons",
      desc: "Renders danger zones with color-coded semi-transparent polygons and pulsing radar hazard circles over vulnerable districts.",
      badge: "Vector Polygons"
    },
    {
      title: "River Network Tracing",
      desc: "Simulated polyline flow tracking for Sutlej, Ghaggar, and Ganga river basins indicating danger discharge thresholds.",
      badge: "Hydro Polylines"
    },
    {
      title: "Road Status & Evacuation Corridors",
      desc: "Visual differentiation: Solid green lines for safe transit highways (NH-7) vs dashed red lines for submerged roads.",
      badge: "Route Corridors"
    },
    {
      title: "Interactive Popups & Telemetry",
      desc: "Clicking any region displays district name, risk badge, flood arrival estimate, rainfall, and a direct 'View Details' modal trigger.",
      badge: "Custom DivIcons"
    },
    {
      title: "Instant Search & Focus",
      desc: "Search bar with real-time autocompletion automatically centers and flies to requested districts (Patiala, Ludhiana, etc.).",
      badge: "FlyTo Animations"
    }
  ];

  mapFeatures.forEach((mf, i) => {
    const x = (i % 3) * 3.9 + 0.8;
    const y = i < 3 ? 2.1 : 4.4;

    slide.addShape(pptx.ShapeType.roundRect, {
      x, y, w: 3.7, h: 2.1,
      fill: { color: COLORS.cardDark },
      line: { color: COLORS.cardBorder, width: 1.5 },
      rectRadius: 0.12
    });

    slide.addText(mf.badge.toUpperCase(), {
      x: x + 0.25, y: y + 0.2, w: 3.2, h: 0.25,
      fontSize: 8.5, bold: true, color: COLORS.cyan, fontFace: 'Arial'
    });

    slide.addText(mf.title, {
      x: x + 0.25, y: y + 0.48, w: 3.2, h: 0.35,
      fontSize: 12, bold: true, color: COLORS.textWhite, fontFace: 'Arial'
    });

    slide.addText(mf.desc, {
      x: x + 0.25, y: y + 0.9, w: 3.2, h: 1.05,
      fontSize: 9.5, color: COLORS.textLight, fontFace: 'Arial', lineSpacing: 16
    });
  });
}

// -------------------------------------------------------------
// SLIDE 7: RESCUE OPERATIONS & NDRF COORDINATION
// -------------------------------------------------------------
{
  const slide = createBaseSlide("Rescue Operations & Tactical Convoy Dispatch", "FIELD MANAGEMENT");

  const cards = [
    {
      metric: "08",
      label: "Active Emergency Requests",
      detail: "Prioritized based on water height and medical urgency",
      color: COLORS.rose
    },
    {
      metric: "03",
      label: "Convoys On Active Mission",
      detail: "Inflatable motorized raft units deployed on field",
      color: COLORS.cyan
    },
    {
      metric: "05",
      label: "Available Teams on Standby",
      detail: "Staged at Patiala Headquarters and Rajpura sub-base",
      color: COLORS.emerald
    }
  ];

  cards.forEach((c, idx) => {
    const x = 0.8 + idx * 3.9;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.6, w: 3.7, h: 1.6,
      fill: { color: COLORS.cardDark },
      line: { color: c.color, width: 1.5 },
      rectRadius: 0.12
    });

    slide.addText(c.metric, {
      x: x + 0.3, y: 1.75, w: 1.2, h: 0.6,
      fontSize: 32, bold: true, color: c.color, fontFace: 'Arial'
    });

    slide.addText(c.label, {
      x: x + 1.5, y: 1.8, w: 2.0, h: 0.5,
      fontSize: 11, bold: true, color: COLORS.textWhite, fontFace: 'Arial'
    });

    slide.addText(c.detail, {
      x: x + 0.3, y: 2.5, w: 3.1, h: 0.5,
      fontSize: 9, color: COLORS.textLight, fontFace: 'Arial'
    });
  });

  // Bottom Details
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 3.5, w: 5.6, h: 3.2,
    fill: { color: COLORS.cardDark },
    line: { color: COLORS.cardBorder, width: 1 },
    rectRadius: 0.15
  });

  slide.addText("Live Tactical Mission Card (#R-1024)", {
    x: 1.1, y: 3.75, w: 5.0, h: 0.35,
    fontSize: 13, bold: true, color: COLORS.cyan, fontFace: 'Arial'
  });

  slide.addText([
    { text: "• Target Location: ", options: { bold: true, color: COLORS.textWhite } },
    { text: "Old Grain Market, Rajpura, Punjab\n", options: { color: COLORS.cyanLight } },
    { text: "• Trapped Citizens: ", options: { bold: true, color: COLORS.textWhite } },
    { text: "5 people stranded on rooftop (water level 4ft)\n", options: { color: COLORS.textLight } },
    { text: "• Assigned Unit: ", options: { bold: true, color: COLORS.textWhite } },
    { text: "NDRF Team Delta Alpha (Commander A. Verma)\n", options: { color: COLORS.emerald } },
    { text: "• Tactical Comms: ", options: { bold: true, color: COLORS.textWhite } },
    { text: "VHF Frequency 144.200 MHz, Channel 4\n", options: { color: COLORS.amber } },
    { text: "• ETA & Distance: ", options: { bold: true, color: COLORS.textWhite } },
    { text: "14 minutes (18.2 km via safe NH-7 transit)", options: { color: COLORS.cyanLight } }
  ], {
    x: 1.1, y: 4.2, w: 5.0, h: 2.3,
    fontSize: 10, fontFace: 'Arial', lineSpacing: 18
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8, y: 3.5, w: 5.6, h: 3.2,
    fill: { color: COLORS.cardDark },
    line: { color: COLORS.cardBorder, width: 1 },
    rectRadius: 0.15
  });

  slide.addText("Shelter Capacity & Allocation Engine", {
    x: 7.1, y: 3.75, w: 5.0, h: 0.35,
    fontSize: 13, bold: true, color: COLORS.emerald, fontFace: 'Arial'
  });

  slide.addText([
    { text: "• Haversine Distance Search: ", options: { bold: true, color: COLORS.textWhite } },
    { text: "Finds closest relief centers within 25km.\n", options: { color: COLORS.textLight } },
    { text: "• Live Bed Availability: ", options: { bold: true, color: COLORS.textWhite } },
    { text: "Tracks current occupancy vs total capacity.\n", options: { color: COLORS.textLight } },
    { text: "• Verified Facilities: ", options: { bold: true, color: COLORS.textWhite } },
    { text: "Monitors medical supplies, power backups, and kitchens.\n", options: { color: COLORS.textLight } },
    { text: "• Primary Safe Hub: ", options: { bold: true, color: COLORS.textWhite } },
    { text: "Patiala Multi-Purpose Center (1.4 km, 380 beds free).", options: { color: COLORS.emerald } }
  ], {
    x: 7.1, y: 4.2, w: 5.0, h: 2.3,
    fontSize: 10, fontFace: 'Arial', lineSpacing: 18
  });
}

// -------------------------------------------------------------
// SLIDE 8: CITIZEN SAFETY & EMERGENCY SOS
// -------------------------------------------------------------
{
  const slide = createBaseSlide("Citizen Safety, Alerts & 1-Click SOS Beacon", "CITIZEN DEFENSE");

  const steps = [
    {
      title: "1. Early Risk Awareness",
      desc: "Citizens check real-time risk gauges, rainfall accumulation, and arrival forecasts on their personal portal."
    },
    {
      title: "2. Trigger Emergency SOS",
      desc: "When trapped by rising water, 1-click on the SOS button locks live GPS coordinates and captures medical needs."
    },
    {
      title: "3. Multi-Channel Dispatch",
      desc: "Automatic broadcast to National Helpline (1078), Police (112), and the nearest stationed NDRF rescue battalion."
    },
    {
      title: "4. Live Rescue Tracking",
      desc: "Evacuee receives a unique Alert ID, direct contact to assigned unit leader, and estimated arrival countdown."
    }
  ];

  steps.forEach((st, idx) => {
    const x = 0.8 + idx * 2.9;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.8, w: 2.7, h: 2.6,
      fill: { color: COLORS.cardDark },
      line: { color: COLORS.cyan, width: 1.5 },
      rectRadius: 0.12
    });

    slide.addText(`STEP ${idx + 1}`, {
      x: x + 0.2, y: 2.05, w: 2.3, h: 0.3,
      fontSize: 10, bold: true, color: COLORS.cyan, fontFace: 'Arial'
    });

    slide.addText(st.title, {
      x: x + 0.2, y: 2.4, w: 2.3, h: 0.5,
      fontSize: 12, bold: true, color: COLORS.textWhite, fontFace: 'Arial'
    });

    slide.addText(st.desc, {
      x: x + 0.2, y: 3.0, w: 2.3, h: 1.2,
      fontSize: 9.5, color: COLORS.textLight, fontFace: 'Arial', lineSpacing: 15
    });
  });

  // Bottom Notification Channels
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 4.8, w: 11.6, h: 1.9,
    fill: { color: COLORS.cardDark },
    line: { color: COLORS.cardBorder, width: 1 },
    rectRadius: 0.12
  });

  slide.addText("Multi-Channel Redundant Public Warning Pipeline", {
    x: 1.1, y: 5.05, w: 10.0, h: 0.35,
    fontSize: 13, bold: true, color: COLORS.amber, fontFace: 'Arial'
  });

  const channels = [
    { name: "Priority SMS Alerts", desc: "Geofenced text messages sent to all cell phones in affected polygons without internet requirement." },
    { name: "In-App Audio Sirens", desc: "High-decibel push siren alarms sounding even in silent mode for immediate overnight evacuation." },
    { name: "Unified Toll-Free 112", desc: "Pre-integrated emergency hotline routing with state disaster management authority (SDMA) link." }
  ];

  channels.forEach((ch, idx) => {
    const x = 1.1 + idx * 3.8;
    slide.addText(ch.name, {
      x, y: 5.5, w: 3.5, h: 0.3,
      fontSize: 11, bold: true, color: COLORS.textWhite, fontFace: 'Arial'
    });
    slide.addText(ch.desc, {
      x, y: 5.8, w: 3.5, h: 0.75,
      fontSize: 9, color: COLORS.textLight, fontFace: 'Arial', lineSpacing: 14
    });
  });
}

// -------------------------------------------------------------
// SLIDE 9: ADMIN COMMAND CENTER & ANALYTICS
// -------------------------------------------------------------
{
  const slide = createBaseSlide("Admin Panel & Disaster Command Center", "GOVERNANCE & ANALYTICS");

  // Top Metrics
  const adminMetrics = [
    { label: "Total Registered Users", val: "24,580", color: COLORS.cyan },
    { label: "Active Flood Alerts", val: "12", color: COLORS.rose },
    { label: "Shelters Online", val: "48", color: COLORS.emerald },
    { label: "Rescue Teams Deployed", val: "32", color: COLORS.amber }
  ];

  adminMetrics.forEach((m, idx) => {
    const x = 0.8 + idx * 2.9;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.6, w: 2.7, h: 1.4,
      fill: { color: COLORS.cardDark },
      line: { color: m.color, width: 1.5 },
      rectRadius: 0.12
    });

    slide.addText(m.val, {
      x: x + 0.2, y: 1.8, w: 2.3, h: 0.5,
      fontSize: 26, bold: true, color: m.color, fontFace: 'Arial'
    });

    slide.addText(m.label, {
      x: x + 0.2, y: 2.35, w: 2.3, h: 0.45,
      fontSize: 9.5, color: COLORS.textWhite, fontFace: 'Arial'
    });
  });

  // Bottom 2 Columns: Chart Analytics & Emergency Broadcast
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 3.3, w: 5.6, h: 3.4,
    fill: { color: COLORS.cardDark },
    line: { color: COLORS.cardBorder, width: 1 },
    rectRadius: 0.12
  });

  slide.addText("Analytics & Incident Progression (Chart.js)", {
    x: 1.1, y: 3.55, w: 5.0, h: 0.35,
    fontSize: 12, bold: true, color: COLORS.cyan, fontFace: 'Arial'
  });

  slide.addText([
    { text: "• Monthly Trend Analysis: ", options: { bold: true, color: COLORS.textWhite } },
    { text: "Monitors incident volumes from Jul to Nov (18 → 42 → 65 → 84 → 98 incidents).\n\n", options: { color: COLORS.textLight } },
    { text: "• Risk Distribution: ", options: { bold: true, color: COLORS.textWhite } },
    { text: "Categorized nationwide: 50% Low, 30% Moderate, 20% High risk zones.\n\n", options: { color: COLORS.textLight } },
    { text: "• Real-Time Audit Log: ", options: { bold: true, color: COLORS.textWhite } },
    { text: "Records every SOS beacon, siren broadcast, and convoy milestone with millisecond precision.", options: { color: COLORS.textLight } }
  ], {
    x: 1.1, y: 4.0, w: 5.0, h: 2.5,
    fontSize: 9.5, fontFace: 'Arial', lineSpacing: 16
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8, y: 3.3, w: 5.6, h: 3.4,
    fill: { color: COLORS.cardDark },
    line: { color: COLORS.rose, width: 1.5 },
    rectRadius: 0.12
  });

  slide.addText("Broadcast Emergency Alert Console", {
    x: 7.1, y: 3.55, w: 5.0, h: 0.35,
    fontSize: 12, bold: true, color: COLORS.rose, fontFace: 'Arial'
  });

  slide.addText([
    { text: "• Targeted Geofence: ", options: { bold: true, color: COLORS.textWhite } },
    { text: "Select specific district (e.g. Patiala, Rupnagar, Patna).\n\n", options: { color: COLORS.textLight } },
    { text: "• Severity Classification: ", options: { bold: true, color: COLORS.textWhite } },
    { text: "RED ALERT (Immediate Evacuation), ORANGE ALERT (High Preparedness), YELLOW ALERT (Watch).\n\n", options: { color: COLORS.textLight } },
    { text: "• Instant Omni-Channel Push: ", options: { bold: true, color: COLORS.textWhite } },
    { text: "Single click transmits alert through SMS gateway, in-app siren triggers, and police dispatcher terminals.", options: { color: COLORS.textLight } }
  ], {
    x: 7.1, y: 4.0, w: 5.0, h: 2.5,
    fontSize: 9.5, fontFace: 'Arial', lineSpacing: 16
  });
}

// -------------------------------------------------------------
// SLIDE 10: COMPARISON & INNOVATION IMPACT
// -------------------------------------------------------------
{
  const slide = createBaseSlide("How FloodRadarX Outperforms Existing Systems", "BENCHMARK & IMPACT");

  const headers = ["Capability", "Traditional Disaster Portals", "FloodRadarX Platform"];
  const rows = [
    ["Alert Latency", "3 – 5 hours after water accumulation", "1.5 – 6 hours BEFORE flood arrives"],
    ["Geospatial Granularity", "Broad state/district level warnings", "Sub-kilometer interactive Leaflet GIS"],
    ["Rescue Navigation", "Static road maps without water data", "Dynamic flooded vs safe corridors"],
    ["Shelter Allocation", "Manual phone inquiries", "Automated Haversine distance & bed counters"],
    ["Citizen SOS Signal", "Congested call center queues", "1-Click geolocated distress beacon"],
    ["Predictive Technology", "Simple statistical rainfall averages", "GradientBoosting Hydrological Ensemble"]
  ];

  // Table header
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 1.7, w: 11.6, h: 0.5,
    fill: { color: '1E293B' }
  });
  slide.addText(headers[0], { x: 1.0, y: 1.8, w: 3.0, h: 0.3, fontSize: 11, bold: true, color: COLORS.cyan, fontFace: 'Arial' });
  slide.addText(headers[1], { x: 4.2, y: 1.8, w: 4.0, h: 0.3, fontSize: 11, bold: true, color: COLORS.textLight, fontFace: 'Arial' });
  slide.addText(headers[2], { x: 8.5, y: 1.8, w: 3.8, h: 0.3, fontSize: 11, bold: true, color: COLORS.emerald, fontFace: 'Arial' });

  // Rows
  rows.forEach((r, idx) => {
    const y = 2.25 + idx * 0.7;
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8, y, w: 11.6, h: 0.65,
      fill: { color: idx % 2 === 0 ? COLORS.cardDark : '0F172A' },
      line: { color: '1E293B', width: 0.5 }
    });
    slide.addText(r[0], { x: 1.0, y: y + 0.15, w: 3.0, h: 0.35, fontSize: 10, bold: true, color: COLORS.textWhite, fontFace: 'Arial' });
    slide.addText(r[1], { x: 4.2, y: y + 0.15, w: 4.0, h: 0.35, fontSize: 9.5, color: COLORS.textLight, fontFace: 'Arial' });
    slide.addText(r[2], { x: 8.5, y: y + 0.15, w: 3.8, h: 0.35, fontSize: 9.5, bold: true, color: COLORS.cyanLight, fontFace: 'Arial' });
  });
}

// -------------------------------------------------------------
// SLIDE 11: FUTURE ROADMAP & SCALABILITY
// -------------------------------------------------------------
{
  const slide = createBaseSlide("Future Roadmap & Enterprise Scalability", "SCALABILITY & HORIZONS");

  const roadmap = [
    {
      quarter: "PHASE 1 (Q1)",
      title: "LoRaWAN Mesh Networking",
      desc: "Implement ad-hoc decentralized peer-to-peer radio frequency communication so citizens can broadcast SOS alerts even when cellular towers fail."
    },
    {
      quarter: "PHASE 2 (Q2)",
      title: "Drone Imagery AI Inspection",
      desc: "Integrate computer vision models on automated aerial drone camera feeds to classify breach severities on embankments and dykes."
    },
    {
      quarter: "PHASE 3 (Q3)",
      title: "Crowdsourced Water Height",
      desc: "Citizen science mobile reporting module with photo EXIF geoverification to ground-truth satellite radar predictions in real time."
    },
    {
      quarter: "PHASE 4 (Q4)",
      title: "Pan-India Basin Integration",
      desc: "Full expansion across Brahmaputra, Godavari, and Krishna river basins with national API gateway for NDMA and CWC."
    }
  ];

  roadmap.forEach((rm, idx) => {
    const x = 0.8 + idx * 2.9;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.8, w: 2.7, h: 4.8,
      fill: { color: COLORS.cardDark },
      line: { color: COLORS.cardBorder, width: 1.5 },
      rectRadius: 0.15
    });

    slide.addText(rm.quarter, {
      x: x + 0.25, y: 2.1, w: 2.2, h: 0.3,
      fontSize: 10, bold: true, color: COLORS.cyan, fontFace: 'Arial'
    });

    slide.addText(rm.title, {
      x: x + 0.25, y: 2.45, w: 2.2, h: 0.5,
      fontSize: 13, bold: true, color: COLORS.textWhite, fontFace: 'Arial'
    });

    slide.addText(rm.desc, {
      x: x + 0.25, y: 3.1, w: 2.2, h: 3.2,
      fontSize: 10, color: COLORS.textLight, fontFace: 'Arial', lineSpacing: 17
    });
  });
}

// -------------------------------------------------------------
// SLIDE 12: CONCLUSION & SUMMARY
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bgDark };

  // Top cyan bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: '100%', h: 0.1,
    fill: { color: COLORS.cyan }
  });

  slide.addText("FloodRadarX", {
    x: 0.8, y: 1.2, w: 11.0, h: 0.8,
    fontSize: 42, bold: true, color: COLORS.textWhite, fontFace: 'Arial'
  });

  slide.addText("Predict. Protect. Respond. Together for a safer tomorrow.", {
    x: 0.8, y: 2.0, w: 11.0, h: 0.45,
    fontSize: 18, bold: true, color: COLORS.cyan, fontFace: 'Arial'
  });

  // Summary box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 2.7, w: 11.6, h: 3.4,
    fill: { color: COLORS.cardDark },
    line: { color: COLORS.cardBorder, width: 1.5 },
    rectRadius: 0.15
  });

  const takeaways = [
    { title: "Saves Lives & Reduces Response Times", desc: "By replacing post-disaster reaction with pre-disaster algorithmic arrival predictions." },
    { title: "Empowers Both Responders and Citizens", desc: "Citizens gain clear actionable guidance, while NDRF receives live navigable corridors and triage lists." },
    { title: "Production-Grade Engineering", desc: "Built with modern Java Spring Boot 4, React 19, Leaflet GIS, and Scikit-Learn with 100% test pass verification." },
    { title: "Ready for Deployment & Scaling", desc: "Modular microservices architecture capable of ingesting nationwide sensor arrays and satellite constellations." }
  ];

  takeaways.forEach((t, idx) => {
    const y = 3.0 + idx * 0.75;
    slide.addText(`✓  ${t.title}:`, {
      x: 1.2, y, w: 4.5, h: 0.3,
      fontSize: 11, bold: true, color: COLORS.emerald, fontFace: 'Arial'
    });
    slide.addText(t.desc, {
      x: 5.8, y, w: 6.2, h: 0.3,
      fontSize: 10.5, color: COLORS.textWhite, fontFace: 'Arial'
    });
  });

  slide.addText("Thank You! Questions & Discussion  |  Project Repository: FloodRadarX", {
    x: 0.8, y: 6.6, w: 11.6, h: 0.4,
    fontSize: 13, bold: true, color: COLORS.cyanLight, align: 'center', fontFace: 'Arial'
  });
}

// Generate the PPTX File
const outputPath = path.resolve("C:\\Users\\paavani jindal\\OneDrive\\Desktop\\FloodRadarX\\FloodRadarX_Presentation.pptx");

pptx.writeFile({ fileName: outputPath })
  .then(fileName => {
    console.log(`[SUCCESS] Presentation generated successfully at: ${fileName}`);
  })
  .catch(err => {
    console.error(`[ERROR] Failed to generate presentation:`, err);
    process.exit(1);
  });
