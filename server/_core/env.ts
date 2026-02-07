// Build database URL from separate env vars if available
// This avoids URL encoding issues with special characters in passwords
function buildDatabaseUrl(): string {
  // Try building from separate components first (most reliable for special chars)
  const dbHost = process.env.DB_HOST;
  const dbUser = process.env.DB_USER;
  const dbPass = process.env.DB_PASS;
  const dbName = process.env.DB_NAME;
  const dbSocket = process.env.DB_SOCKET;

  if (dbUser && dbPass && dbName) {
    if (dbSocket) {
      // Cloud SQL Unix socket connection
      const encodedPass = encodeURIComponent(dbPass);
      const url = `mysql://${dbUser}:${encodedPass}@localhost/${dbName}?socketPath=${dbSocket}`;
      console.log("[ENV] Built database URL from separate params (socket mode)");
      return url;
    } else if (dbHost) {
      const encodedPass = encodeURIComponent(dbPass);
      const url = `mysql://${dbUser}:${encodedPass}@${dbHost}/${dbName}`;
      console.log("[ENV] Built database URL from separate params (host mode)");
      return url;
    }
  }

  // Fallback to CUSTOM_DATABASE_URL or DATABASE_URL
  const customUrl = process.env.CUSTOM_DATABASE_URL;
  if (customUrl) {
    console.log("[ENV] Using CUSTOM_DATABASE_URL");
    return customUrl;
  }

  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    console.log("[ENV] Using DATABASE_URL");
    return dbUrl;
  }

  console.log("[ENV] No database URL configured");
  return "";
}

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "default-jwt-secret-change-this",
  databaseUrl: buildDatabaseUrl(),
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};
