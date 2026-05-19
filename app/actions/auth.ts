"use server";

export async function verifyAdminPassword(
  password: string
): Promise<{ success: boolean }> {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    // If no password is set, deny access
    return { success: false };
  }

  return { success: password === adminPassword };
}
