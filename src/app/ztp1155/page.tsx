"use client"

import ButtonPrimary from "@/components/button_primary";
import Card from "@/components/card";
import Container from "@/components/container";
import Progress from "@/components/progress_ztp20";
import TitlePrimary from "@/components/title_primary";
import { ChevronRightIcon, DocumentIcon } from "@heroicons/react/16/solid";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { processZTP1155CSV } from "@/libs/utilities";
import { useAppContext } from "@/components/app";
import { useRef, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { verifyZtpContractAddressExists } from "@/libs/zetrix";

export default function Home() {
  // Global state
  const { walletAddress, recipientsInfo, setRecipientsInfo, setZTPContract } = useAppContext()

  // Router
  const router = useRouter()

  // Form input
  const ztpContract = useRef<HTMLInputElement>(null)
  const filePath = useRef<HTMLInputElement>(null)

  const [isValidContract, setIsValidContract] = useState(true)
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const MAX_FILE_SIZE = 1_000_000; // 1MB

  async function handleZtpContractAddressChange(event: React.ChangeEvent<HTMLInputElement>) {
    const contractAddress = event.target.value
    if (contractAddress.trim() !== "") {
      setIsValidContract(await verifyZtpContractAddressExists(contractAddress))
    }
  };

  function handleDragStart(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragActive(true)
  }

  function handleDragEnd(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragActive(false)
  }

  function handleFileDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragActive(false)

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0]

      if (validateFile(file)) {
        processFile(file)
      }
    }
  }

  function fileChanged(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file && validateFile(file)) {
      processFile(file);
    }
  }

  function validateFile(file: File): boolean {
    // Check file format
    if (!file.name.endsWith(".csv")) {
      setErrorMessage("Invalid file format. Please upload a .csv file.");
      return false;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("File size exceeds 1MB. Please upload a smaller file.");
      return false;
    }

    setErrorMessage("");
    return true;
  }

  function processFile(file: File) {

    // Read the CSV file as text
    const reader = new FileReader()

    reader.onload = async (event) => {
      const csvData = event.target?.result as string;

      try {
        const { recipientsInfo, uniqueTokenIDs } = await processZTP1155CSV(csvData)
        setRecipientsInfo(recipientsInfo as RecipientInfo[])
        setUploadedFileName(file.name)
      } catch (error) {
        console.error('Error processing CSV:', error)
        setErrorMessage(error as string)
      }
    };

    reader.readAsText(file);
  }

  function clearFile() {
    filePath.current && (filePath.current.value = "")
    setUploadedFileName("")
    setRecipientsInfo([])
    setErrorMessage("")
  }

  function formSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault() // To avoid page refresh

    // Safety check
    if (!isValidContract || !uploadedFileName || !walletAddress) {
      return
    }

    // Update ZTP1155 Contract
    setZTPContract(ztpContract.current!.value)

    // Redirect to Approve page
    router.push("/ztp1155/approve")
  }

  return (
    <Container activeKey="ztp1155">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <TitlePrimary>Airdrop Tool</TitlePrimary>
          <p>Send ZTP-1155 tokens to multiple recipients at once</p>
        </div>
        <Progress className="mt-6" stage={1} />
        <Card className="mt-6">
          <form onSubmit={formSubmit}>
            <div>
              {/* ZTP-1155 contract input */}
              <label htmlFor="contract">Token Contract (ZTP-1155)</label>
              <p className="text-sm text-text_primary/80">Contract address of the token you want to airdrop</p>
              <div className="mt-2">
                <input
                  id="ztp20-contract"
                  name="ztp20-contract"
                  type="text"
                  className={`w-full rounded-md border px-2 py-1 bg-input_background ${isValidContract ? "border-white/10" : "border-primary_red"
                    }`}
                  ref={ztpContract}
                  onChange={handleZtpContractAddressChange}
                  required />
              </div>
              {!isValidContract && (
                <p className="text-text_red/80 text-sm mt-1">Invalid contract address</p>
              )}
            </div>
            <div className="mt-6">
              {/* CSV file input */}
              <p>Recipient List</p>
              <p className="text-sm text-text_primary/80">List of recipient addresses in CSV format. You can download the CSV template{" "}
                <Link className="text-text_red/80 hover:text-text_red" href="/template1155.csv" download="template1155.csv">here</Link>.
              </p>
              <p className="text-sm text-text_primary/80">Note: Due to the transaction size limit, it is advisable to limit your airdrop to a maximum of 100 recipients.</p>
              <div className={`${!uploadedFileName && "hidden"}`}>
                <div className="flex mt-2 space-x-2 items-center">
                  <div className="flex-1 flex rounded-md border border-white/10 bg-input_background px-2 py-1">
                    <DocumentIcon className="w-4 mr-1" />
                    {uploadedFileName ? uploadedFileName : "Not available"}
                  </div>
                  <ButtonPrimary onClick={clearFile}><TrashIcon className="w-5 mr-1" /> Remove</ButtonPrimary>
                </div>
                <p className="pt-2 text-sm text-text_primary/80">
                  {recipientsInfo.length} {recipientsInfo.length > 1 ? "addresses" : "address"} for the airdrop
                </p>
              </div>
              <div className={`${uploadedFileName && "hidden"}`}>
                <div className={`mt-2 border-2 border-dashed rounded-lg text-center ${dragActive ? "border-primary_red" : "border-white/10"}`}
                  onDragOver={handleDragStart}
                  onDragLeave={handleDragEnd}
                  onDragEnd={handleDragEnd}
                  onDrop={handleFileDrop}>
                  <CloudArrowUpIcon className="m-6 mx-auto w-16 text-text_primary/10 stroke-1" />
                  <input
                    id="file-input"
                    name="file-input"
                    type="file"
                    className="sr-only"
                    onChange={fileChanged}
                    accept=".csv"
                    ref={filePath}
                    required={uploadedFileName ? false : true} />
                  <div className="text-sm text-text_primary/80">
                    <label htmlFor="file-input" className="text-text_red/80 hover:text-text_red cursor-pointer">
                      Upload a CSV file
                    </label>
                    &nbsp;or drag and drop file here.
                    <p className="mb-6">1 MB file size limit</p>
                  </div>
                </div>
              </div>
              {errorMessage && (
                <p className="text-wrap text-text_red/80 text-sm mt-1 break-all">{errorMessage}</p>
              )}
            </div>
            <div className="mt-6 text-right border-t border-white/10 pt-2 lg:pt-4">
              {walletAddress && <ButtonPrimary type="submit">Next <ChevronRightIcon className="w-5 ml-1" /></ButtonPrimary>}
              {!walletAddress &&
                <div className="flex justify-end">
                  <div className="px-4 py-2 bg-foreground border-2 border-dashed border-primary_red shadow-md rounded-xl">Connect wallet to continue</div>
                </div>}
            </div>
          </form>
        </Card>
      </div>
    </Container>
  );
}