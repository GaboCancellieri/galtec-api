export const MISSING_REQUIRED_FIELDS_ERROR = {
  status: "BAD REQUEST",
  code: 400,
  message: "Missing required fields.",
};

export const MISSING_REQUIRED_PARAMETERS_ERROR = {
  status: "BAD REQUEST",
  code: 400,
  message: "Missing required parameters.",
};

export const SERVER_ERROR_RESPONSE = (error: any) => {
  return {
    status: "Error",
    code: 500,
    message: error.message,
  };
};

export const SUCCESSFUL_RESPONSE_WITH_DATA = (
  data: any,
  code: number = 200
) => {
  return {
    status: "OK",
    code,
    data,
  };
};

export const UNAUTHORIZED_ERROR = (error: any) => {
  return {
    status: "Error",
    code: 401,
    message: error.message,
  };
};

export const FORBIDENN_ACTION_ERROR = (error: any) => {
  return {
    status: "Error",
    code: 403,
    message: error.message,
  };
};
