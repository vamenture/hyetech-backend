
export const getValidationErrorMessage = (details) => {
    return details.map((i) => i.message).join(',');
  };




