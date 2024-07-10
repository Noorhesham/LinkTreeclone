"use client";
import React, { useState } from "react";
import Button from "./Button";
import { Input } from "@/components/ui/input";

const NFCWriter: React.FC = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [scannedData, setScannedData] = useState("");
  const [scanningStatus, setScanningStatus] = useState("");

  const generateProfileUrl = (username: string) => {
    return `https://yourdomain.com/${username}`;
  };

  const writeToNFC = async (ndef:any,url: string) => {
    try {
      if ("NDEFWriter" in window) {
        
        await ndef.write({ records: [{ recordType: "url", data: url }] });
        setMessage("Successfully written to NFC card!");
      } else {
        setMessage("Web NFC is not supported on this device.");
      }
    } catch (error: any) {
      console.error("Error writing to NFC card", error);
      setMessage(`Failed to write to NFC card. Error: ${error.message}`);
    }
  };

  const scanAndWriteToNFC = async () => {
    try {
      if ("NDEFReader" in window) {
        const ndef = new (window as any).NDEFReader();
        await ndef.scan();
        ndef.onreading = async (event: any) => {
          setScanningStatus("NFC tag detected");
          const decoder = new TextDecoder();
          let scannedContent = "";
          for (const record of event.message.records) {
            scannedContent += decoder.decode(record.data);
          }
          setScannedData(scannedContent);
          setScanningStatus(`NFC tag scanned: ${event.serialNumber}`);

          // Write to the scanned NFC tag
          const url = generateProfileUrl(username);
          await writeToNFC(ndef,url);
        };
        setMessage("Scanning for NFC tags...");
      } else {
        setMessage("Web NFC is not supported on this device.");
      }
    } catch (error: any) {
      console.error("Error scanning NFC card", error);
      setMessage(`Failed to scan NFC card. Error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full w-full lg:w-[60%]">
      <h2>NFC Writer and Scanner</h2>
      <div className="flex flex-col lg:flex-row items-center gap-5">
        <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
        <Button text="Scan and Write to NFC" onClick={scanAndWriteToNFC} />
      </div>
      {message && <p>{message}</p>}
      {scanningStatus && <p>{scanningStatus}</p>}
      {scannedData && <p>Scanned Data: {scannedData}</p>}
    </div>
  );
};

export default NFCWriter;
