"use server";

export async function verifyAdminPassword(
  password: string
): Promise<{ success: boolean }> {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { success: false };
  }

  // Trim both strings to handle whitespace issues
  return { success: password.trim() === adminPassword.trim() };
}
