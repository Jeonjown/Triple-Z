// utils/createError.ts
export interface ResponseError extends Error {
  status?: number;
}

export const createError = (message: string, status: number): ResponseError => {
  const error = new Error(message) as ResponseError;
  error.status = status;
  return error;
};
