"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [toc, setToc] = useState<TocItem[]>([]);

  useEffect(() => {
    const elements = document.querySelectorAll(".blog-content h2, .blog-content h3");
    const tocItems: TocItem[] = [];

    elements.forEach((el, index) => {
      const text = el.textContent || "";
      // Create an ID if it doesn't exist
      const id = el.id || text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || `toc-${index}`;
      el.id = id;

      tocItems.push({
        id,
        text,
        level: el.tagName === "H2" ? 2 : 3,
      });
    });

    const timer = setTimeout(() => {
      setToc(tocItems);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (toc.length === 0) {
    return null;
  }

  return (
    <div className="my-8 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
      <ul className="space-y-1">
        {toc.map((item) => (
          <li
            key={item.id}
            style={{ marginLeft: item.level === 3 ? "2rem" : "0" }}
          >
            <a
              href={`#${item.id}`}
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline text-base"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
