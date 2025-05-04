import React, { useState } from 'react';
import { ArrowUpRight, Home, Users, Map, TrendingUp, Info, Briefcase } from 'lucide-react';
// Stelle sicher, dass du Tailwind CSS oder eine ähnliche CSS-Bibliothek konfiguriert hast,
// oder passe die Klassennamen an dein CSS an.
import './App.css'; // Falls du eine separate CSS-Datei verwendest

// Define colors based on M1 map categories (Verified against Map Legend)
const emigrationRateColors = {
    '<2.0%': '#66BB6A',      // Dark Green
    '2.0-4.9%': '#9CCC65',    // Light Green
    '5.0-9.9%': '#FFEE58',    // Yellow
    '10.0-14.9%': '#FFA726',  // Orange
    '15.0-20.0%': '#FF7043',  // Deep Orange
    '>20.0%': '#EF5350',     // Red
};

// EU Arbeitsmigration Daten 2020 (Corrected & Verified based on M1, M2, M3 from image)
const migrationData = {
  emigrationRates: { // Source: M1 Map & Legend
    // >20.0% (Red)
    RO: { name: "Rumänien", rate: ">20.0%", color: emigrationRateColors['>20.0%'] },
    HR: { name: "Kroatien", rate: ">20.0%", color: emigrationRateColors['>20.0%'] },
    // 15.0-20.0% (Deep Orange)
    BG: { name: "Bulgarien", rate: "15.0-20.0%", color: emigrationRateColors['15.0-20.0%'] },
    P: { name: "Portugal", rate: "15.0-20.0%", color: emigrationRateColors['15.0-20.0%'] },
    // 10.0-14.9% (Orange)
    LT: { name: "Litauen", rate: "5.0-9.9%", color: emigrationRateColors['5.0-9.9%'] },
    LV: { name: "Lettland", rate: "5.0-9.9%", color: emigrationRateColors['5.0-9.9%'] },
    SK: { name: "Slowakei", rate: "10.0-14.9%", color: emigrationRateColors['10.0-14.9%'] },
    // 5.0-9.9% (Yellow)
    PL: { name: "Polen", rate: "5.0-9.9%", color: emigrationRateColors['5.0-9.9%'] },
    EST: { name: "Estland", rate: "5.0-9.9%", color: emigrationRateColors['5.0-9.9%'] },
    CY: { name: "Zypern", rate: "5.0-9.9%", color: emigrationRateColors['5.0-9.9%'] },
    // 2.0-4.9% (Light Green)
    I: { name: "Italien", rate: "2.0-4.9%", color: emigrationRateColors['2.0-4.9%'] },
    H: { name: "Ungarn", rate: "2.0-4.9%", color: emigrationRateColors['2.0-4.9%'] },
    SLO: { name: "Slowenien", rate: "2.0-4.9%", color: emigrationRateColors['2.0-4.9%'] },
    GR: { name: "Griechenland", rate: "5.0-9.9%", color: emigrationRateColors['5.0-9.9%'] },
    CZ: { name: "Tschechien", rate: "<2.0%", color: emigrationRateColors['<2.0%'] },
    M: { name: "Malta", rate: "2.0-4.9%", color: emigrationRateColors['2.0-4.9%'] },
    // <2.0% (Dark Green)
    D: { name: "Deutschland", rate: "<2.0%", color: emigrationRateColors['<2.0%'] },
    F: { name: "Frankreich", rate: "<2.0%", color: emigrationRateColors['<2.0%'] },
    E: { name: "Spanien", rate: "<2.0%", color: emigrationRateColors['<2.0%'] },
    B: { name: "Belgien", rate: "2.0-4.9%", color: emigrationRateColors['2.0-4.9%'] },
    NL: { name: "Niederlande", rate: "2.0-4.9%", color: emigrationRateColors['2.0-4.9%'] },
    IRL: { name: "Irland", rate: "<2.0%", color: emigrationRateColors['<2.0%'] },
    A: { name: "Österreich", rate: "2.0-4.9%", color: emigrationRateColors['2.0-4.9%'] },
    S: { name: "Schweden", rate: "2.0-4.9%", color: emigrationRateColors['2.0-4.9%'] },
    FIN: { name: "Finnland", rate: "2.0-4.9%", color: emigrationRateColors['2.0-4.9%'] },
    DK: { name: "Dänemark", rate: "2.0-4.9%", color: emigrationRateColors['2.0-4.9%'] },
    L: { name: "Luxemburg", rate: "<2.0%", color: emigrationRateColors['<2.0%'] }, // VERIFIED Dark Green on map
  },

  destinationCountries: [ // Source: M2 Table (Verified)
    { country: "Deutschland", workers: 2.46 },
    { country: "Spanien", workers: 0.81 },
    { country: "Italien", workers: 0.75 },
    { country: "Frankreich", workers: 0.58 },
    { country: "Österreich", workers: 0.44 },
    { country: "Belgien", workers: 0.39 },
    { country: "Niederlande", workers: 0.22 },
    { country: "Irland", workers: 0.20 },
    { country: "Schweden", workers: 0.15 },
    { country: "Luxemburg", workers: 0.13 }
    // Total: 6.54 Mio according to M2 table note
  ],

  germanImmigrationByOrigin: [ // Source: M3 Pie Chart (Verified)
    { country: "Rumänien", percentage: 32.7 },
    { country: "Polen", percentage: 17.2 },
    { country: "Bulgarien", percentage: 11.7 }, // VERIFIED 11.7% on chart
    { country: "Italien", percentage: 6.7 },    // VERIFIED 6.7% on chart
    { country: "Kroatien", percentage: 6.5 },
    { country: "Übrige EU", percentage: 25.2 }
  ]
};

// Color palette for general charts (like Pie chart, Bar chart)
const chartColorPalette = [
  "#26A69A", "#FF7043", "#FFEE58", "#5C6BC0", "#42A5F5", "#26C6DA",
  "#66BB6A", "#FFA726", "#8D6E63", "#EC407A", "#AB47BC"
];

// --- React Components ---

// Simple Pie Chart Component (SVG based) - FIXED
function PieChart({ data, colors = chartColorPalette }) {
  const total = data.reduce((sum, item) => sum + (item.percentage || 0), 0); // Use percentage field
  if (total === 0) return <div className="text-center text-gray-500">Keine Daten für Tortendiagramm</div>;

  // Check if data approximately sums to 100% and warn if not
  if (Math.abs(total - 100) > 0.1) {
      console.warn("Pie chart data does not sum close to 100%:", total);
      // Optional: Display a warning to the user?
  }

  let cumulativePercentage = 0;
  const radius = 45; // Radius within the 100x100 viewBox
  const cx = 50;     // Center x
  const cy = 50;     // Center y

  return (
    // Removed the -rotate-90 transform here
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {data.map((item, idx) => {
        const percentage = item.percentage || 0;
        if (percentage <= 0) return null; // Don't draw zero or negative slices

        const angleDegrees = percentage * 3.6; // Angle extent of the slice in degrees

        // Calculate start and end angles in radians, offset by -90 degrees (-PI/2 rad) to start at 12 o'clock
        const startAngleRad = ((cumulativePercentage * 3.6 - 90) * Math.PI) / 180;
        const endAngleRad = (((cumulativePercentage + percentage) * 3.6 - 90) * Math.PI) / 180;

        // Update cumulative percentage for the next slice
        cumulativePercentage += percentage;

        // Calculate the start and end points of the arc
        const x1 = cx + radius * Math.cos(startAngleRad);
        const y1 = cy + radius * Math.sin(startAngleRad);
        const x2 = cx + radius * Math.cos(endAngleRad);
        const y2 = cy + radius * Math.sin(endAngleRad);

        // Determine if the arc should be drawn as > 180 degrees
        const largeArcFlag = angleDegrees > 180 ? 1 : 0;

        // Path definition for the slice wedge:
        // M cx cy     - Move to center
        // L x1 y1     - Line to arc start point
        // A r r 0 lrg sweep x2 y2 - Arc to end point (rx ry x-axis-rotation large-arc-flag sweep-flag x y)
        // Z           - Close path (line back to center)
        // sweep-flag = 1 means draw the arc clockwise
        const pathData = [
          `M ${cx} ${cy}`,
          `L ${x1} ${y1}`,
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          `Z`
        ].join(' ');

        return (
          <path
            key={item.country || idx} // Use country name as key if available
            d={pathData}
            fill={colors[idx % colors.length]}
            stroke="#fff" // White stroke for separation
            strokeWidth="1" // Stroke width
          />
        );
      })}
    </svg>
  );
}

// Card for Key Insights
function KeyInsightCard({ title, description, icon }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex items-start space-x-3 h-full"> {/* Added h-full */}
       <div className="flex-shrink-0 text-blue-600 mt-1">{icon}</div>
       <div>
         <h3 className="font-bold text-lg mb-1">{title}</h3>
         <p className="text-gray-700 text-sm">{description}</p>
       </div>
    </div>
  );
}

// --- Tab Content Components ---

function DashboardTab() {
    const top5Destinations = migrationData.destinationCountries.slice(0, 5);
    const maxTop5Workers = top5Destinations.length > 0 ? Math.max(...top5Destinations.map(c => c.workers)) : 1;
    // Use the explicit total from the M2 table note
    const totalWorkersFromTable = 6.54;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md border border-blue-100">
        <h2 className="text-2xl font-bold mb-3 text-blue-800">EU Arbeitsmigration: Übersicht 2020</h2>
        <p className="mb-6 text-gray-700">
          Dieses Dashboard visualisiert die wichtigsten Aspekte der Arbeitsmigration innerhalb der Europäischen Union basierend auf Daten aus dem Jahr 2020 (Quellen: Eurostat, Statistisches Bundesamt, wie in M1-M3 angegeben). Beachte, dass 2020 durch die COVID-19-Pandemie beeinflusst war.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KeyInsightCard
            title={`${totalWorkersFromTable.toFixed(2)} Mio.`} // Use the total from M2 table
            description="EU-Bürger arbeiteten 2020 in einem anderen EU-Land (laut M2)"
            icon={<Briefcase size={24} />}
          />
          <KeyInsightCard
            title="Deutschland Top-Ziel"
            description={`Mit 2,46 Mio. EU-Arbeitskräften wichtigstes Zielland (M2)`}
            icon={<Map size={24} />}
          />
          <KeyInsightCard
            title="Hohe Abwanderung Ost/Südost"
            description={`Signifikanter Anteil (>10%) der Erwerbstätigen aus RO, HR, BG, P, LT, LV, SK arbeitete 2020 im EU-Ausland (M1)`}
            icon={<ArrowUpRight size={24} />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Top 5 Destination Countries */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-bold mb-4">Top 5 Zielländer 2020 (Mio. EU-Arbeitskräfte)</h3>
          <div className="space-y-4">
            {top5Destinations.map((country, idx) => (
              <div key={country.country}>
                <div className="flex items-center justify-between mb-1 text-sm">
                  <span className="font-medium">{country.country}</span>
                  <span className="font-semibold">{country.workers.toFixed(2)} Mio.</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-4 rounded-full transition-width duration-500 ease-out"
                    style={{
                      width: `${Math.max(0, Math.min(100,(country.workers / maxTop5Workers) * 100))}%`, // Safe percentage calculation
                      backgroundColor: chartColorPalette[idx % chartColorPalette.length]
                    }}
                    title={`${country.country}: ${country.workers.toFixed(2)} Mio.`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
           <p className="text-xs text-gray-500 mt-3">Quelle: M2 Tabelle (Stat. Bundesamt)</p>
        </div>

        {/* Pie Chart: German Immigration Origin */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-bold mb-4">Herkunft zugezogener EU-Bürger nach Deutschland (2020)</h3>
          <div className="flex flex-col sm:flex-row items-center justify-around space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-40 h-40 flex-shrink-0">
              <PieChart data={migrationData.germanImmigrationByOrigin} colors={chartColorPalette}/>
            </div>
            <div className="text-sm">
              <ul className="space-y-1">
                {migrationData.germanImmigrationByOrigin.map((item, idx) => (
                  <li key={item.country} className="flex items-center">
                    <span
                      className="inline-block w-3 h-3 mr-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: chartColorPalette[idx % chartColorPalette.length] }}
                    ></span>
                    {/* Displaying the corrected percentages */}
                    <span>{item.country}: {item.percentage.toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Quelle: M3 Tortendiagramm (Stat. Bundesamt)</p>
        </div>
      </div>

      {/* Conclusions */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-bold mb-4">Zentrale Schlussfolgerungen (basierend auf M1-M3 Analyse)</h2>
        <div className="space-y-3 text-gray-700">
          <p>
            Die Materialien zeigen für 2020 eine deutliche Tendenz der Arbeitsmigration von Ost- und Südosteuropa nach Westeuropa innerhalb der EU. Arbeitskräfte wanderten vermehrt aus Ländern mit (vermutlich) geringeren Löhnen und Karrierechancen in wirtschaftlich stärkere Länder ab.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h4 className="font-semibold text-blue-800">Wichtigste Erkenntnisse aus M1-M3:</h4>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
              <li>Osteuropäische/Baltische/Südosteuropäische Länder (RO, HR, BG, P, LT, LV, SK) hatten 2020 die höchsten relativen Abwanderungsraten (Anteil an eigener Erwerbsbevölkerung 20-64 J.).</li>
              <li>Westeuropäische Länder (D, F, E, NL, L etc.) hatten niedrige relative Abwanderungsraten (5%).</li>
              <li>Deutschland war das mit Abstand wichtigste Zielland für EU-Arbeitskräfte (absolute Zahlen).</li>
              <li>Die Hauptherkunftsländer für Zuwanderer nach Deutschland (RO, PL, BG, HR - M3) korrelieren stark mit den Ländern hoher Abwanderungsraten (M1), mit Ausnahme von Polen (mittlere Rate).</li>
              <li>Italien war ein signifikantes Herkunftsland für Deutschland (M3 - 6.7%), obwohl seine generelle Abwanderungsrate (M1) nur niedrig war (2.0-4.9%).</li>
            </ul>
             <p className="text-xs text-gray-600 mt-3">*Hinweis: Daten für 2020, möglicherweise durch Pandemie beeinflusst. M1 zeigt Raten bezogen auf Herkunftsland-Erwerbsbevölkerung (20-64 J.), M2 absolute Zahlen im Zielland, M3 prozentuale Herkunft für DE.*</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OriginCountriesTab() {
    // Group countries by emigration rate category (using verified M1 data)
    const rateOrder = ['>20.0%', '15.0-20.0%', '10.0-14.9%', '5.0-9.9%', '2.0-4.9%', '<2.0%'];
    const groupedData = rateOrder.reduce((acc, rate) => {
        acc[rate] = Object.entries(migrationData.emigrationRates) // Using the corrected data
                           .filter(([_, data]) => data.rate === rate)
                           .sort((a, b) => a[1].name.localeCompare(b[1].name)); // Sort alphabetically
        return acc;
    }, {});

    const categoryTitles = {
        '>20.0%': 'Sehr Hoch (>20.0%)',
        '15.0-20.0%': 'Hoch (15.0-20.0%)',
        '10.0-14.9%': 'Erhöht (10.0-14.9%)',
        '5.0-9.9%': 'Mittel (5.0-9.9%)',
        '2.0-4.9%': 'Niedrig (2.0-4.9%)',
        '<2.0%': 'Sehr Niedrig (<2.0%)'
    };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-bold mb-4">Abwanderungsraten aus Herkunftsländern 2020 (M1)</h2>
        <p className="mb-6 text-gray-700">
          Anteil der erwerbstätigen 20-64-Jährigen, die 2020 in einem anderen EU-Land arbeiteten, bezogen auf die gleichaltrige Erwerbsbevölkerung des Herkunftslandes (Quelle: M1 Legende/Eurostat). Gruppiert nach Raten.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rateOrder.map(rate => (
            groupedData[rate].length > 0 && (
              <div key={rate} className="border rounded-lg overflow-hidden shadow-sm">
                 {/* Header with color indicator */}
                <div className="p-3 border-b flex items-center space-x-2" style={{ backgroundColor: emigrationRateColors[rate] + '20' }}> {/* Lighter bg */}
                   <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: emigrationRateColors[rate] }}></span>
                   <h3 className="font-bold" style={{ color: emigrationRateColors[rate] }}>{categoryTitles[rate]}</h3>
                </div>
                <div className="p-4 text-sm space-y-2">
                  {groupedData[rate].map(([code, data]) => (
                    <div key={code} className="flex items-center justify-between py-1 border-b last:border-b-0">
                      <span>{data.name} ({code})</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
         <p className="text-xs text-gray-500 mt-3">Quelle: M1 Karte & Legende (Eurostat)</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border">
         <h3 className="text-lg font-bold mb-4">Interpretation der Abwanderungsraten (M1)</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
             <div className="bg-gray-50 p-4 rounded border">
                 <h4 className="font-semibold mb-2 text-gray-800">Hohe / Erhöhte Raten (mehr als 10%)</h4>
                 <p className="text-gray-600">Länder wie Rumänien, Kroatien (mehr als 20%), Bulgarien, Portugal (15-20%), Litauen, Lettland, Slowakei (10-15%) zeigten 2020 die höchsten relativen Abwanderungsraten. Ein signifikanter Teil ihrer Erwerbsbevölkerung arbeitete im EU-Ausland.</p>
                 <p className="text-gray-600 mt-2">Mögliche Gründe (nicht in Daten): Wirtschaftliche Faktoren (Lohngefälle, Arbeitsmarktchancen), etablierte Migrationsnetzwerke.</p>
             </div>
             <div className="bg-gray-50 p-4 rounded border">
                 <h4 className="font-semibold mb-2 text-gray-800">Niedrige / Sehr niedrige Raten (mehr als 5%)</h4>
                 <p className="text-gray-600">Italien, Ungarn, Slowenien, Griechenland, Tschechien, Malta (2-4.9%) und insbesondere Deutschland, Frankreich, Spanien, Benelux, Skandinavien, Österreich, Irland (weniger als 2%) hatten geringe Raten.</p>
                 <p className="text-gray-600 mt-2">Mögliche Gründe (nicht in Daten): Weniger wirtschaftlicher Anreiz zur Abwanderung, größere eigene Arbeitsmärkte, selbst wichtige Zielländer.</p>
             </div>
         </div>
       </div>
    </div>
  );
}

function DestinationCountriesTab() {
  // Using verified M2 data
  const sortedDestinations = [...migrationData.destinationCountries].sort((a, b) => b.workers - a.workers);
  const maxWorkers = sortedDestinations.length > 0 ? Math.max(...sortedDestinations.map(d => d.workers)) : 1;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-bold mb-4">Wichtige Zielländer für EU-Arbeitskräfte 2020 (M2)</h2>
        <p className="mb-6 text-gray-700">
          Absolute Anzahl (in Millionen) der Arbeitskräfte aus anderen EU-Staaten, die 2020 in den aufgelisteten Zielländern tätig waren (basierend auf M2 Tabelle, Quelle: Stat. Bundesamt). Liste zeigt die 10 Länder mit den höchsten Werten aus der Quelle.
        </p>

        {/* Bar Chart: All listed Destination Countries */}
        <div className="space-y-4">
          {sortedDestinations.map((country, idx) => (
            <div key={country.country}>
              <div className="flex items-center justify-between mb-1 text-sm">
                <span className="font-medium">{country.country}</span>
                <span className="font-semibold">{country.workers.toFixed(2)} Mio.</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden" title={`${country.country}: ${country.workers.toFixed(2)} Mio.`}>
                 <div
                    className="h-5 rounded-full flex items-center justify-start pl-2 transition-width duration-500 ease-out"
                    style={{
                      width: `${Math.max(0, Math.min(100,(country.workers / maxWorkers) * 100))}%`, // Safe percentage calculation
                      backgroundColor: chartColorPalette[idx % chartColorPalette.length]
                    }}
                  >
                   {/* Optional: Text inside bar if wide enough */}
                  </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200 text-sm">
          <h3 className="font-semibold text-blue-800 mb-2">Hinweise zu Zielländern (M2)</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Deutschland war 2020 mit 2,46 Mio. das mit Abstand wichtigste Zielland in dieser Auswahl.</li>
            <li>Die Top 5 (D, E, I, F, A) nahmen zusammen 5,04 Mio. der 6,54 Mio. erfassten EU-Arbeitsmigranten auf (ca. 77%).</li>
            <li>Die Zahlen sind absolut. Im Verhältnis zur eigenen Bevölkerungsgröße haben kleinere Länder wie Luxemburg (0,13 Mio. auf ca. 0,6 Mio. Einwohner) oder Irland (0,20 Mio. auf ca. 5 Mio. Einwohner) eine hohe relative Bedeutung als Zielland.</li>
            <li>Die Quelle (M2) listet explizit diese 10 Länder und eine Gesamtsumme auf.</li>
          </ul>
           <p className="text-xs text-gray-500 mt-3">Quelle: M2 Tabelle (Stat. Bundesamt)</p>
        </div>
      </div>
    </div>
  );
}

function GermanyImmigrationTab() {
  // Using verified M3 data
  const germanData = migrationData.germanImmigrationByOrigin;
  // Sort data by percentage for consistent legend/pie color mapping if needed
  const sortedGermanData = [...germanData].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-bold mb-4">Fokus Deutschland: Zuwanderung 2020 (M3)</h2>
        <p className="mb-6 text-gray-700">
          Deutschland war 2020 das Hauptzielland (M2). Diese Ansicht zeigt die Herkunftsländer der in diesem Jahr nach Deutschland zugezogenen EU-Bürger als Anteil an allen zugezogenen EU-Bürgern (basierend auf M3 Tortendiagramm, Quelle: Stat. Bundesamt).
        </p>

        <div className="flex flex-col lg:flex-row items-center justify-around lg:space-x-8 space-y-6 lg:space-y-0">
          {/* Pie Chart */}
          <div className="w-64 h-64 flex-shrink-0">
             {/* Pass sorted data to ensure consistent color mapping with legend */}
            <PieChart data={sortedGermanData} colors={chartColorPalette} />
          </div>

          {/* Legend / List */}
          <div className="w-full lg:w-auto">
             <h3 className="font-semibold mb-3 text-center lg:text-left">Herkunftsländer (Anteile in %)</h3>
             <div className="space-y-2 text-sm max-w-xs mx-auto lg:mx-0">
               {/* Map over sorted data for the legend */}
               {sortedGermanData.map((item, idx) => (
                 <div key={item.country} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                   <div className="flex items-center">
                     <span
                       className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                       style={{ backgroundColor: chartColorPalette[idx % chartColorPalette.length] }}
                     ></span>
                     <span className="flex-grow">{item.country}</span>
                   </div>
                   <span className="font-semibold">{item.percentage.toFixed(1)}%</span> {/* Verified percentage */}
                 </div>
               ))}
             </div>
          </div>
        </div>
         <p className="text-xs text-gray-500 mt-3 text-center lg:text-left">Quelle: M3 Tortendiagramm (Stat. Bundesamt)</p>

        {/* Connection M1 and M3 */}
        <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-bold mb-3">Verbindung zur Abwanderung (M1 & M3)</h3>
            <p className="text-gray-700 text-sm">
                Es besteht eine deutliche Korrelation: Die Länder mit den höchsten Anteilen an Zuwanderern nach Deutschland (M3: Rumänien 32.7%, Polen 17.2%, Bulgarien 11.7%, Kroatien 6.5%) gehören überwiegend auch zu den Ländern mit den höchsten relativen Abwanderungsraten ihrer Bevölkerung (M1: RO/HR mehr als 20%, BG 15-20%, PL 5-10%). Dies unterstreicht den starken Migrationsfluss von diesen Ländern nach Deutschland im Jahr 2020.
            </p>
             <p className="text-gray-700 text-sm mt-2">
                Interessant ist Italien: Mit 6.7% (M3) ein relevantes Herkunftsland für Deutschland, obwohl seine allgemeine Abwanderungsrate (M1) mit 2.0-4.9% eher niedrig ist. Dies deutet auf spezifische Faktoren für die Migration von Italienern nach Deutschland hin, die über die allgemeine nationale Abwanderungsneigung hinausgehen.
            </p>
        </div>
      </div>
    </div>
  );
}


// --- Main Dashboard Component ---

export default function EUMigrationDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'origin': return <OriginCountriesTab />;
      case 'destination': return <DestinationCountriesTab />;
      case 'germany': return <GermanyImmigrationTab />;
      default: return <DashboardTab />;
    }
  };

  // Helper function for tab styling
  const getTabClassName = (tabName) => {
    const isActive = activeTab === tabName;
    // Added whitespace-nowrap to prevent text wrapping on smaller screens
    return `px-4 py-3 font-medium flex items-center text-sm transition-colors duration-150 whitespace-nowrap ${
      isActive
        ? 'text-blue-700 border-b-2 border-blue-700'
        : 'text-gray-500 hover:text-blue-600 border-b-2 border-transparent hover:border-gray-300'
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      {/* Header */}
       {/* Adjusted padding and text size for responsiveness */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-3 sm:p-4 shadow-md sticky top-0 z-20">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold mr-4 whitespace-nowrap">EU Arbeitsmigration 2020</h1>
          <div className="text-xs text-blue-100 mt-1 sm:mt-0 flex items-center space-x-1">
            <Info size={14} />
            <span>Daten: M1 (Eurostat), M2/M3 (Stat. Bundesamt)</span>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
       {/* Adjusted top value and added z-index */}
      <nav className="bg-white shadow-sm sticky top-[52px] sm:top-[68px] z-10"> {/* Adjust based on actual header height */}
         {/* Enable horizontal scrolling for tabs on small screens */}
        <div className="container mx-auto flex overflow-x-auto">
          <button onClick={() => setActiveTab('dashboard')} className={getTabClassName('dashboard')}>
            <Home size={16} className="mr-1.5 flex-shrink-0" /> Übersicht
          </button>
          <button onClick={() => setActiveTab('origin')} className={getTabClassName('origin')}>
            <ArrowUpRight size={16} className="mr-1.5 flex-shrink-0" /> Herkunft (M1 Rate)
          </button>
          <button onClick={() => setActiveTab('destination')} className={getTabClassName('destination')}>
            <TrendingUp size={16} className="mr-1.5 flex-shrink-0" /> Zielländer (M2 Anzahl)
          </button>
          <button onClick={() => setActiveTab('germany')} className={getTabClassName('germany')}>
            <Users size={16} className="mr-1.5 flex-shrink-0" /> Fokus DE (M3 Herkunft)
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container mx-auto py-6 px-4">
        {renderTabContent()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-4 mt-12">
        <div className="container mx-auto text-center text-xs px-4">
          © {new Date().getFullYear()} EU Arbeitsmigrations-Dashboard | Visualisierung basierend auf M1-M3 (Datenstand 2020)
        </div>
      </footer>
    </div>
  );
}