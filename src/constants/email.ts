export const USER_VERIFICATION_EMAIL = (name: string, code: string) => {
  return `
  <div style="text-align: center; width: 100%; height: 100%; background: #2D0D29; color: white;">
    <img src=""
    style="width: 30%"
    alt="sonarly logo">
    <h1>Hello ${name}!</h1>
    <h1>We need you to activate your Sonarly user account.</h1>
    <h2>Your code is the following: <strong style="color: #F8B527">${code}</strong></h2>
  </div>
`;
};

export const USER_VERIFICATION_EMAIL_TITLE = "SONARLY: USER ACCOUNT ACTIVATION";
