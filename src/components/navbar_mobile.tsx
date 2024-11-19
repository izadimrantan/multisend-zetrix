import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function NavbarMobile(props: any) {
  return (
    <div className="block md:hidden">
      <Transition show={props.sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={props.setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* Block background and make it tinted black */}
            <div className="fixed inset-0 bg-background/90" />
          </Transition.Child>
          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-28 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  {/* Close button */}
                  <div className="absolute left-full p-4">
                    <button onClick={() => props.setSidebarOpen(false)}>
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex grow flex-col ring-1 ring-white/10 bg-foreground">
                  <div className="p-4 text-xl font-bold tracking-wide">
                    Multisend
                  </div>
                  {/* Navbar items here */}
                  <nav className="mt-2">
                    {/* Loop each nav list */}
                    <ul>
                      {props.itemList.map((item: any) => {
                        return (
                          <li className="" key={item.key}>
                            <Link
                              key={item.key}
                              className={`ml-3 px-4 py-2 flex font-medium hover:text-text_red ${props.activeKey == item.key
                                ? "text-text_red font-bold underline underline-offset-8 decoration-4"
                                : "text-text_secondary"
                                }`}
                              href={item.link}
                            >
                              {item.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
