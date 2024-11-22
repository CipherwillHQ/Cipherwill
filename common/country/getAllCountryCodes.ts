import iso3311a2 from "iso-3166-1-alpha-2";
export default function getAllCountryCodes() {
  const data = iso3311a2.getData();

  return Object.keys(data).map((key) => {
    return {
      code: key,
      name: data[key],
    };
  });
}