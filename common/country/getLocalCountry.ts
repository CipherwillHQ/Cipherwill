import { getCountryForTimezone } from "countries-and-timezones";

export default function getLocalCountry() {
  const country = getCountryForTimezone(
    Intl.DateTimeFormat().resolvedOptions().timeZone 
  );
  if(!country) {
    return "US";
  }
  return country.id;
}
