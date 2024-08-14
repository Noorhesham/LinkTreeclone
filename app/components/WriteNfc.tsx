"use client";
import React, { useState } from "react";
import Button from "./Button";
import { toast } from "react-toastify"; // Import icons
import AnimatedImage from "./AnimatedImage";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import BabySpinner from "./BabySpinner";
import cookies from "js-cookie";
const NFCWriter = ({ userName }: { userName?: string }) => {
  const [isNFCWritten, setIsNFCWritten] = useState(false);
  const [scanningStatus, setScanningStatus] = useState<"success" | "error" | "" | "scanning">(""); // For status icon
  console.log(userName);
  const scanAndWriteToNFC = async () => {
    if (isNFCWritten) {
      toast.info("NFC card has already been written to.");
      return;
    }

    setScanningStatus(""); // Reset status
    toast.info("Scanning for NFC tags...");
    setScanningStatus("scanning"); // Set status to scanning
    try {
      if ("NDEFReader" in window) {
        const urlRecord = {
          recordType: "url",
          data: `https://vega-nfc.vercel.app/${cookies.get("NEXT_LOCALE")||"en"}/profile/${userName}`,
        };

        const ndef = new (window as any).NDEFReader();
        await ndef.write({ records: [urlRecord] });
        const abortController = new AbortController();
        await ndef.scan({ signal: abortController.signal });

        toast.success("NFC written successfully!");
        setScanningStatus("success"); // Set status to success
        setIsNFCWritten(true); // Lock the NFC card
        await new Promise((r) => setTimeout(r, 3000));
        abortController.abort();
      }
    } catch (error: any) {
      console.error("Error scanning NFC card", error);
      toast.error(`Failed to scan NFC card. Error: ${error.message}`);
      setScanningStatus("error"); // Set status to error
    }
  };

  return (
    <div className="flex flex-col  items-center lg:flex-row   gap-2 h-full ml-5 mt-3 w-full lg:w-[60%]">
      <div>
        <AnimatedImage className="mx-auto w-[24rem]" data={"nfc.json"} />
      </div>
      <div className="flex flex-col items-center mb-2 lg:items-start gap-2">
        <div className="flex flex-col  items-center gap-5">
          <Button disabled={Boolean(userName)} text="Scan and Write to NFC" onClick={scanAndWriteToNFC} />
          {!userName && <p className=" text-base text-muted-foreground">TO WRITE TO NFC YOU MUST ADD USERNAME TO YOUR LINK</p>}
          {scanningStatus === "success" && (
            <CheckCircleIcon className="w-6 h-6 text-green-500" /> // Success icon
          )}
          {scanningStatus === "error" && (
            <XCircleIcon className="w-6 h-6 text-red-500" /> // Error icon
          )}
          {scanningStatus === "scanning" && (
            <p className="text-sm flex items-center gap-2">
              Scanning For NFC .... <BabySpinner />
            </p>
          )}
        </div>
        <h2 className="text-xs">NFC Writer and Scanner (only enabled on a mobile device)</h2>
      </div>
    </div>
  );
};

export default NFCWriter;
