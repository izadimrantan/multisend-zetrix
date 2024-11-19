"use client"

import ButtonPrimary from "@/components/button_primary";
import ButtonSecondary from "@/components/button_secondary";
import Card from "@/components/card";
import Container from "@/components/container";
import Progress from "@/components/progress_ztp20";
import TitlePrimary from "@/components/title_primary";
import { useAppContext } from "@/components/app";
import { useState } from "react";
import { ChevronRightIcon, ChevronDoubleLeftIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { generateApproveBlob, sign, submitTx } from "@/libs/zetrix"
import Spinner from "@/components/spinner";

export default function Approve() {
  // Global state
  const { walletAddress, recipientsInfo, ztp20Contract } = useAppContext()

  // Local state
  const [approved, setApproved] = useState<boolean>(false)
  const [processing, setProcessing] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Router
  const router = useRouter()

  async function reqestApproval() {
    if (approved || processing || !walletAddress)
      return

    setProcessing(true)

    // Imformation from previous form
    let totalAmount = 0

    // Calculate total amount
    for (const recipient of recipientsInfo) {
      totalAmount += parseInt(recipient.amount)
    }

    // Generate Blob
    let { blob, hash, errorMessage } = await generateApproveBlob(walletAddress, ztp20Contract, process.env.NEXT_PUBLIC_AIRDROP_CONTRACT_ADDRESS!, totalAmount.toString())
    if (blob) {
      // Get signature
      sign(blob)
        .then(async signData => {
          // Submit transaction
          let { result } = await submitTx(blob, signData.signData, signData.publicKey, hash)
          result && setApproved(true)
          setProcessing(false)
        })
        .catch(error => {
          setProcessing(false)
        })
    } else {
      setErrorMessage(errorMessage)
      setProcessing(false)
    }
  }

  function next() {
    // Redirect to Send page
    router.push("/ztp20/send")
  }

  function backToHomePage() {
    router.push("/")
  }

  return (
    <Container activeKey="ztp20">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <TitlePrimary>Airdrop Tool</TitlePrimary>
          <p>Send ZTP-20 tokens to multiple recipients at once</p>
        </div>
        <Progress className="mt-6" stage={2} />
        <Card className="mt-6">
          <div>
            <div>
              {/* ZTP-20 contract input */}
              <label htmlFor="contract">Approval Required</label>
              <p className="text-sm text-text_primary/80">Please provide approval in your wallet to proceed.</p>
              <p className="text-sm mt-4">Why is this important?</p>
              <p className="text-sm text-text_primary/80">The multisend contract requires your approval to transfer tokens on your behalf, based on the amount specified for the recipient.</p>
              <div className="pt-6">
                {!approved && !processing && <ButtonPrimary onClick={reqestApproval}>Approve Now</ButtonPrimary>}
                {processing && <div className="flex items-center w-fit px-4 py-2 bg-foreground border-2 border-dashed border-primary_red shadow-md rounded-xl"><Spinner className="mr-2" />Waiting for approval..</div>}
                {approved && <div className="w-fit px-4 py-2 bg-foreground border-2 border-dashed border-primary_red shadow-md rounded-xl">Done</div>}
              </div>
              {errorMessage && <p className="mt-6 text-wrap text-text_red/80 text-sm break-all">Error: {errorMessage}</p>}
            </div>
          </div>
          <div className="mt-6 text-right border-t border-white/10 pt-2 lg:pt-4">
            <div className="flex justify-between items-center">
              <ButtonSecondary onClick={backToHomePage}><ChevronDoubleLeftIcon className="w-5 h-5" /></ButtonSecondary>
              {!approved && (
                <div className="px-4 py-2 bg-foreground border-2 border-dashed border-primary_red shadow-md rounded-xl">
                  Approve to proceed
                </div>
              )}
              {approved && (
                <ButtonPrimary onClick={next}>
                  Next <ChevronRightIcon className="w-5 ml-1" />
                </ButtonPrimary>
              )}
            </div>
          </div>
        </Card>
      </div >
    </Container >
  );
}