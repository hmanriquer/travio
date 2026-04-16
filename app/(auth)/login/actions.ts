"use server"

import { AuthService } from "@/lib/services/auth.service"

const authService = new AuthService()

export async function checkEmailExists(email: string): Promise<boolean> {
  return authService.checkEmailExists(email)
}
