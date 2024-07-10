"use client";
import React, { useState } from "react";
import Button from "./Button";
import { Input } from "@/components/ui/input";

const NFCWriter = ({ userName }: { userName?: string }) => {
  const [message, setMessage] = useState("");
  const [scannedData, setScannedData] = useState("");
  const [scanningStatus, setScanningStatus] = useState("");

  const scanAndWriteToNFC = async () => {
    setMessage("Scanning for NFC tags...");
    try {
      if ("NDEFReader" in window) {
        const urlRecord = {
          recordType: "url",
          data: `https://link-treeclone-olive.vercel.app/profile/${userName || ""}`,
        };

        const ndef = new (window as any).NDEFReader();
        await ndef.write({ records: [urlRecord] });
        const abortController = new AbortController();
        await ndef.scan({ signal: abortController.signal });
        const message = await new Promise((resolve) => {
          ndef.onreading = (event: any) => resolve(event.message);
        });
        setMessage(`Nfc written successfully ${message}`);
    
        //@ts-ignore
        setScannedData(message);
        await new Promise((r) => setTimeout(r, 3000));
        abortController.abort();
      }
    } catch (error: any) {
      console.error("Error scanning NFC card", error);
      setMessage(`Failed to scan NFC card. Error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full ml-5 mt-3 w-full lg:w-[60%]">
      <div className="flex flex-col lg:flex-row items-center gap-5">
        <Button text="Scan and Write to NFC" onClick={scanAndWriteToNFC} />
      </div>
      <h2 className=" text-xs">NFC Writer and Scanner {'(only enabled when running on a mobile device)'}</h2>
      {message && <p>{message}</p>}
      {scanningStatus && <p>{scanningStatus}</p>}
      {scannedData && <p>Scanned Data: {scannedData}</p>}
    </div>
  );
};

export default NFCWriter;
