import { NotionAPI } from "notion-client";

(async ()=>{
  const notion = new NotionAPI();
    const id = "23f6d63626188021a7f6c53e8651252f"; // Replace with your actual blog post ID\
    const recordMap = await notion.getPage(id);
    console.log(`Fetched record map for post ID: ${id}`, recordMap);
    
})();