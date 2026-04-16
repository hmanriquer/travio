import { verifyPassword } from "@/lib/password"
import { UserRepository } from "@/lib/repositories/user.repository"

type AuthUser = {
  id: string
  email: string
  role: "master" | "admin"
}

/**
 * Encapsulates all authentication business logic.
 * Depends on UserRepository for data access; never touches the DB directly.
 */
export class AuthService {
  private readonly userRepository: UserRepository

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository
  }

  /**
   * Returns `true` when an active account exists for the given email.
   * Used during the multi-step login flow to gate the password step.
   */
  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email)
    return user !== null
  }

  /**
   * Validates the provided credentials.
   * Returns a stripped-down `AuthUser` on success, or `null` on failure.
   * Never exposes the password hash to callers.
   */
  async validateCredentials(
    email: string,
    password: string
  ): Promise<AuthUser | null> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) return null

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) return null

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    }
  }
}
