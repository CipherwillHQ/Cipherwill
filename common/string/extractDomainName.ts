export default function extractDomainName(hostname: string) {
  var host = hostname;
  host = host.replace(/^www\./i, "");
  host = host.replace(/(\.[a-z]{2,3})*\.[a-z]{2,3}$/i, "");
  return host;
}
