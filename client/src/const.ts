export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// OAuth removed - using custom email authentication
// Login is now handled through /auth route
export const getLoginUrl = ( ) => {
  return "/auth";
};
