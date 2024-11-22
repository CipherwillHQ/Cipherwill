export default function getFlagURL(countryCode: string) {
  return `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;
}
