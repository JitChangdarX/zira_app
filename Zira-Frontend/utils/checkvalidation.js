export const checkvalidation = ({ username, email, password }) => {
  const errors = {};
  if (!username || username.trim() === "") {
    errors.username = "Please enter username";
  }
  if (!email) {
    errors.email = "Please enter email";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = "Please check your email";
    }
  }
  if (!password) {
    errors.password = "Please enter password";
  } else if (password.length < 6) {
    errors.password = "Please check your password";
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
