"use client";
import React, { useState } from "react";
import Button from "./Button";
import { toast } from "react-toastify";
import AnimatedImage from "./AnimatedImage";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import BabySpinner from "./BabySpinner";
import cookies from "js-cookie";

const NFCWriter = ({ userName }: { userName?: string }) => {
  const [isNFCWritten, setIsNFCWritten] = useState(false);
  const [scanningStatus, setScanningStatus] = useState<"success" | "error" | "" | "scanning">("");

  const scanAndWriteToNFC = async () => {
    if (isNFCWritten) {
      toast.info("NFC card has already been written to.");
      return;
    }

    setScanningStatus("");
    toast.info("Scanning for NFC tags...");
    setScanningStatus("scanning");

    try {
      if ("NDEFReader" in window) {
        const ndef = new (window as any).NDEFReader();
        await ndef.scan();

        const urlRecord = {
          recordType: "url",
          data: `https://vega-nfc.vercel.app/${cookies.get("NEXT_LOCALE") || "en"}/profile/${userName}`,
        };

        await ndef.write({ records: [urlRecord] });

        toast.success("NFC written successfully!");
        setScanningStatus("success");
        setIsNFCWritten(true);
      } else {
        throw new Error("NFC not supported on this device/browser.");
      }
    } catch (error: any) {
      console.error("Error scanning NFC card", error);
      toast.error(`Failed to write NFC card. Error: ${error.message || "Unknown error."}`);
      setScanningStatus("error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center lg:flex-row gap-2 h-full ml-5 mt-3 w-full lg:w-[60%]">
      <div>
        <AnimatedImage className="mx-auto w-[24rem]" data={"nfc.json"} />
      </div>
       {/* <div className="flex flex-col items-center mb-2 lg:items-start gap-2">
        <div className="flex flex-col items-center gap-5">
          <Button disabled={userName === ""} text="Scan and Write to NFC" onClick={scanAndWriteToNFC} />
          {!userName && (
            <p className="text-base text-muted-foreground">TO WRITE TO NFC YOU MUST ADD USERNAME TO YOUR LINK</p>
          )} 
          {scanningStatus === "success" && <CheckCircleIcon className="w-6 h-6 text-green-500" />}
          {scanningStatus === "error" && <XCircleIcon className="w-6 h-6 text-red-500" />}
          {scanningStatus === "scanning" && (
            <p className="text-sm flex items-center gap-2">
              Scanning For NFC... <BabySpinner />
            </p>  
          )}
        </div>
        <h2 className="text-xs">NFC Writer and Scanner (only enabled on a mobile device)</h2>
      </div> */}
    </div>
  );
};

export default NFCWriter;
