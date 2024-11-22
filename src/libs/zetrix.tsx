export function initiateWalletConnection(): Promise<string> {
    // console.log("Called initiateWalletConnection() function")
    return new Promise((resolve, reject) => {
        // console.log("Called initiateWalletConnection() function: Entered Promise")
        if (typeof window.zetrix !== undefined) {
            // console.log("Called initiateWalletConnection() function: Passed window.zetrix check")
            window.zetrix.authorize(
                { method: "changeAccounts" },
                (resp) => {
                    if (resp.code === 0) {
                        window.zetrix.authorize(
                            { method: "sendRandom", param: { random: "blob" } },
                            (resAuth) => {
                                if (resAuth.code === 0) {
                                    const { address } = resp.data;
                                    const { signData, publicKey } = resAuth.data;

                                    // Resolve the promise with the address
                                    resolve(address);
                                } else {
                                    reject(new Error("Failed:" + resAuth.message));
                                }
                            }
                        );
                    } else {
                        reject(new Error("Failed: " + resp.message));
                    }
                }
            );
        } else {
            reject(new Error("Zetrix wallet not found"));
        }
    });
}

export async function initiateMobileWalletConnection(isQR: boolean): Promise<string> {
    const { default: ZetrixWalletConnect } = await import("zetrix-connect-wallet-sdk");
    const options = {
        bridge: "wss://test-wscw.zetrix.com",
        qrcode: isQR,
        callMode: isQR ? "web" : ""
    }

    const zetrixWalletConnect = new ZetrixWalletConnect(options)

    // Process as promise
    return await new Promise((resolve) => {
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
                                console.log(res.data.address)
                                setTimeout(() => {
                                    resolve(res.data.address)
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
}

export async function signMobileWallet(blob: string): Promise<any> {
    const { default: ZetrixWalletConnect } = await import("zetrix-connect-wallet-sdk");
    const options = {
        bridge: "wss://test-wscw.zetrix.com",
        qrcode: false,
        callMode: "web"
    }

    const zetrixWalletConnect = new ZetrixWalletConnect(options)

    // Process as promise
    return await new Promise((resolve) => {
        // Step 1: Connect
        zetrixWalletConnect
        .signBlob({ message: blob })
        .then((res: any) => {
            if (res.code === 0) {
                setTimeout(() => {
                    resolve(res.data)
                }, 2000)
            }
        })
        .catch((error: any) => {
            console.log(error)
        })
    })
}

export function shortenZetrixAddress(address: string) {
    if (!address.startsWith("ZTX")) {
        throw new Error("Invalid Zetrix address");
    }

    const firstPart = address.slice(0, 6); // 'ZTX' + first 3 characters
    const lastPart = address.slice(-4); // Last 4 characters

    return `${firstPart}***${lastPart}`;
}

export async function verifyZtpContractAddressExists(tokenContractAddress: string) {
    const url = process.env.NEXT_PUBLIC_MICROSERVICE_BASE_URL + "/ztx/contract/query-address"
    const token = process.env.NEXT_PUBLIC_MICROSERVICE_AUTH_TOKEN

    const input = {
        address: tokenContractAddress,
        method: "contractInfo",
        inputParameters: {}
    };

    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(input),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })

    if (response.ok) {
        return true;
    } else {
        return false;
    }
}

export async function generateApproveBlob(txInitiator: string, tokenContractAddress: string, airdropContractAddress: string, amount: string) {
    const url = process.env.NEXT_PUBLIC_MICROSERVICE_BASE_URL + "/ztx/ztp20/generate-blob/approve"
    const token = process.env.NEXT_PUBLIC_MICROSERVICE_AUTH_TOKEN

    const input = {
        txInitiator: txInitiator,
        sourceAddress: txInitiator,
        contractAddress: tokenContractAddress,
        method: "approve",
        spender: airdropContractAddress,
        value: amount,
    };

    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(input),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    const result = await response.json()

    if (response.ok) {
        return {
            blob: result.object.blob,
            hash: result.object.hash,
        }
    } else {
        return {
            errorMessage: result.messages[0].message
        }
    }
}

export async function generateBulkTransferBlob(txInitiator: string, tokenContractAddress: string, recipientsInfo: Array<RecipientInfo>) {
    const url = process.env.NEXT_PUBLIC_MICROSERVICE_BASE_URL + "/ztx/contract/generate-blob"
    const token = process.env.NEXT_PUBLIC_MICROSERVICE_AUTH_TOKEN
    const airdropContractKey = process.env.NEXT_PUBLIC_AIRDROP_CONTRACT_KEY

    let input = {
        tokenContractAddress: tokenContractAddress,
        recipientsInfo: recipientsInfo,
        ownerAddress: txInitiator
    };

    const airdropInput = {
        method: "bulkTransfer",
        contractKey: airdropContractKey!,
        inputParameters: input,
        txInitiator: txInitiator,
        sourceAddress: txInitiator
    };

    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(airdropInput), // TODO: To consider block limit of 612Kb
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })

    if (response.ok) {
        const result = await response.json()
        return {
            blob: result.object.blob,
            blobHash: result.object.hash,
        }
    } else {
        return {}
    }
}

export async function generateBulkTransferZetrixBlob(txInitiator: string, recipientsInfo: Array<RecipientInfo>) {
    const url = process.env.NEXT_PUBLIC_MICROSERVICE_BASE_URL + "/ztx/contract/generate-blob"
    const token = process.env.NEXT_PUBLIC_MICROSERVICE_AUTH_TOKEN
    const contractKey = process.env.NEXT_PUBLIC_AIRDROP_CONTRACT_KEY

    let totalRequiredZetrix = 0;
    for (let i = 0; i < recipientsInfo.length; i += 1) {
        totalRequiredZetrix += Number(recipientsInfo[i].amount)
    }

    const airdropZetrixInput = {
        txInitiator: txInitiator,
        contractKey: contractKey,
        method: "bulkTransferNative",
        inputParameters: {
            recipientsInfo: recipientsInfo
        },
        value: totalRequiredZetrix,
        sourceAddress: txInitiator
    }

    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(airdropZetrixInput),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })

    if (response.ok) {
        const result = await response.json()
        return {
            blob: result.object.blob,
            blobHash: result.object.hash,
        }
    } else {
        return {}
    }
}

export async function generateApproveBlobZTP1155(txInitiator: string, tokenContractAddress: string, airdropContractAddress: string) {
    const url = process.env.NEXT_PUBLIC_MICROSERVICE_BASE_URL + "/ztx/contract/generate-blob-address"
    const token = process.env.NEXT_PUBLIC_MICROSERVICE_AUTH_TOKEN

    const input = {
        txInitiator: txInitiator,
        sourceAddress: txInitiator,
        address: tokenContractAddress,
        method: "setApprovalForAll",
        inputParameters: {
            operator: airdropContractAddress,
            approved: true
        }
    };

    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(input),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    const result = await response.json()

    if (response.ok) {
        return {
            blob: result.object.blob,
            hash: result.object.hash,
        }
    } else {
        return {
            errorMessage: result.messages[0].message
        }
    }
}

export async function generateBulkTransferBlobZTP1155(txInitiator: string, tokenContractAddress: string, recipientsInfo: Array<RecipientInfo>) {
    const url = process.env.NEXT_PUBLIC_MICROSERVICE_BASE_URL + "/ztx/contract/generate-blob"
    const token = process.env.NEXT_PUBLIC_MICROSERVICE_AUTH_TOKEN
    const airdropContractKey = process.env.NEXT_PUBLIC_AIRDROP_CONTRACT_KEY

    let input = {
        tokenContractAddress: tokenContractAddress,
        recipientsInfo: recipientsInfo,
        ownerAddress: txInitiator
    };

    const airdropInput = {
        method: "bulkTransfer1155",
        contractKey: airdropContractKey!,
        inputParameters: input,
        txInitiator: txInitiator,
        sourceAddress: txInitiator
    };

    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(airdropInput), // TODO: To consider block limit of 612Kb
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })

    if (response.ok) {
        const result = await response.json()
        return {
            blob: result.object.blob,
            blobHash: result.object.hash,
        }
    } else {
        return {}
    }
}

export function sign(blob: string): Promise<any> {
    // console.log("Called sign function");
    return new Promise((resolve, reject) => {
        // console.log("Entered Promise in sign");
        if (typeof window.zetrix !== undefined) {
            window.zetrix.signMessage({ message: blob }, function (result) {
                if (result.code === 0) {
                    resolve(result.data)
                } else {
                    reject({})
                }
            });
        } else {
            reject({})
        }
    })
}



export async function submitTx(blob: string, signBlob: string, publicKey: string, hash: string) {
    const url = process.env.NEXT_PUBLIC_MICROSERVICE_BASE_URL + "/ztx/tx/submit"
    const token = process.env.NEXT_PUBLIC_MICROSERVICE_AUTH_TOKEN;

    const submitInput = {
        blob: blob,
        listSigner: [{
            signBlob: signBlob,
            publicKey: publicKey
        }],
        hash: hash
    };

    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(submitInput),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })

    const result = await response.json()
    if (response.ok) {
        return {
            result: true,
            txHash: result.object.hash,
            error: ""
        };
    } else {
        return {
            result: false,
            txHash: {},
            error: result.messages[0].message ?? "Unknown error"
        };
    }
}

export async function getTokenBalance(tokenContractAddress: string, accountAddress: string, tokenId?: string) {
    const url = process.env.NEXT_PUBLIC_MICROSERVICE_BASE_URL + "/ztx/contract/query-address"
    const token = process.env.NEXT_PUBLIC_MICROSERVICE_AUTH_TOKEN;
    let contractQuery = null;

    if (tokenId) {
        contractQuery = {
            address: tokenContractAddress,
            method: "balanceOf",
            inputParameters: {
                owner: accountAddress,
                id: tokenId
            }
        };
    } else {
        contractQuery = {
            address: tokenContractAddress,
            method: "balanceOf",
            inputParameters: {
                address: accountAddress,
            }
        };
    }

    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(contractQuery),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })

    const result = await response.json()
    if (response.ok) {
        const parsedValue = JSON.parse(result.object.result.value);
        const balance = parseFloat(parsedValue.balance);

        return {
            result: balance,
            error: ""
        };
    } else {
        return {
            result: 0,
            error: result.messages[0].message ?? "Unknown error when querying for token balance"
        };
    }
}
