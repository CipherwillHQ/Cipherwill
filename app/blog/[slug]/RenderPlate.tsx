"use client";

import dynamic from "next/dynamic";
import { gilroy, PlayfairDisplay } from "@/app/font";

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then((m) => m.Code)
);
const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
);
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);
// const Pdf = dynamic(
//   () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
//   {
//     ssr: false,
//   }
// );
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
);

// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css";

// used for code syntax highlighting (optional)
import "prismjs/themes/prism-tomorrow.css";

// used for rendering equations (optional)
import "katex/dist/katex.min.css";

import { NotionRenderer } from "react-notion-x";
import Image from "next/image";
import Link from "next/link";

const customcss = `
.notion-collection-page-properties{
    display: none;
}
.notion-full-width {
  padding:8px;
}

@media (max-width: 800px) {
  .notion-full-width {
    padding:20px;
  }
}

.notion-link {
  color: #0042e8;
  font-weight: 500;
}
  .notion {
    font-size: 1.2rem;
    line-height: 1.75rem;
    color: #000;
    font-family: ${gilroy.style.fontFamily};
    font-weight: 500;
  }
`;

export default function RenderPlate({ recordMap }) {
  return (
    <>
      <style>{customcss}</style>
      <NotionRenderer
        fullPage={false}
        recordMap={recordMap}
        rootDomain="https://www.cipherwill.com"
        mapPageUrl={(pageId) => {
          return "/i/blog/" + pageId.replaceAll("-", "");
        }}
        className="text-black dark:text-white text-3xl"
        components={{
          nextImage: Image,
          nextLink: CustomLink,
          Link: CustomLink,
          Code,
          Collection,
          Equation,
          Modal,
          // Pdf,
        }}
      />
    </>
  );
}

function CustomLink(...props: any) {
  const link = props[0];
  return (
    <Link
      href={link.href || ""}
      rel={`nofollow noopener`}
      className="underline text-blue-500"
    >
      {link.children.props.children}
    </Link>
  );
}
