export default function extractDomainName(hostname: string) {
  if(hostname.startsWith("http://localhost:")){
    return "localhost";
  }else if(hostname.startsWith("https://www.cipherwill.com")){
    return "cipherwill.com";
  }else if(hostname.startsWith("https://preview.cipherwill.com")){
    return "cipherwill.com";
  }else{
    return "invalid";
  }
}