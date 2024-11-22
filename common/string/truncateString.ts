// function to only return 10 characters of the string and add ... at the end
export default function truncateString(str, length) {
  if (str.length <= length) {
    return str;
  }
  return str.substring(0, length) + "...";
}
