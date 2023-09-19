import UserAccount from "./UserAccount.schema";

export const findUser = (email: string) => {
  return UserAccount.findOne({ email });
};

export const getTokenExpirationInSeconds = () => {
  const currentDate = new Date();
  const endOfDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 1,
    0,
    0,
    0,
    0
  );
  return Math.round(endOfDay.getTime() - currentDate.getTime() / 1000); // convert to seconds;
};
