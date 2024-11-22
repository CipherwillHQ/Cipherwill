const maskEmail = (email: string) => {
  if (!email) return "";
  return email.replace(/(\w{3})[\w.-]+@([\w.]+\w)/, "$1***@$2");
};
export default maskEmail;
