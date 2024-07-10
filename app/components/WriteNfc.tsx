"use client";
import React, { useState } from "react";
import Button from "./Button";
import { Input } from "@/components/ui/input";

const NFCWriter: React.FC = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [scannedData, setScannedData] = useState("");

  const generateProfileUrl = (username: string) => {
    return `https://yourdomain.com/${username}`;
  };

  const writeToNFC = async (url: string) => {
    try {
      if ("NDEFWriter" in window) {
        const ndef = new (window as any).NDEFWriter();
        await ndef.write({ records: [{ recordType: "url", data: url }] });
        setMessage("Successfully written to NFC card!");
      } else {
        setMessage("Web NFC is not supported on this device.");
      }
    } catch (error) {
      console.error("Error writing to NFC card", error);
      setMessage("Failed to write to NFC card.");
    }
  };

  const scanNFC = async () => {
    try {
      if ("NDEFReader" in window) {
        const ndef = new (window as any).NDEFReader();
        await ndef.scan();
        ndef.onreading = (event: any) => {
          const decoder = new TextDecoder();
          for (const record of event.message.records) {
            setScannedData(decoder.decode(record.data));
          }
        };
        setMessage("Scanning for NFC tags...");
      } else {
        setMessage("Web NFC is not supported on this device.");
      }
    } catch (error) {
      console.error("Error scanning NFC card", error);
      setMessage("Failed to scan NFC card.");
    }
  };

  const handleWrite = () => {
    const url = generateProfileUrl(username);
    writeToNFC(url);
  };

  return (
    <div className=" flex-col gap-2 h-full w-[60%]">
      <h2>NFC Writer and Scanner</h2>
      <div className="flex items-center gap-5">
        <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
        <Button text="Write to NFC" onClick={handleWrite} />
        <Button text="Scan NFC" onClick={scanNFC} />
      </div>
      {message && <p>{message}</p>}
      {scannedData && <p>Scanned Data: {scannedData}</p>}
    </div>
  );
};

export default NFCWriter;
``
