import Link from "next/link";
import menu from "./bottom_menu";
import SymbolicLogo from "../public/logo/SymbolicLogo";

export default function TopRow() {
  return (
    <section className="pt-10 font-medium">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-y-12 gap-x-8 xl:gap-x-12">
        <div className="col-span-2 md:col-span-4 xl:pr-8">
          <SymbolicLogo overrideTheme="dark" size={30} />
          <p className={`text-white/75 my-4`}>
            We ensure secure and seamless transfer of your data to loved ones
            around the world, creating a future where everyone's legacy is
            protected and honored.
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={"https://x.com/CipherwillHQ"}
              target="_blank"
              className="text-sm text-white hover:bg-white/10 border py-2 px-4 rounded-full"
            >
              Follow us on X
            </Link>
            <Link
              href={"https://www.youtube.com/@CipherwillHQ?sub_confirmation=1"}
              target="_blank"
              className="text-sm text-white hover:bg-white/10 border py-2 px-4 rounded-full"
            >
              Subscribe on YT
            </Link>
          </div>
        </div>

        {menu.map((column) => (
          <div key={column.title} className="lg:col-span-2">
            <p className="text-xl font-semibold">{column.title}</p>

            <ul className="mt-6 space-y-2">
              {column.items.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.path}
                    className="flex text-white/75 hover:text-white transition-all duration-200 hover:underline"
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
