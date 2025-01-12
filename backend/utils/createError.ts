interface ResponseError extends Error {
  status?: number;
}

// Helper function to create and send errors
export const createError = (message: string, status: number): ResponseError => {
  const error = new Error(message) as ResponseError;
  error.status = status;
  return error;
};
