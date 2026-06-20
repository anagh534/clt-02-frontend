export const ERROR_MESSAGES = {
  // HTTP Status Code Mappings
  302: {
    DEFAULT: "Redirecting you to the correct page...",
    SESSION_EXPIRED: "Your session location has changed. Redirecting to login."
  },

  401: {
    DEFAULT: "Unauthorized access. Please log in again.",
    EXPIRED_TOKEN: "Your login session has expired.",
    INVALID_CREDENTIALS: "Incorrect email or password."
  },

  402: {
    DEFAULT: "Payment required to access this feature.",
    SUBSCRIPTION_REQUIRED: "Your premium access has expired. Please renew your subscription.",
    INSUFFICIENT_BALANCE: "Insufficient credits to generate this premium report."
  },

  403: {
    DEFAULT: "You do not have permission to access this resource.",
    FORBIDDEN: "Access denied. Please check your account privileges."
  },

  404: {
    DEFAULT: "The requested resource could not be found.",
    USER_NOT_FOUND: "User profile not found.",
    REPORT_NOT_FOUND: "The requested astrology report does not exist.",
    ENDPOINT_NOT_FOUND: "API endpoint is invalid or has been deprecated."
  },

  500: {
    DEFAULT: "Internal server error. Our developers are on it!",
    CALCULATION_ERROR: "The planetary engine ran into an error processing your chart.",
    DATABASE_ERROR: "Failed to communicate with our data servers. Please try again later."
  },

  // Fallback for unexpected network issues (e.g., timeout, CORS)
  NETWORK_ERROR: "Unable to reach the server. Please check your internet connection."
};