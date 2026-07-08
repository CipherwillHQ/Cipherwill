import menu from "./bottom_menu";
import LinkToTheTop from "../public/LinkToTheTop";

export default function LinkColumns() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-10 gap-x-8">
      {menu.map((column) => (
        <div key={column.title}>
          <p className="text-sm font-semibold uppercase tracking-wider text-cream/50">
            {column.title}
          </p>
          <ul className="mt-4 space-y-2.5">
            {column.items.map((link) => (
              <li key={link.title}>
                <LinkToTheTop
                  href={link.path}
                  className="text-base text-cream/70 hover:text-cream hover:translate-x-0.5 transition-all duration-200 inline-block"
                >
                  {link.title}
                </LinkToTheTop>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
