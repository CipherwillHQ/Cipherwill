import Link from "next/link";
import menu from "./bottom_menu";
import SymbolicLogo from "../public/logo/SymbolicLogo";

export default function TopRow() {
  return (
    <section className="pt-10 font-medium">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-y-12 gap-x-8 xl:gap-x-12">
        <div className="col-span-2 md:col-span-4 xl:pr-8">
          <SymbolicLogo size={30} />
          <p className={`my-4`}>
            We ensure secure and seamless transfer of your data to loved ones
            around the world, creating a future where everyone's legacy is
            protected and honored.
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={"https://github.com/CipherwillHQ/Cipherwill"}
              target="_blank"
              className="hover:underline"
            >
              See our code
            </Link>
            {/* <Link
              href={"https://x.com/CipherwillHQ"}
              target="_blank"
              className="text-xs hover:bg-black/5 hover:rounded-md transition border py-2 px-4"
            >
              Follow us on X
            </Link>
            <Link
              href={"https://www.youtube.com/@CipherwillHQ?sub_confirmation=1"}
              target="_blank"
              className="text-xs hover:bg-black/5 hover:rounded-md transition border py-2 px-4"
            >
              Subscribe on YT
            </Link> */}
          </div>
        </div>

        {menu.map((column) => (
          <div key={column.title} className="lg:col-span-2">
            <p className="font-bold">{column.title}</p>

            <ul className="mt-3 space-y-2">
              {column.items.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.path}
                    className="flex hover:opacity-85 transition-all duration-200 hover:underline"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
