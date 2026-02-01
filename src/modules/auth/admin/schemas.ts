import { z } from "zod"

// Admin Signup Request Schema
export const AdminSignupPOSTRequest = z.object({
    adminEmail: z.email(),
    adminPassword: z.string(),
})

//  Derived TS type 
export type AdminSignupPOSTRequestSchema =
    z.infer<typeof AdminSignupPOSTRequest>
