export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  VERIFY_OTP: '/auth/verify-otp',

  // User
  PROFILE: '/user/profile',
  CUSTOMIZE: 'user/customize',
  CHANGE_PASSWORD: '/user/change-password',

  // Investors
  INVESTORS: '/investors',
  INVESTOR_BY_ID: (id) => `/investors/${id}`,
};