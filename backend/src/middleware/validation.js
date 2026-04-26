const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateProductData = (data) => {
  const errors = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push('Description is required');
  }

  if (!data.price || data.price <= 0) {
    errors.push('Price must be greater than 0');
  }

  if (!data.category) {
    errors.push('Category is required');
  }

  if (!Array.isArray(data.images) || data.images.length === 0) {
    errors.push('At least one image is required');
  }

  if (data.stock === undefined || data.stock < 0) {
    errors.push('Stock must be a positive number');
  }

  return errors;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateProductData,
};
