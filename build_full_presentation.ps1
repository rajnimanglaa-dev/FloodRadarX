try {
    Write-Host "Initializing Microsoft PowerPoint COM Engine..."
    $ppt = New-Object -ComObject PowerPoint.Application
    
    # Create new presentation
    $pres = $ppt.Presentations.Add([Microsoft.Office.Core.MsoTriState]::msoFalse)
    
    # 16:9 Widescreen: 960 x 540 points (or 13.33 x 7.5 inches = 960 x 540 pt)
    $pres.PageSetup.SlideWidth = 960
    $pres.PageSetup.SlideHeight = 540

    # Colors (BGR hex or RGB integer in COM: R + G*256 + B*65536)
    # Background Dark: 10, 15, 29 -> 10 + 15*256 + 29*65536 = 1904906
    $cBg = 10 + (15 * 256) + (29 * 65536)
    # Card Dark: 19, 27, 46
    $cCard = 19 + (27 * 256) + (46 * 65536)
    # Cyan: 6, 182, 212
    $cCyan = 6 + (182 * 256) + (212 * 65536)
    # Cyan Light: 56, 189, 248
    $cCyanLight = 56 + (189 * 256) + (248 * 65536)
    # Emerald: 16, 185, 129
    $cEmerald = 16 + (185 * 256) + (129 * 65536)
    # Amber: 245, 158, 11
    $cAmber = 245 + (158 * 256) + (11 * 65536)
    # Red: 239, 68, 68
    $cRed = 239 + (68 * 256) + (68 * 65536)
    # White: 255, 255, 255
    $cWhite = 255 + (255 * 256) + (255 * 65536)
    # Muted Gray: 148, 163, 184
    $cMuted = 148 + (163 * 256) + (184 * 65536)

    function Add-BaseSlide($slideNum, $category, $title) {
        $s = $pres.Slides.Add($slideNum, 12) # ppLayoutBlank = 12
        $s.Background.Fill.Solid()
        $s.Background.Fill.ForeColor.RGB = $cBg

        # Top cyan bar
        $topBar = $s.Shapes.AddShape(1, 0, 0, 960, 6) # msoShapeRectangle = 1
        $topBar.Fill.Solid()
        $topBar.Fill.ForeColor.RGB = $cCyan
        $topBar.Line.Visible = [Microsoft.Office.Core.MsoTriState]::msoFalse

        # Category Tag
        $catBox = $s.Shapes.AddTextbox(1, 50, 30, 800, 24)
        $catBox.TextFrame.TextRange.Text = $category.ToUpper()
        $catBox.TextFrame.TextRange.Font.Size = 10
        $catBox.TextFrame.TextRange.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
        $catBox.TextFrame.TextRange.Font.Color.RGB = $cCyan
        $catBox.TextFrame.TextRange.Font.Name = "Segoe UI"

        # Title
        $titleBox = $s.Shapes.AddTextbox(1, 50, 50, 860, 48)
        $titleBox.TextFrame.TextRange.Text = $title
        $titleBox.TextFrame.TextRange.Font.Size = 22
        $titleBox.TextFrame.TextRange.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
        $titleBox.TextFrame.TextRange.Font.Color.RGB = $cWhite
        $titleBox.TextFrame.TextRange.Font.Name = "Segoe UI"

        # Footer
        $footerBox = $s.Shapes.AddTextbox(1, 50, 505, 860, 24)
        $footerBox.TextFrame.TextRange.Text = "FloodRadarX  |  Know Risk. Plan Better.  |  Disaster Intelligence Platform"
        $footerBox.TextFrame.TextRange.Font.Size = 9
        $footerBox.TextFrame.TextRange.Font.Color.RGB = $cMuted
        $footerBox.TextFrame.TextRange.Font.Name = "Segoe UI"

        return $s
    }

    # ==========================================
    # SLIDE 1: COVER
    # ==========================================
    Write-Host "Creating Slide 1: Cover..."
    $s1 = $pres.Slides.Add(1, 12)
    $s1.Background.Fill.Solid()
    $s1.Background.Fill.ForeColor.RGB = $cBg

    $topBar1 = $s1.Shapes.AddShape(1, 0, 0, 960, 8)
    $topBar1.Fill.Solid()
    $topBar1.Fill.ForeColor.RGB = $cCyan
    $topBar1.Line.Visible = [Microsoft.Office.Core.MsoTriState]::msoFalse

    # Badge Box
    $b1 = $s1.Shapes.AddShape(5, 50, 60, 240, 30) # msoShapeRoundedRectangle = 5
    $b1.Fill.Solid()
    $b1.Fill.ForeColor.RGB = $cCard
    $b1.Line.ForeColor.RGB = $cCyan
    $b1.Line.Weight = 1.5
    $b1.TextFrame.TextRange.Text = "AI & SATELLITE DISASTER TECH"
    $b1.TextFrame.TextRange.Font.Size = 9
    $b1.TextFrame.TextRange.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $b1.TextFrame.TextRange.Font.Color.RGB = $cCyanLight
    $b1.TextFrame.TextRange.Font.Name = "Segoe UI"

    # Main Title
    $t1 = $s1.Shapes.AddTextbox(1, 50, 105, 860, 80)
    $t1.TextFrame.TextRange.Text = "FloodRadarX"
    $t1.TextFrame.TextRange.Font.Size = 48
    $t1.TextFrame.TextRange.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $t1.TextFrame.TextRange.Font.Color.RGB = $cWhite
    $t1.TextFrame.TextRange.Font.Name = "Segoe UI"

    # Subtitle
    $sub1 = $s1.Shapes.AddTextbox(1, 50, 185, 860, 40)
    $sub1.TextFrame.TextRange.Text = "Know the Risk. Before It Reaches You."
    $sub1.TextFrame.TextRange.Font.Size = 20
    $sub1.TextFrame.TextRange.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $sub1.TextFrame.TextRange.Font.Color.RGB = $cCyan
    $sub1.TextFrame.TextRange.Font.Name = "Segoe UI"

    # Description
    $d1 = $s1.Shapes.AddTextbox(1, 50, 230, 840, 60)
    $d1.TextFrame.TextRange.Text = "Next-generation hydro-meteorological intelligence, predictive flood arrival modeling, and coordinated NDRF emergency response for resilient communities."
    $d1.TextFrame.TextRange.Font.Size = 13
    $d1.TextFrame.TextRange.Font.Color.RGB = $cMuted
    $d1.TextFrame.TextRange.Font.Name = "Segoe UI"

    # 4 Pillar Boxes
    $pTitles = @("SATELLITE RADAR", "AI HYDROLOGY", "LEAFLET GIS MAP", "RESCUE DISPATCH")
    $pDescs = @("Sentinel-1 SAR & Doppler Feeds", "98.4% Arrival Prediction", "Multi-layer GeoJSON Hazard", "NDRF Live Convoy Routing")
    $pColors = @($cCyan, $cEmerald, $cAmber, $cRed)

    for ($i = 0; $i -lt 4; $i++) {
        $x = 50 + ($i * 215)
        $card = $s1.Shapes.AddShape(5, $x, 320, 205, 110)
        $card.Fill.Solid()
        $card.Fill.ForeColor.RGB = $cCard
        $card.Line.ForeColor.RGB = $pColors[$i]
        $card.Line.Weight = 1.5

        $tb = $s1.Shapes.AddTextbox(1, $x + 10, 330, 185, 90)
        $tb.TextFrame.TextRange.Text = "$($pTitles[$i])`n`n$($pDescs[$i])"
        $tb.TextFrame.TextRange.Paragraphs(1).Font.Size = 11
        $tb.TextFrame.TextRange.Paragraphs(1).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
        $tb.TextFrame.TextRange.Paragraphs(1).Font.Color.RGB = $pColors[$i]
        $tb.TextFrame.TextRange.Paragraphs(3).Font.Size = 9.5
        $tb.TextFrame.TextRange.Paragraphs(3).Font.Color.RGB = $cWhite
        $tb.TextFrame.TextRange.Font.Name = "Segoe UI"
    }

    $foot1 = $s1.Shapes.AddTextbox(1, 50, 480, 860, 30)
    $foot1.TextFrame.TextRange.Text = "Spring Boot 4  •  React 19  •  Leaflet GIS  •  Scikit-Learn Hydrology Ensemble  •  NDRF Ready"
    $foot1.TextFrame.TextRange.Font.Size = 10
    $foot1.TextFrame.TextRange.Font.Color.RGB = $cCyanLight
    $foot1.TextFrame.TextRange.Font.Name = "Segoe UI"

    # ==========================================
    # SLIDE 2: PROBLEM STATEMENT
    # ==========================================
    Write-Host "Creating Slide 2: Problem Statement..."
    $s2 = Add-BaseSlide 2 "PROBLEM CONTEXT" "The Crisis: Why Traditional Flood Management Fails"

    $probs = @(
        @{ num="01"; title="Delayed Public Warnings"; desc="Conventional warning systems lag by 3 to 5 hours, leaving residents in low-lying river basins trapped without time to evacuate safely." },
        @{ num="02"; title="Siloed Data & Fragmented Tools"; desc="Rainfall, barrage discharge, and soil moisture reside in isolated databases with zero unified real-time inundation simulation." },
        @{ num="03"; title="Blind Rescue Navigation"; desc="Emergency responders (NDRF / SDRF) navigate without live knowledge of submerged roads, leading to vehicle entrapment and delays." },
        @{ num="04"; title="Shelter Capacity Disconnect"; desc="Evacuees flood unverified centers while nearby fully-equipped relief shelters with food and medicine remain empty." }
    )

    for ($i = 0; $i -lt 4; $i++) {
        $x = if ($i % 2 -eq 0) { 50 } else { 490 }
        $y = if ($i -lt 2) { 120 } else { 310 }

        $box = $s2.Shapes.AddShape(5, $x, $y, 420, 165)
        $box.Fill.Solid()
        $box.Fill.ForeColor.RGB = $cCard
        $box.Line.ForeColor.RGB = 60 + (70 * 256) + (90 * 65536)
        $box.Line.Weight = 1

        $t = $s2.Shapes.AddTextbox(1, $x + 20, $y + 15, 380, 135)
        $t.TextFrame.TextRange.Text = "$($probs[$i].num)   $($probs[$i].title)`n`n$($probs[$i].desc)"
        $t.TextFrame.TextRange.Paragraphs(1).Font.Size = 13
        $t.TextFrame.TextRange.Paragraphs(1).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
        $t.TextFrame.TextRange.Paragraphs(1).Font.Color.RGB = $cRed
        $t.TextFrame.TextRange.Paragraphs(3).Font.Size = 10
        $t.TextFrame.TextRange.Paragraphs(3).Font.Color.RGB = $cMuted
        $t.TextFrame.TextRange.Font.Name = "Segoe UI"
    }

    # ==========================================
    # SLIDE 3: THE SOLUTION
    # ==========================================
    Write-Host "Creating Slide 3: The Solution..."
    $s3 = Add-BaseSlide 3 "ARCHITECTURAL INNOVATION" "The Solution: Unified Hydro-Meteorological Intelligence"

    $pillars = @(
        @{
            title="1. Predictive AI Hydrology"
            color=$cCyan
            pts="• Ensemble GradientBoosting algorithm`n• Analyzes rainfall, discharge & soil moisture`n• Forecasts arrival times (1.5 - 2h precision)`n• Over 98.4% cross-validated accuracy"
        },
        @{
            title="2. Interactive GIS Mapping"
            color=$cAmber
            pts="• Leaflet engine with satellite & street tiles`n• Dynamic inundation hazard polygons`n• Real-time river flow paths (Sutlej, Ghaggar)`n• Safe evacuation corridors vs flooded lanes"
        },
        @{
            title="3. Coordinated NDRF Response"
            color=$cEmerald
            pts="• 1-Click Citizen Emergency SOS beacon`n• Automated GPS triage for trapped families`n• Live tactical convoy route navigation`n• Haversine shelter nearest-distance matching"
        }
    )

    for ($i = 0; $i -lt 3; $i++) {
        $x = 50 + ($i * 290)
        $box = $s3.Shapes.AddShape(5, $x, 120, 275, 350)
        $box.Fill.Solid()
        $box.Fill.ForeColor.RGB = $cCard
        $box.Line.ForeColor.RGB = $pillars[$i].color
        $box.Line.Weight = 1.5

        $t = $s3.Shapes.AddTextbox(1, $x + 15, 135, 245, 320)
        $t.TextFrame.TextRange.Text = "$($pillars[$i].title)`n`n$($pillars[$i].pts)"
        $t.TextFrame.TextRange.Paragraphs(1).Font.Size = 13
        $t.TextFrame.TextRange.Paragraphs(1).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
        $t.TextFrame.TextRange.Paragraphs(1).Font.Color.RGB = $pillars[$i].color
        $t.TextFrame.TextRange.Paragraphs(3).Font.Size = 10.5
        $t.TextFrame.TextRange.Paragraphs(3).Font.Color.RGB = $cWhite
        $t.TextFrame.TextRange.Font.Name = "Segoe UI"
    }

    # ==========================================
    # SLIDE 4: SYSTEM ARCHITECTURE
    # ==========================================
    Write-Host "Creating Slide 4: System Architecture..."
    $s4 = Add-BaseSlide 4 "FULL-STACK ARCHITECTURE" "Multi-Tier Distributed Architecture"

    $layers = @(
        @{ name="Presentation Layer (React 19 + Vite 6 + Tailwind CSS v4)"; tech="React 19 • Leaflet 1.9 • Chart.js • Lucide Icons"; desc="Responsive dark-mode UI with Leaflet GIS maps, Chart.js analytics, emergency SOS modal, and citizen dashboard."; color=$cCyan },
        @{ name="API & Business Logic (Spring Boot 4 + Spring Security 7)"; tech="Java 21 • Spring Boot 4 • JJWT 0.12 • HttpClient"; desc="Stateless RESTful microservices, JWT bearer authentication, Haversine geospatial radius computation, and OpenAPI 3.0."; color=$cEmerald },
        @{ name="Hydrology & Machine Learning Engine (Python + ML Ensemble)"; tech="Python 3.13 • Scikit-Learn • FastAPI • NumPy"; desc="GradientBoostingClassifier predicting risk score (0-1.0) and arrival time based on rainfall accumulation and river discharge."; color=$cAmber },
        @{ name="Persistence & Geospatial Ingestion Layer"; tech="MySQL / H2 • Spring Data JPA • GeoJSON RFC 7946"; desc="Transactional relational storage for regions, shelters, missions, alerts, alongside Sentinel-1 SAR and ISRO Doppler radar feeds."; color=$cCyanLight }
    )

    for ($i = 0; $i -lt 4; $i++) {
        $y = 115 + ($i * 90)
        $box = $s4.Shapes.AddShape(5, 50, $y, 860, 78)
        $box.Fill.Solid()
        $box.Fill.ForeColor.RGB = $cCard
        $box.Line.ForeColor.RGB = $layers[$i].color
        $box.Line.Weight = 1.5

        $t = $s4.Shapes.AddTextbox(1, 65, $y + 8, 540, 60)
        $t.TextFrame.TextRange.Text = "$($layers[$i].name)`n$($layers[$i].desc)"
        $t.TextFrame.TextRange.Paragraphs(1).Font.Size = 11
        $t.TextFrame.TextRange.Paragraphs(1).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
        $t.TextFrame.TextRange.Paragraphs(1).Font.Color.RGB = $layers[$i].color
        $t.TextFrame.TextRange.Paragraphs(2).Font.Size = 9
        $t.TextFrame.TextRange.Paragraphs(2).Font.Color.RGB = $cWhite
        $t.TextFrame.TextRange.Font.Name = "Segoe UI"

        $r = $s4.Shapes.AddTextbox(1, 610, $y + 15, 285, 50)
        $r.TextFrame.TextRange.Text = $layers[$i].tech
        $r.TextFrame.TextRange.Font.Size = 9.5
        $r.TextFrame.TextRange.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
        $r.TextFrame.TextRange.Font.Color.RGB = $cCyanLight
        $r.TextFrame.TextRange.Font.Name = "Segoe UI"
    }

    # ==========================================
    # SLIDE 5: ML & PREDICTION
    # ==========================================
    Write-Host "Creating Slide 5: Machine Learning Engine..."
    $s5 = Add-BaseSlide 5 "MACHINE LEARNING ENGINE" "AI Inundation & Arrival Time Prediction Pipeline"

    # Left: Inputs
    $box5L = $s5.Shapes.AddShape(5, 50, 120, 420, 360)
    $box5L.Fill.Solid()
    $box5L.Fill.ForeColor.RGB = $cCard
    $box5L.Line.ForeColor.RGB = $cCyan
    $box5L.Line.Weight = 1.5

    $t5L = $s5.Shapes.AddTextbox(1, 70, 135, 380, 330)
    $t5L.TextFrame.TextRange.Text = "Telemetry Input Features`n`n• 24h Precipitation Accumulation (mm) — 35% Weight`n• Upstream River Discharge (Cusecs) — 30% Weight`n• Current River Gauge Water Level (m) — 20% Weight`n• Municipal Drainage Capacity (%) — 10% Weight`n• Antecedent Soil Moisture Saturation (%) — 5% Weight`n`nDynamic Calibration: Hydrodynamic Manning open-channel open flow formula combined with terrain digital elevation models."
    $t5L.TextFrame.TextRange.Paragraphs(1).Font.Size = 13
    $t5L.TextFrame.TextRange.Paragraphs(1).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $t5L.TextFrame.TextRange.Paragraphs(1).Font.Color.RGB = $cCyan
    $t5L.TextFrame.TextRange.Paragraphs(3).Font.Size = 10
    $t5L.TextFrame.TextRange.Paragraphs(3).Font.Color.RGB = $cWhite
    $t5L.TextFrame.TextRange.Font.Name = "Segoe UI"

    # Right: Outputs
    $box5R = $s5.Shapes.AddShape(5, 490, 120, 420, 360)
    $box5R.Fill.Solid()
    $box5R.Fill.ForeColor.RGB = $cCard
    $box5R.Line.ForeColor.RGB = $cEmerald
    $box5R.Line.Weight = 1.5

    $t5R = $s5.Shapes.AddTextbox(1, 510, 135, 380, 330)
    $t5R.TextFrame.TextRange.Text = "Model Inferences & Resilience`n`n• Risk Score (0.0 to 1.0) & Categorization:`n   - Low (< 0.40) | Moderate (0.40 - 0.75) | High (> 0.75)`n`n• Flood Front Arrival Window:`n   - Calculates surge travel time (e.g. 1.5 - 2 hrs for Patiala)`n`n• Dual-Engine Resilience Fallback:`n   - If Python ML service is offline, Spring Boot executes calibrated local rule-sets with 0ms delay.`n`n• Accuracy: 98.4% on historical monsoon flood datasets."
    $t5R.TextFrame.TextRange.Paragraphs(1).Font.Size = 13
    $t5R.TextFrame.TextRange.Paragraphs(1).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $t5R.TextFrame.TextRange.Paragraphs(1).Font.Color.RGB = $cEmerald
    $t5R.TextFrame.TextRange.Paragraphs(3).Font.Size = 10
    $t5R.TextFrame.TextRange.Paragraphs(3).Font.Color.RGB = $cWhite
    $t5R.TextFrame.TextRange.Font.Name = "Segoe UI"

    # ==========================================
    # SLIDE 6: LEAFLET GIS MAP
    # ==========================================
    Write-Host "Creating Slide 6: Leaflet GIS Map..."
    $s6 = Add-BaseSlide 6 "GEOSPATIAL CAPABILITY" "Interactive Geospatial Risk Map (Leaflet GIS)"

    $mapPoints = @(
        @{ title="Multi-Tile Imagery Switcher"; desc="Instant switching between Esri World Satellite, Carto Dark Matter, and OpenTopoMap Terrain tiles." },
        @{ title="GeoJSON Flood Polygons"; desc="Renders hazard zones with color-coded semi-transparent polygons and pulsing radar hazard circles." },
        @{ title="River Flow Network Tracing"; desc="Simulated polyline flow tracking for Sutlej, Ghaggar, and Ganga river basins at danger marks." },
        @{ title="Road Status & Evacuation Corridors"; desc="Solid green lines for safe transit highways (NH-7) vs dashed red lines for submerged routes." },
        @{ title="Interactive Telemetry Popups"; desc="Clicking any region displays district name, risk badge, arrival estimate, rainfall, and 'View Details'." },
        @{ title="Instant Search & FlyTo Navigation"; desc="Search bar with real-time autocompletion centers and flies to requested districts (Patiala, Ludhiana, etc.)." }
    )

    for ($i = 0; $i -lt 6; $i++) {
        $x = 50 + (($i % 3) * 290)
        $y = if ($i -lt 3) { 120 } else { 300 }

        $box = $s6.Shapes.AddShape(5, $x, $y, 275, 160)
        $box.Fill.Solid()
        $box.Fill.ForeColor.RGB = $cCard
        $box.Line.ForeColor.RGB = $cCyan
        $box.Line.Weight = 1

        $t = $s6.Shapes.AddTextbox(1, $x + 15, $y + 12, 245, 135)
        $t.TextFrame.TextRange.Text = "$($mapPoints[$i].title)`n`n$($mapPoints[$i].desc)"
        $t.TextFrame.TextRange.Paragraphs(1).Font.Size = 11
        $t.TextFrame.TextRange.Paragraphs(1).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
        $t.TextFrame.TextRange.Paragraphs(1).Font.Color.RGB = $cCyanLight
        $t.TextFrame.TextRange.Paragraphs(3).Font.Size = 9.5
        $t.TextFrame.TextRange.Paragraphs(3).Font.Color.RGB = $cMuted
        $t.TextFrame.TextRange.Font.Name = "Segoe UI"
    }

    # ==========================================
    # SLIDE 7: RESCUE OPERATIONS
    # ==========================================
    Write-Host "Creating Slide 7: Rescue Operations..."
    $s7 = Add-BaseSlide 7 "FIELD MANAGEMENT" "Rescue Operations & Tactical Convoy Dispatch"

    # 3 Status cards
    $resCards = @(
        @{ num="08"; label="Active Requests"; color=$cRed; sub="Prioritized by water depth & medical status" },
        @{ num="03"; label="On Active Mission"; color=$cCyan; sub="Inflatable motorized raft convoys deployed" },
        @{ num="05"; label="Available Teams"; color=$cEmerald; sub="Standby at Patiala & Rajpura depots" }
    )

    for ($i = 0; $i -lt 3; $i++) {
        $x = 50 + ($i * 290)
        $box = $s7.Shapes.AddShape(5, $x, 115, 275, 100)
        $box.Fill.Solid()
        $box.Fill.ForeColor.RGB = $cCard
        $box.Line.ForeColor.RGB = $resCards[$i].color
        $box.Line.Weight = 1.5

        $t = $s7.Shapes.AddTextbox(1, $x + 15, 125, 245, 80)
        $t.TextFrame.TextRange.Text = "$($resCards[$i].num)   $($resCards[$i].label)`n$($resCards[$i].sub)"
        $t.TextFrame.TextRange.Paragraphs(1).Font.Size = 18
        $t.TextFrame.TextRange.Paragraphs(1).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
        $t.TextFrame.TextRange.Paragraphs(1).Font.Color.RGB = $resCards[$i].color
        $t.TextFrame.TextRange.Paragraphs(2).Font.Size = 9
        $t.TextFrame.TextRange.Paragraphs(2).Font.Color.RGB = $cWhite
        $t.TextFrame.TextRange.Font.Name = "Segoe UI"
    }

    # Mission Card
    $box7L = $s7.Shapes.AddShape(5, 50, 230, 420, 250)
    $box7L.Fill.Solid()
    $box7L.Fill.ForeColor.RGB = $cCard
    $box7L.Line.ForeColor.RGB = $cCyan
    $box7L.Line.Weight = 1

    $t7L = $s7.Shapes.AddTextbox(1, 65, 240, 390, 230)
    $t7L.TextFrame.TextRange.Text = "Tactical Mission Card (#R-1024)`n`n• Target: Old Grain Market, Rajpura, Punjab`n• Trapped: 5 People (family stranded on rooftop)`n• Unit: NDRF Team Delta Alpha (Cmdr. A. Verma)`n• Tactical Comms: VHF 144.200 MHz, Channel 4`n• ETA & Distance: 14 mins (18.2 km via safe NH-7 transit)"
    $t7L.TextFrame.TextRange.Paragraphs(1).Font.Size = 12
    $t7L.TextFrame.TextRange.Paragraphs(1).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $t7L.TextFrame.TextRange.Paragraphs(1).Font.Color.RGB = $cCyan
    $t7L.TextFrame.TextRange.Paragraphs(3).Font.Size = 10
    $t7L.TextFrame.TextRange.Paragraphs(3).Font.Color.RGB = $cWhite
    $t7L.TextFrame.TextRange.Font.Name = "Segoe UI"

    # Shelter Allocation
    $box7R = $s7.Shapes.AddShape(5, 490, 230, 420, 250)
    $box7R.Fill.Solid()
    $box7R.Fill.ForeColor.RGB = $cCard
    $box7R.Line.ForeColor.RGB = $cEmerald
    $box7R.Line.Weight = 1

    $t7R = $s7.Shapes.AddTextbox(1, 505, 240, 390, 230)
    $t7R.TextFrame.TextRange.Text = "Shelter Allocation & Capacity Engine`n`n• Haversine Distance: Discovers shelters within 25km radius.`n• Live Bed Tracking: 48 shelters with capacity vs occupancy.`n• Verified Facilities: Medical ICU, kitchen, potable water.`n• Primary Safe Hub: Patiala Multi-Purpose Center`n   - Distance: 1.4 km | 380 Available Beds | Status: OPEN"
    $t7R.TextFrame.TextRange.Paragraphs(1).Font.Size = 12
    $t7R.TextFrame.TextRange.Paragraphs(1).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $t7R.TextFrame.TextRange.Paragraphs(1).Font.Color.RGB = $cEmerald
    $t7R.TextFrame.TextRange.Paragraphs(3).Font.Size = 10
    $t7R.TextFrame.TextRange.Paragraphs(3).Font.Color.RGB = $cWhite
    $t7R.TextFrame.TextRange.Font.Name = "Segoe UI"

    # ==========================================
    # SLIDE 8: CITIZEN DEFENSE & SOS
    # ==========================================
    Write-Host "Creating Slide 8: Citizen Defense & SOS..."
    $s8 = Add-BaseSlide 8 "CITIZEN DEFENSE" "Citizen Safety Portal & 1-Click Emergency SOS Beacon"

    $steps = @(
        @{ title="1. Risk Awareness"; desc="Citizens check personalized risk status, arrival countdown, and rainfall accumulation." },
        @{ title="2. Trigger SOS Beacon"; desc="One tap on '🚨 SOS Emergency' instantly locks live GPS coordinates and flags medical/infant needs." },
        @{ title="3. Automated Dispatch"; desc="Distress beacon transmitted to National Helpline (1078), Police (112), and stationed NDRF battalion." },
        @{ title="4. Rescue Tracking"; desc="Evacuee receives a unique Alert ID, direct contact to assigned unit commander, and arrival ETA." }
    )

    for ($i = 0; $i -lt 4; $i++) {
        $x = 50 + ($i * 215)
        $box = $s8.Shapes.AddShape(5, $x, 120, 205, 170)
        $box.Fill.Solid()
        $box.Fill.ForeColor.RGB = $cCard
        $box.Line.ForeColor.RGB = $cCyan
        $box.Line.Weight = 1.5

        $t = $s8.Shapes.AddTextbox(1, $x + 10, 130, 185, 150)
        $t.TextFrame.TextRange.Text = "$($steps[$i].title)`n`n$($steps[$i].desc)"
        $t.TextFrame.TextRange.Paragraphs(1).Font.Size = 11
        $t.TextFrame.TextRange.Paragraphs(1).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
        $t.TextFrame.TextRange.Paragraphs(1).Font.Color.RGB = $cCyan
        $t.TextFrame.TextRange.Paragraphs(3).Font.Size = 9.5
        $t.TextFrame.TextRange.Paragraphs(3).Font.Color.RGB = $cMuted
        $t.TextFrame.TextRange.Font.Name = "Segoe UI"
    }

    # Redundant Channels Box
    $box8B = $s8.Shapes.AddShape(5, 50, 310, 860, 165)
    $box8B.Fill.Solid()
    $box8B.Fill.ForeColor.RGB = $cCard
    $box8B.Line.ForeColor.RGB = $cAmber
    $box8B.Line.Weight = 1.5

    $t8B = $s8.Shapes.AddTextbox(1, 70, 325, 820, 135)
    $t8B.TextFrame.TextRange.Text = "Multi-Channel Redundant Public Early Warning Pipeline`n`n• Priority SMS Alerts: Geofenced text broadcast to cell phones in hazard polygons without mobile data.`n• In-App Audio Sirens: High-decibel push siren alarms sounding even in silent mode for immediate evacuation.`n• Unified Toll-Free 112: Pre-integrated emergency hotline routing connected to State Disaster Management."
    $t8B.TextFrame.TextRange.Paragraphs(1).Font.Size = 13
    $t8B.TextFrame.TextRange.Paragraphs(1).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $t8B.TextFrame.TextRange.Paragraphs(1).Font.Color.RGB = $cAmber
    $t8B.TextFrame.TextRange.Paragraphs(3).Font.Size = 10
    $t8B.TextFrame.TextRange.Paragraphs(3).Font.Color.RGB = $cWhite
    $t8B.TextFrame.TextRange.Font.Name = "Segoe UI"

    # ==========================================
    # SLIDE 9: ADMIN COMMAND CENTER
    # ==========================================
    Write-Host "Creating Slide 9: Admin Command Center..."
    $s9 = Add-BaseSlide 9 "GOVERNANCE & ANALYTICS" "Admin Panel & Multi-Agency Disaster Command Center"

    $adMetrics = @(
        @{ val="24,580"; label="Total Registered Users"; color=$cCyan },
        @{ val="12"; label="Active Flood Alerts"; color=$cRed },
        @{ val="48"; label="Shelters Synchronized"; color=$cEmerald },
        @{ val="32"; label="Rescue Teams Deployed"; color=$cAmber }
    )

    for ($i = 0; $i -lt 4; $i++) {
        $x = 50 + ($i * 215)
        $box = $s9.Shapes.AddShape(5, $x, 115, 205, 95)
        $box.Fill.Solid()
        $box.Fill.ForeColor.RGB = $cCard
        $box.Line.ForeColor.RGB = $adMetrics[$i].color
        $box.Line.Weight = 1.5

        $t = $s9.Shapes.AddTextbox(1, $x + 10, 125, 185, 75)
        $t.TextFrame.TextRange.Text = "$($adMetrics[$i].val)`n$($adMetrics[$i].label)"
        $t.TextFrame.TextRange.Paragraphs(1).Font.Size = 22
        $t.TextFrame.TextRange.Paragraphs(1).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
        $t.TextFrame.TextRange.Paragraphs(1).Font.Color.RGB = $adMetrics[$i].color
        $t.TextFrame.TextRange.Paragraphs(2).Font.Size = 9
        $t.TextFrame.TextRange.Paragraphs(2).Font.Color.RGB = $cWhite
        $t.TextFrame.TextRange.Font.Name = "Segoe UI"
    }

    # Left: Charts
    $box9L = $s9.Shapes.AddShape(5, 50, 230, 420, 250)
    $box9L.Fill.Solid()
    $box9L.Fill.ForeColor.RGB = $cCard
    $box9L.Line.ForeColor.RGB = $cCyan
    $box9L.Line.Weight = 1

    $t9L = $s9.Shapes.AddTextbox(1, 65, 240, 390, 230)
    $t9L.TextFrame.TextRange.Text = "Analytics & Incident Progression (Chart.js)`n`n• Monthly Trend: Tracks incidents (Jul: 18, Aug: 42, Sep: 65, Oct: 84, Nov: 98 incidents).`n• Risk Distribution: Nationwide categorized into 50% Low, 30% Moderate, 20% High risk zones.`n• Audit Log: Real-time event streaming of SOS triggers and siren dispatches."
    $t9L.TextFrame.TextRange.Paragraphs(1).Font.Size = 12
    $t9L.TextFrame.TextRange.Paragraphs(1).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $t9L.TextFrame.TextRange.Paragraphs(1).Font.Color.RGB = $cCyan
    $t9L.TextFrame.TextRange.Paragraphs(3).Font.Size = 10
    $t9L.TextFrame.TextRange.Paragraphs(3).Font.Color.RGB = $cWhite
    $t9L.TextFrame.TextRange.Font.Name = "Segoe UI"

    # Right: Broadcast Console
    $box9R = $s9.Shapes.AddShape(5, 490, 230, 420, 250)
    $box9R.Fill.Solid()
    $box9R.Fill.ForeColor.RGB = $cCard
    $box9R.Line.ForeColor.RGB = $cRed
    $box9R.Line.Weight = 1

    $t9R = $s9.Shapes.AddTextbox(1, 505, 240, 390, 230)
    $t9R.TextFrame.TextRange.Text = "Emergency Broadcast Console`n`n• Geofenced District Targeting: Send alerts to specific districts (Patiala, Rupnagar, Patna).`n• Severity Classification: RED (Immediate Evacuation), ORANGE (Preparedness), YELLOW (Watch).`n• Instant Broadcast: 1-click transmission to citizen SMS gateway, in-app push sirens, and police dispatch."
    $t9R.TextFrame.TextRange.Paragraphs(1).Font.Size = 12
    $t9R.TextFrame.TextRange.Paragraphs(1).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $t9R.TextFrame.TextRange.Paragraphs(1).Font.Color.RGB = $cRed
    $t9R.TextFrame.TextRange.Paragraphs(3).Font.Size = 10
    $t9R.TextFrame.TextRange.Paragraphs(3).Font.Color.RGB = $cWhite
    $t9R.TextFrame.TextRange.Font.Name = "Segoe UI"

    # ==========================================
    # SLIDE 10: BENCHMARK & COMPARISON
    # ==========================================
    Write-Host "Creating Slide 10: Benchmark & Comparison..."
    $s10 = Add-BaseSlide 10 "BENCHMARK & IMPACT" "How FloodRadarX Outperforms Existing Systems"

    $benchmarks = @(
        @{ cap="Alert Latency"; trad="3 – 5 hours AFTER water accumulates"; flood="1.5 – 6 hours BEFORE flood arrives" },
        @{ cap="Geospatial Granularity"; trad="Broad state/district level warnings"; flood="Sub-kilometer interactive Leaflet GIS" },
        @{ cap="Rescue Navigation"; trad="Static road maps without water data"; flood="Dynamic flooded vs safe corridors (NH-7)" },
        @{ cap="Shelter Allocation"; trad="Manual phone inquiries"; flood="Automated Haversine distance & bed counters" },
        @{ cap="Citizen SOS Signal"; trad="Congested call center queues"; flood="1-Click geolocated distress beacon" },
        @{ cap="Predictive Technology"; trad="Simple statistical rainfall averages"; flood="GradientBoosting Hydrological Ensemble" }
    )

    for ($i = 0; $i -lt 6; $i++) {
        $x = if ($i % 2 -eq 0) { 50 } else { 490 }
        $y = 120 + ([Math]::Floor($i / 2) * 115)

        $box = $s10.Shapes.AddShape(5, $x, $y, 420, 100)
        $box.Fill.Solid()
        $box.Fill.ForeColor.RGB = $cCard
        $box.Line.ForeColor.RGB = $cCyan
        $box.Line.Weight = 1

        $t = $s10.Shapes.AddTextbox(1, $x + 15, $y + 10, 390, 80)
        $t.TextFrame.TextRange.Text = "$($benchmarks[$i].cap)`nTraditional: $($benchmarks[$i].trad)`nFloodRadarX: $($benchmarks[$i].flood)"
        $t.TextFrame.TextRange.Paragraphs(1).Font.Size = 12
        $t.TextFrame.TextRange.Paragraphs(1).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
        $t.TextFrame.TextRange.Paragraphs(1).Font.Color.RGB = $cCyanLight
        $t.TextFrame.TextRange.Paragraphs(2).Font.Size = 9.5
        $t.TextFrame.TextRange.Paragraphs(2).Font.Color.RGB = $cMuted
        $t.TextFrame.TextRange.Paragraphs(3).Font.Size = 10
        $t.TextFrame.TextRange.Paragraphs(3).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
        $t.TextFrame.TextRange.Paragraphs(3).Font.Color.RGB = $cEmerald
        $t.TextFrame.TextRange.Font.Name = "Segoe UI"
    }

    # ==========================================
    # SLIDE 11: FUTURE ROADMAP
    # ==========================================
    Write-Host "Creating Slide 11: Future Roadmap..."
    $s11 = Add-BaseSlide 11 "SCALABILITY & HORIZONS" "Future Roadmap & Enterprise Scalability"

    $roadmaps = @(
        @{ q="PHASE 1 (Q1)"; title="LoRaWAN Mesh Radio"; desc="Implement decentralized peer-to-peer radio frequency communication so citizens can broadcast SOS alerts even when cellular towers fail." },
        @{ q="PHASE 2 (Q2)"; title="Drone Computer Vision"; desc="Integrate automated aerial drone camera feeds to classify breach severities on river embankments, dams, and dykes in real time." },
        @{ q="PHASE 3 (Q3)"; title="Crowdsourced Water Height"; desc="Citizen science mobile reporting module with photo EXIF geoverification to ground-truth satellite radar predictions." },
        @{ q="PHASE 4 (Q4)"; title="Pan-India Basin Expansion"; desc="Full expansion across Brahmaputra, Godavari, and Krishna river basins with national API gateway for NDMA and CWC." }
    )

    for ($i = 0; $i -lt 4; $i++) {
        $x = 50 + ($i * 215)
        $box = $s11.Shapes.AddShape(5, $x, 120, 205, 350)
        $box.Fill.Solid()
        $box.Fill.ForeColor.RGB = $cCard
        $box.Line.ForeColor.RGB = $cCyan
        $box.Line.Weight = 1.5

        $t = $s11.Shapes.AddTextbox(1, $x + 10, 135, 185, 320)
        $t.TextFrame.TextRange.Text = "$($roadmaps[$i].q)`n`n$($roadmaps[$i].title)`n`n$($roadmaps[$i].desc)"
        $t.TextFrame.TextRange.Paragraphs(1).Font.Size = 10
        $t.TextFrame.TextRange.Paragraphs(1).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
        $t.TextFrame.TextRange.Paragraphs(1).Font.Color.RGB = $cCyan
        $t.TextFrame.TextRange.Paragraphs(3).Font.Size = 12
        $t.TextFrame.TextRange.Paragraphs(3).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
        $t.TextFrame.TextRange.Paragraphs(3).Font.Color.RGB = $cWhite
        $t.TextFrame.TextRange.Paragraphs(5).Font.Size = 9.5
        $t.TextFrame.TextRange.Paragraphs(5).Font.Color.RGB = $cMuted
        $t.TextFrame.TextRange.Font.Name = "Segoe UI"
    }

    # ==========================================
    # SLIDE 12: CONCLUSION
    # ==========================================
    Write-Host "Creating Slide 12: Conclusion..."
    $s12 = $pres.Slides.Add(12, 12)
    $s12.Background.Fill.Solid()
    $s12.Background.Fill.ForeColor.RGB = $cBg

    $topBar12 = $s12.Shapes.AddShape(1, 0, 0, 960, 8)
    $topBar12.Fill.Solid()
    $topBar12.Fill.ForeColor.RGB = $cCyan
    $topBar12.Line.Visible = [Microsoft.Office.Core.MsoTriState]::msoFalse

    $t12 = $s12.Shapes.AddTextbox(1, 50, 45, 860, 60)
    $t12.TextFrame.TextRange.Text = "FloodRadarX"
    $t12.TextFrame.TextRange.Font.Size = 36
    $t12.TextFrame.TextRange.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $t12.TextFrame.TextRange.Font.Color.RGB = $cWhite
    $t12.TextFrame.TextRange.Font.Name = "Segoe UI"

    $sub12 = $s12.Shapes.AddTextbox(1, 50, 105, 860, 35)
    $sub12.TextFrame.TextRange.Text = "Predict. Protect. Respond. Together for a safer tomorrow."
    $sub12.TextFrame.TextRange.Font.Size = 16
    $sub12.TextFrame.TextRange.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $sub12.TextFrame.TextRange.Font.Color.RGB = $cCyan
    $sub12.TextFrame.TextRange.Font.Name = "Segoe UI"

    $box12 = $s12.Shapes.AddShape(5, 50, 150, 860, 300)
    $box12.Fill.Solid()
    $box12.Fill.ForeColor.RGB = $cCard
    $box12.Line.ForeColor.RGB = 60 + (70 * 256) + (90 * 65536)
    $box12.Line.Weight = 1

    $t12B = $s12.Shapes.AddTextbox(1, 75, 170, 810, 260)
    $t12B.TextFrame.TextRange.Text = "Key Takeaways:`n`n✓  Saves Lives: Replaces post-disaster reaction with pre-disaster algorithmic arrival predictions.`n`n✓  Empowers Both Responders & Citizens: Citizens receive actionable early guidance while NDRF gains navigable corridors.`n`n✓  Production-Grade Engineering: Built on Java Spring Boot 4, React 19, Leaflet GIS, and Scikit-Learn with 100% test passing verification.`n`n✓  Ready for Nationwide Scaling: Modular microservices ready to ingest nationwide sensor arrays and satellite constellations."
    $t12B.TextFrame.TextRange.Paragraphs(1).Font.Size = 14
    $t12B.TextFrame.TextRange.Paragraphs(1).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $t12B.TextFrame.TextRange.Paragraphs(1).Font.Color.RGB = $cWhite
    $t12B.TextFrame.TextRange.Paragraphs(3).Font.Size = 11
    $t12B.TextFrame.TextRange.Paragraphs(3).Font.Color.RGB = $cCyanLight
    $t12B.TextFrame.TextRange.Paragraphs(5).Font.Size = 11
    $t12B.TextFrame.TextRange.Paragraphs(5).Font.Color.RGB = $cCyanLight
    $t12B.TextFrame.TextRange.Paragraphs(7).Font.Size = 11
    $t12B.TextFrame.TextRange.Paragraphs(7).Font.Color.RGB = $cCyanLight
    $t12B.TextFrame.TextRange.Paragraphs(9).Font.Size = 11
    $t12B.TextFrame.TextRange.Paragraphs(9).Font.Color.RGB = $cCyanLight
    $t12B.TextFrame.TextRange.Font.Name = "Segoe UI"

    $foot12 = $s12.Shapes.AddTextbox(1, 50, 480, 860, 30)
    $foot12.TextFrame.TextRange.Text = "Thank You! Questions & Discussion  |  Project Folder: FloodRadarX"
    $foot12.TextFrame.TextRange.Font.Size = 12
    $foot12.TextFrame.TextRange.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $foot12.TextFrame.TextRange.Font.Color.RGB = $cWhite
    $foot12.TextFrame.TextRange.Font.Name = "Segoe UI"

    # Save presentation
    $outputPath = "C:\Users\paavani jindal\OneDrive\Desktop\FloodRadarX\FloodRadarX_Presentation.pptx"
    Write-Host "Saving presentation natively to $outputPath..."
    $pres.SaveAs($outputPath)
    $pres.Close()
    $ppt.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($ppt) | Out-Null
    Write-Host "[SUCCESS] 12-slide native presentation created and saved successfully!"
} catch {
    Write-Host "[ERROR] $($_.Exception.Message)"
}
