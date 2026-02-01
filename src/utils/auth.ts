import * as bcrypt from "bcryptjs"



// Helper Function to hash a password
export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
}

// Helper Function to verify a password against a hash
export async function verifyPassword(
    password: string,
    hash: string
): Promise<boolean> {
    return await bcrypt.compare(password, hash)
}

