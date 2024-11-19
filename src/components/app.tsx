"use client"

import { getLocalStorageItem } from "@/libs/core";
import { createContext, useContext, useEffect, useState } from "react";

// Context is a way to manage state globally.
const Context = createContext<any>(null)

export default function AppContext(props: any) {
    useEffect(() => {
        // Load application context from storage
        setWalletAddress(getLocalStorageItem("walletAddress", ""))
    }, [])

    // List of state that need to be use globally
    const [walletAddress, setWalletAddress] = useState<string>("")

    // Use in Airdrop form
    const [recipientsInfo, setRecipientsInfo] = useState<RecipientInfo[]>([]);
    const [ztp20Contract, setZTP20Contract] = useState<string>("");
    const [ztpContract, setZTPContract] = useState<string>("");

    // Set value for context
    const contextValue = {
        walletAddress,
        setWalletAddress,
        recipientsInfo,
        setRecipientsInfo,
        ztp20Contract,
        setZTP20Contract,
        ztpContract,
        setZTPContract
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