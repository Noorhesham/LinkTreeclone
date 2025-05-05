"use client";
import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import QRReader from "react-qr-reader";
import Button from "./Button";
import { toast } from "react-toastify";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import BabySpinner from "./BabySpinner";

const QRCodeHandler = () => {
  const [scanningStatus, setScanningStatus] = useState<"success" | "error" | "" | "scanning">("");
  const [qrData, setQRData] = useState("");

  const handleScan = (data: string | null) => {
    if (data) {
      setQRData(data);
      toast.success("QR code scanned successfully!");
      setScanningStatus("success");
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    toast.error("Error scanning QR code");
    setScanningStatus("error");
  };

  const generateQRCode = (data: string) => {
    return (
      <QRCodeCanvas value={data} size={256} bgColor={"#ffffff"} fgColor={"#000000"} level={"H"} includeMargin={false} />
    );
  };

  return (
    <div className="flex flex-col items-center gap-2 h-full">
      <div className="flex flex-col items-center gap-5">
        <Button text="Scan QR Code" onClick={() => setScanningStatus("scanning")} />
        {scanningStatus === "scanning" && (
          <QRReader delay={300} onError={handleError} onScan={handleScan} style={{ width: "100%" }} />
        )}
        {scanningStatus === "success" && (
          <>
            <CheckCircleIcon className="w-6 h-6 text-green-500" />
            <p>Scanned Data: {qrData}</p>
            {generateQRCode(qrData)}
          </>
        )}
        {scanningStatus === "error" && <XCircleIcon className="w-6 h-6 text-red-500" />}
      </div>
    </div>
  );
};

export default QRCodeHandler;
