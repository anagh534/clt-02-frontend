export const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
export const isPasswordStrong = (password) => password.length >= 8
export const isOtpValid = (code) => /^\d{4,6}$/.test(code)
export const isNameValid = (name) => name.trim().length >= 2
