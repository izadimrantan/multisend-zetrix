"use client"

import ButtonPrimary from "@/components/button_primary";
import ButtonSecondary from "@/components/button_secondary";
import Card from "@/components/card";
import Container from "@/components/container";
import Progress from "@/components/progress_ztp20";
import TitlePrimary from "@/components/title_primary";
import { useAppContext } from "@/components/app";
import Link from "next/link";
import { useEffect, useState } from "react";
import { generateBulkTransferBlob, sign, submitTx } from "@/libs/zetrix";
import { useRouter } from "next/navigation";
import Spinner from "@/components/spinner";
import { ChevronDoubleLeftIcon } from "@heroicons/react/16/solid";

export default function Send() {
  // Global state
  const { walletAddress, recipientsInfo, ztp20Contract } = useAppContext()

  const [totalAirdrop, setTotalAirdrop] = useState<number>(0)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [processing, setProcessing] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  // Router
  const router = useRouter()

  useEffect(() => {
    totalAmount == 0 && calculate()
  }, [])

  function backToHomePage() {
    router.push("/")
  }

  function calculate() {
    // Imformation from previous form
    let totalAmt = 0

    // Calculate total amount
    for (const recipient of recipientsInfo) {
      totalAmt += parseInt(recipient.amount)
    }

    setTotalAmount(totalAmt)
    setTotalAirdrop(recipientsInfo.length)
  }

  async function sendTransaction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault() // To avoid page refresh
    setProcessing(true)

    // Generate Blob
    let { blob, blobHash } = await generateBulkTransferBlob(walletAddress, ztp20Contract, recipientsInfo)
    if (blob) {
      // Get signature
      sign(blob)
        .then(async signData => {
          // Submit transaction
          let { result, txHash, error } = await submitTx(blob, signData.signData, signData.publicKey, blobHash)
          setProcessing(false)
          error && setError(error)
          result && router.push(`/ztp20/complete?tx=${txHash}`)
        })
        .catch(error => {
          setProcessing(false)
        })
    } else {
      setProcessing(false)
    }
  }

  return (
    <Container activeKey="ztp20">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <TitlePrimary>Airdrop Tool</TitlePrimary>
          <p>Send ZTP-20 tokens to multiple recipients at once</p>
        </div>
        <Progress className="mt-6" stage={3} />
        <Card className="mt-6">
          <div>
            <div>
              {/* ZTP-20 contract input */}
              <label htmlFor="contract">Summary</label>
              <div className="overflow-x-auto py-6">
                <table className="w-full text-sm">
                  <thead className="text-left border-b border-white/10">
                    <tr>
                      <th className="py-1 w-full">Descriptions</th>
                      <th className="py-1 pl-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1">Token Contract (ZTP-20)</td>
                      <td className="py-1 pl-2">{ztp20Contract}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Total Airdrop Address</td>
                      <td className="py-1 pl-2">{totalAirdrop}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Total Airdrop Amount</td>
                      <td className="py-1 pl-2">{totalAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <form onSubmit={sendTransaction}>
              <div className="flex items-center space-x-2">
                <input
                  id="tnc"
                  name="tnc"
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/10 bg-input_background text-primary_red focus:primary_red"
                  required
                  disabled={processing}
                ></input>
                <label htmlFor="tnc" className="w-full">
                  I hereby agree to the <Link href="/terms" className="text-text_red/80 hover:text-text_red" target="_blank">Terms of Use</Link>
                </label>
              </div>
              {error && <p className="mt-6 text-wrap text-text_red/80 text-sm break-all">Error: {error}</p>}
              <div className="mt-6 text-right border-t border-white/10 pt-2 lg:pt-4">
                <div className="flex justify-between items-center">
                  <ButtonSecondary onClick={backToHomePage}><ChevronDoubleLeftIcon className="w-5 h-5" /></ButtonSecondary>
                  {!processing && <ButtonPrimary type="submit">Confirm & Send</ButtonPrimary>}
                  {processing &&
                    <div className="flex justify-end">
                      <div className="flex items-center px-4 py-2 bg-foreground border-2 border-dashed border-primary_red shadow-md rounded-xl"><Spinner className="mr-2" />Processing..</div>
                    </div>}
                </div>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </Container>
  );
}