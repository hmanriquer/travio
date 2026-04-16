import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import xlsx from "xlsx";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "./schema";

const db = drizzle(sql, { schema });

async function seed() {
  console.log("Seeding travelers from Excel file...");
  try {
    const workbook = xlsx.readFile('CONTROL SOLICITUDES DE GASTOS DE VIAJE Y VIATICOS 2026.xlsx');
    
    const uniqueTravelers = new Map<string, {
      name: string;
      department: string | null;
      jobTitle: string | null;
      baseRegion: string | null;
    }>();

    // Parse 'VIATICOS SOLICITADOS'
    if (workbook.SheetNames.includes("VIATICOS SOLICITADOS")) {
      const sheet = workbook.Sheets["VIATICOS SOLICITADOS"];
      const data = xlsx.utils.sheet_to_json<any[][]>(sheet, { header: 1 });
      
      // Data starts roughly at index 2 (ignoring title row and header row if they are first)
      for (let i = 2; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;
        
        const name = String(row[1] || "").trim();
        const department = String(row[2] || "").trim();
        const baseRegion = String(row[3] || "").trim();
        
        if (name && name !== "NOMBRE DEL SOLICITANTE" && name !== "undefined") {
          if (!uniqueTravelers.has(name)) {
            uniqueTravelers.set(name, {
              name,
              department: department !== "undefined" ? department : null,
              jobTitle: null,
              baseRegion: baseRegion !== "undefined" ? baseRegion : null,
            });
          }
        }
      }
    }

    // Parse 'VIATICOS COMPROBADOS' for additional info
    if (workbook.SheetNames.includes("VIATICOS COMPROBADOS")) {
      const sheet = workbook.Sheets["VIATICOS COMPROBADOS"];
      const data = xlsx.utils.sheet_to_json<any[][]>(sheet, { header: 1 });
      for (let i = 2; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;
        
        const name = String(row[1] || "").trim();
        const jobTitle = String(row[2] || "").trim();
        const baseRegion = String(row[3] || "").trim();
        
        if (name && name !== "NOMBRE DEL SOLICITANTE" && name !== "undefined") {
          if (uniqueTravelers.has(name)) {
            const traveler = uniqueTravelers.get(name)!;
            if (!traveler.jobTitle && jobTitle !== "undefined") {
              traveler.jobTitle = jobTitle;
            }
          } else {
            uniqueTravelers.set(name, {
              name,
              department: null,
              jobTitle: jobTitle !== "undefined" ? jobTitle : null,
              baseRegion: baseRegion !== "undefined" ? baseRegion : null,
            });
          }
        }
      }
    }

    const travelersToInsert = Array.from(uniqueTravelers.values());
    console.log(`Found ${travelersToInsert.length} unique travelers to seed.`);

    if (travelersToInsert.length > 0) {
      await db.insert(schema.travelers).values(travelersToInsert).onConflictDoNothing();
      console.log("Travelers seeded successfully!");
    } else {
      console.log("No travelers found to seed.");
    }
  } catch (err) {
    console.error("Error during seeding:", err);
  } finally {
    process.exit(0);
  }
}

seed();
