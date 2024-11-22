"use client";

import Link from "next/link";
import { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import NavbarMobile from "./navbar_mobile";
import ButtonPrimary from "./button_primary";
import { initiateWalletConnection, shortenZetrixAddress, initiateMobileWalletConnection } from "@/libs/zetrix";
import LogoDark from "@/icons/logo_dark";
import { useAppContext } from "./app";
import { setLocalStorageItem, removeLocalStorageItem } from "@/libs/core";
import { ChevronDownIcon, UserIcon } from "@heroicons/react/16/solid";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { isMobileCheck, isChromeCheck } from "@/libs/utilities";

export default function Navbar(props: any) {
  // Global state
  const { walletAddress, setWalletAddress } = useAppContext()

  // Router
  const router = useRouter()

  // Global context
  const activeKey = props.activeKey;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navbar button list
  const navbarList = [
    { title: "ZTP-20", key: "ztp20", link: "/" },
    { title: "ZTP-1155", key: "ztp1155", link: "/ztp1155" },
    { title: "Zetrix", key: "zetrix", link: "/zetrix" },
    { title: "Terms of Use", key: "terms", link: "/terms" },
  ];

  function disconnectWallet() {
    removeLocalStorageItem("walletAddress")
    setWalletAddress("")

    router.push("/")
  }

  function connectWallet() {
    // if is mobile phone
    if (isMobileCheck()) {
      initiateMobileWalletConnection(false)
        .then(address => {
          if (address) {
            // Update to global context
            setWalletAddress("ZTX3YN7cVM1eUoESMB1DpPigd4da416B7meoC")

            // Store address
            setLocalStorageItem("walletAddress", "ZTX3YN7cVM1eUoESMB1DpPigd4da416B7meoC")
          }
        })
    }
    // if Firefox or any non-chromium browser
    else if (!isChromeCheck()) {
      initiateMobileWalletConnection(true)
        .then(address => {
          if (address) {
            // Update to global context
            setWalletAddress(address)

            // Store address
            setLocalStorageItem("walletAddress", address)
          }
        })
    }
    // if chrome extension 
    else {
      if (typeof window !== undefined && window.zetrix) {
        initiateWalletConnection()
          .then(address => {
            if (address) {
              // Update to global context
              setWalletAddress(address)

              // Store address
              setLocalStorageItem("walletAddress", address)
            }
          })
          .catch((error) => { console.error(error.message) });
      } else {
        console.error("Zetrix wallet not found")
      }
    }
  }

  return (
    <div className="flex pt-4 px-4 md:px-8 lg:px-12">
      <button
        className="block md:hidden mr-4"
        onClick={() => setMobileMenuOpen(true)}
      >
        <Bars3Icon className="w-5 h-5" />
      </button>
      {/* Mobile Menu */}
      <NavbarMobile
        sidebarOpen={mobileMenuOpen}
        setSidebarOpen={setMobileMenuOpen}
        itemList={navbarList}
        activeKey={activeKey}
      />
      <div className="h-12 flex w-full items-center">
        <Link className="inline-flex items-center" href="/">
          <LogoDark className="w-8 h-8 mr-2" />
          <div className="hidden md:block text-xl font-bold tracking-wide">Multisend</div>
        </Link>
        <nav className="px-8 space-x-6 hidden md:block">
          {/* Loop each nav list */}
          {navbarList.map((item) => {
            return (
              <Link
                key={item.key}
                className={`font-medium hover:text-text_red ${activeKey == item.key
                  ? "text-text_red font-bold underline underline-offset-8 decoration-4"
                  : "text-text_secondary"
                  }`}
                href={item.link}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="flex-1"></div>
        {walletAddress &&
          <Menu>
            <MenuButton as="div">
              {({ active }) =>
                <ButtonPrimary onClick={() => { }}>
                  {shortenZetrixAddress(walletAddress)}
                  <ChevronDownIcon className="w-5 ml-1" />
                </ButtonPrimary>}
            </MenuButton>
            <MenuItems anchor="bottom end" transition className="transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0">
              <div className="mt-2 px-4 py-2 bg-foreground border border-primary_red shadow-md rounded-xl">
                <button type="button" className="flex items-center" onClick={disconnectWallet}><UserIcon className="w-4 mr-2" /> Disconnect</button>
              </div>
            </MenuItems>
          </Menu>
        }
        {!walletAddress && <ButtonPrimary onClick={connectWallet}>Connect Wallet</ButtonPrimary>}
      </div>
    </div>
  );
}
