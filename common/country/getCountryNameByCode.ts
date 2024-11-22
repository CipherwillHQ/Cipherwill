import iso3311a2  from "iso-3166-1-alpha-2";
export default function getCountryNameByCode(countryCode: string) {
  const data = iso3311a2.getData();
  return data[countryCode];
}
