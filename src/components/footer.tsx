import Link from "next/link";

export default function Footer() {
  const footerList = [
    { title: "Terms of Use", key: "terms", link: "/terms" },
    { title: "Zetrix", key: "zetrix", link: "https://zetrix.com" },
  ];

  return (
    <div className="mt-6">
      <div className="flex items-center mx-auto px-4 md:px-8 lg:px-12 lg:max-w-7xl py-2 my-4 text-text_secondary text-xs md:text-sm border-t border-white/10">
        <div className="text-lg md:text-xl text-text_primary font-bold tracking-wide">
          Multisend
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap px-4">
            {footerList.map((item) => {
              return (
                <Link
                  key={item.key}
                  className="py-1 px-2 hover:text-text_red"
                  href={item.link}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="left-full text-xs p-1 bg-foreground rounded border border-white/10">
          V 1.0.5
        </div>
      </div>
    </div>

  );
}
