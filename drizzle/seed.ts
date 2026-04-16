import { sql } from "@vercel/postgres"
import bcrypt from "bcryptjs"
import * as dotenv from "dotenv"
import { drizzle } from "drizzle-orm/vercel-postgres"
import xlsx from "xlsx"

import * as schema from "./schema"

dotenv.config({ path: ".env.local" })

const db = drizzle(sql, { schema })

// ---------------------------------------------------------------------------
// Seed travelers from Excel
// ---------------------------------------------------------------------------
async function seedTravelers() {
  console.log("Seeding travelers from Excel file...")
  try {
    const workbook = xlsx.readFile(
      "CONTROL SOLICITUDES DE GASTOS DE VIAJE Y VIATICOS 2026.xlsx"
    )

    const uniqueTravelers = new Map<
      string,
      {
        name: string
        department: string | null
        jobTitle: string | null
        baseRegion: string | null
      }
    >()

    // Parse 'VIATICOS SOLICITADOS'
    if (workbook.SheetNames.includes("VIATICOS SOLICITADOS")) {
      const sheet = workbook.Sheets["VIATICOS SOLICITADOS"]
      const data = xlsx.utils.sheet_to_json<unknown[][]>(sheet, { header: 1 })

      for (let i = 2; i < data.length; i++) {
        const row = data[i]
        if (!row || row.length === 0) continue

        const name = String(row[1] || "").trim()
        const department = String(row[2] || "").trim()
        const baseRegion = String(row[3] || "").trim()

        if (name && name !== "NOMBRE DEL SOLICITANTE" && name !== "undefined") {
          if (!uniqueTravelers.has(name)) {
            uniqueTravelers.set(name, {
              name,
              department: department !== "undefined" ? department : null,
              jobTitle: null,
              baseRegion: baseRegion !== "undefined" ? baseRegion : null,
            })
          }
        }
      }
    }

    // Parse 'VIATICOS COMPROBADOS' for additional info
    if (workbook.SheetNames.includes("VIATICOS COMPROBADOS")) {
      const sheet = workbook.Sheets["VIATICOS COMPROBADOS"]
      const data = xlsx.utils.sheet_to_json<unknown[][]>(sheet, { header: 1 })

      for (let i = 2; i < data.length; i++) {
        const row = data[i]
        if (!row || row.length === 0) continue

        const name = String(row[1] || "").trim()
        const jobTitle = String(row[2] || "").trim()
        const baseRegion = String(row[3] || "").trim()

        if (name && name !== "NOMBRE DEL SOLICITANTE" && name !== "undefined") {
          if (uniqueTravelers.has(name)) {
            const traveler = uniqueTravelers.get(name)!
            if (!traveler.jobTitle && jobTitle !== "undefined") {
              traveler.jobTitle = jobTitle
            }
          } else {
            uniqueTravelers.set(name, {
              name,
              department: null,
              jobTitle: jobTitle !== "undefined" ? jobTitle : null,
              baseRegion: baseRegion !== "undefined" ? baseRegion : null,
            })
          }
        }
      }
    }

    const travelersToInsert = Array.from(uniqueTravelers.values())
    console.log(`Found ${travelersToInsert.length} unique travelers to seed.`)

    if (travelersToInsert.length > 0) {
      await db
        .insert(schema.travelers)
        .values(travelersToInsert)
        .onConflictDoNothing()
      console.log("Travelers seeded successfully!")
    } else {
      console.log("No travelers found to seed.")
    }
  } catch (err) {
    console.error("Error seeding travelers:", err)
  }
}

// ---------------------------------------------------------------------------
// Seed master user
// ---------------------------------------------------------------------------
async function seedMasterUser() {
  console.log("\nSeeding master user...")

  const DEFAULT_EMAIL = "admin@travio.com"
  const DEFAULT_PASSWORD = "Admin123!"

  try {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12)

    await db
      .insert(schema.users)
      .values({
        email: DEFAULT_EMAIL,
        passwordHash,
        role: "master",
      })
      .onConflictDoNothing()

    console.log("✓ Master user ready.")
    console.log(`  Email:    ${DEFAULT_EMAIL}`)
    console.log(`  Password: ${DEFAULT_PASSWORD}`)
    console.log(
      "  ⚠️  Change this password immediately after your first login!"
    )
  } catch (err) {
    console.error("Error seeding master user:", err)
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function seed() {
  await seedTravelers()
  await seedMasterUser()
  process.exit(0)
}

seed()
