"use client"

import TitlePrimary from "@/components/title_primary"
import Card from "@/components/card"
import ButtonPrimary from "@/components/button_primary"
// import ZetrixWalletConnect from "zetrix-connect-wallet-sdk"
import dynamic from 'next/dynamic';

export default function Test() {
    const ZetrixConnectWallet = dynamic(
        () => import('zetrix-connect-wallet-sdk'),
        { ssr: false } // Ensures it only loads on the client side
    );

    function connectWalletQR() {
        console.log("connectWalletQR")
        _connectWallet(true)
    }

    function connectWalletChrome() {
        console.log("connectWalletChrome")

        if (window.zetrix) {
            window.zetrix.getAccount((res) => {
                const addres = res.data.address;
                console.log(addres)
            });
        }
    }

    function connectWalletMobileBrowser() {
        console.log("connectWalletMobileBrowser")
        _connectWallet(false)
    }

    async function _connectWallet(isQR: boolean) {
        try {
            const { default: ZetrixWalletConnect } = await import("zetrix-connect-wallet-sdk");

            const options = {
                bridge: "wss://test-wscw.zetrix.com",
                qrcode: isQR,
                callMode: isQR ? "web" : ""
            }

            const zetrixWalletConnect = new ZetrixWalletConnect(options)

            // Process as promise
            await new Promise((resolve) => {
                // Step 1: Connect
                zetrixWalletConnect
                    .connect()
                    .then((res: any) => {
                        if (res.code === 0) {
                            // Step 2: Authenticate
                            zetrixWalletConnect
                                .auth()
                                .then((res: any) => {
                                    if (res.code === 0) {
                                        // Step 3: Get address
                                        const address = res.data.address
                                        console.log(address)

                                        setTimeout(() => {
                                            resolve(address)
                                        }, 2000)
                                    }
                                })
                                .catch((error: any) => {
                                    console.log(error)
                                })
                        }
                    })
                    .catch((error: any) => {
                        console.log(error)
                    })
            })
        } catch (error: any) {
            console.log(error.message)
        }
    }

    return (
        <div className="mx-auto px-4 md:px-8 lg:px-12 w-full lg:max-w-7xl">
            <TitlePrimary>Test Page</TitlePrimary>
            <Card className="mt-4 space-y-4">
                <div>
                    <ButtonPrimary onClick={connectWalletQR}>Connect Wallet - QR</ButtonPrimary>
                </div>
                <div>
                    <ButtonPrimary onClick={connectWalletChrome}>Connect Wallet - Chrome</ButtonPrimary>
                </div>
                <div>
                    <ButtonPrimary onClick={connectWalletMobileBrowser}>Connect Wallet - Mobile Browser</ButtonPrimary>
                </div>
            </Card>
        </div>
    );
}
