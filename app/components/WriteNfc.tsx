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
        const url = generateProfileUrl(username);

        ndefReader.onreading = async (event: any) => {
          setScanningStatus("NFC tag detected");
          const decoder = new TextDecoder();
          let scannedContent = "";
          for (const record of event.message.records) {
            scannedContent += decoder.decode(record.data);
          }
          setScannedData(scannedContent);
          setScanningStatus(`NFC tag scanned: ${event.serialNumber}`);
          ndefReader
            .write(url)
            .then((e: any) => {
              console.log("Message written.");
              setMessage("Message written."+ e);
            })
            .catch((error: any) => {
              console.log(`Write failed :-( try again: ${error}.`);
            });
        };
      }
    } catch (error) {}
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
