export function validateEmail(email: string) {
    // Simple email regex
    return /^\S+@\S+\.\S+$/.test(email)
  }

export function validatePassword(password: string) {
    // At least one uppercase letter, one number, one special char, min 6 chars
    return /[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password) && password.length >= 6
  }