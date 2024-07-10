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
    return `https://link-treeclone-olive.vercel.app/${username}`;
  };

  const scanAndWriteToNFC = async () => {
    try {
      if ("NDEFReader" in window) {
        const ndefReader = new (window as any).NDEFReader();
        await ndefReader.scan();
        ndefReader.onreading = async (event: any) => {
          setScanningStatus("NFC tag detected");
          const decoder = new TextDecoder();
          let scannedContent = "";
          for (const record of event.message.records) {
            scannedContent += decoder.decode(record.data);
          }
          setScannedData(scannedContent);
          setScanningStatus(`NFC tag scanned: ${event.serialNumber}`);

          // Now write to the scanned NFC tag
          if ("NDEFWriter" in window) {
            const ndefWriter = new (window as any).NDEFWriter();
            const url = generateProfileUrl(username);
            await ndefWriter.write({
              records: [{ recordType: "url", data: url }],
            });
            setMessage("Successfully written to NFC card!");
          } else {
            setMessage("Web NFC is not supported on this device.");
          }
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
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
        <Button text="Scan and Write to NFC" onClick={scanAndWriteToNFC} />
      </div>
      {message && <p>{message}</p>}
      {scanningStatus && <p>{scanningStatus}</p>}
      {scannedData && <p>Scanned Data: {scannedData}</p>}
    </div>
  );
};

export default NFCWriter;
