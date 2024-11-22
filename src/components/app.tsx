"use client"

import { getLocalStorageItem } from "@/libs/core";
import { createContext, useContext, useEffect, useState } from "react";
import { isChromeCheck, isMobileCheck } from "@/libs/utilities";

// Context is a way to manage state globally.
const Context = createContext<any>(null)

export default function AppContext(props: any) {
    // List of state that need to be use globally
    const [walletAddress, setWalletAddress] = useState<string>("")

    // Use in Airdrop form
    const [recipientsInfo, setRecipientsInfo] = useState<RecipientInfo[]>([]);
    const [ztp20Contract, setZTP20Contract] = useState<string>("");
    const [ztpContract, setZTPContract] = useState<string>("");

    const [isChrome, setIsChrome] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        // Load application context from storage
        setWalletAddress(getLocalStorageItem("walletAddress", ""))
        setIsChrome(isChromeCheck())
        setIsMobile(isMobileCheck())
    }, [])
    
    // Set value for context
    const contextValue = {
        walletAddress,
        setWalletAddress,
        recipientsInfo,
        setRecipientsInfo,
        ztp20Contract,
        setZTP20Contract,
        ztpContract,
        setZTPContract,
        isChrome,
        setIsChrome,
        isMobile,
        setIsMobile
    }

    return (
        <Context.Provider value={contextValue}>
            <div className="min-h-screen">{props.children}</div>
        </Context.Provider>
    );
}

export function useAppContext() {
    return useContext(Context)
}