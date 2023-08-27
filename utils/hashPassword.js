import bcrypt from "bcrypt";
export default async function hashPassword(userPassword) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userPassword, salt);
  return hashedPassword;
}
