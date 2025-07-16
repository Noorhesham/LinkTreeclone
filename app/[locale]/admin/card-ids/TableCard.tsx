"use client";
import { Table, TableBody, TableHead, TableRow, TableHeader, TableCell } from "@/components/ui/table";
import React, { useRef, useState } from "react"; // Add useRef and useState
import { Button } from "@/components/ui/button";
import { Copy, CopyIcon, ExternalLink, UserRound, Download, Settings } from "lucide-react"; // Add more icons
import CustomDialog from "@/app/components/CustomDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Assuming you have a Label component
import { Switch } from "@/components/ui/switch"; // Assuming you have a Switch component
import { QRCodeCanvas } from "qrcode.react"; // Import the QR Code library

/**
 * QR Code Display Sub-component
 * This component now includes controls for color and transparency.
 */
const QRCodeDisplay = ({ value, cardId }: { value: string; cardId: string }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  // --- STATE FOR CUSTOMIZATION ---
  const [qrColor, setQrColor] = useState("#000000");
  const [isTransparent, setIsTransparent] = useState(false);

  // Handles the download of the QR code canvas as a PNG image.
  const handleDownload = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector("canvas");
      if (canvas) {
        const image = canvas.toDataURL("image/png");
        const anchor = document.createElement("a");
        anchor.href = image;
        anchor.download = `signup-qr-${cardId}.png`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 border-t border-b">
      <div ref={qrRef} className="p-2 bg-white rounded-lg border shadow-sm">
        <QRCodeCanvas
          value={value}
          size={200}
          // --- APPLY CUSTOMIZATION ---
          bgColor={isTransparent ? "transparent" : "#ffffff"}
          fgColor={qrColor}
          level={"H"}
          includeMargin={true}
        />
      </div>

      {/* --- CUSTOMIZATION CONTROLS --- */}
      <div className="w-full space-y-4 p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center justify-between">
          <Label htmlFor="qr-color" className="font-medium">
            QR Code Color
          </Label>
          <div className="relative h-8 w-8">
            <input
              id="qr-color"
              type="color"
              value={qrColor}
              onChange={(e) => setQrColor(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="h-full w-full rounded-md border" style={{ backgroundColor: qrColor }} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="transparent-bg" className="font-medium">
            Transparent Background
          </Label>
          <Switch id="transparent-bg" checked={isTransparent} onCheckedChange={setIsTransparent} />
        </div>
      </div>

      <Button onClick={handleDownload} variant="outline" className="w-full">
        <Download className="mr-2 h-4 w-4" />
        Download QR Code
      </Button>
    </div>
  );
};

const TableCard = ({ cardIds }: { cardIds: any[] }) => {
  const copyToClipboard = (text: string, message: string = "Copied!") => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log(message);
        // Consider using a toast library for user feedback instead of console.log
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Card ID</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cardIds.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No card IDs found. Generate some using the form above.
              </TableCell>
            </TableRow>
          ) : (
            cardIds.map((id) => {
              const signupLink = `${window.location.origin}/sign-up?cardId=${id.cardId}`;

              return (
                <TableRow key={id._id}>
                  <TableCell className="font-medium">{id.cardId}</TableCell>
                  <TableCell>{id.assignedTo?.userName || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        id.isAssigned ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {id.isAssigned ? "Assigned" : "Available"}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(id.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <CustomDialog
                        title="Signup Link & QR Code"
                        btn={
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Signup
                          </Button>
                        }
                        content={
                          <div className="space-y-4">
                            <p className="text-sm text-center text-gray-600 px-4">
                              Share this QR code or link for user registration.
                            </p>
                            <QRCodeDisplay value={signupLink} cardId={id.cardId} />

                            <div className="space-y-2 px-4 pb-2">
                              <p className="text-sm font-medium text-center">Or copy the link manually:</p>
                              <div className="flex items-center gap-2">
                                <Input value={signupLink} readOnly />
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(signupLink, "Signup link copied!")}
                                >
                                  <CopyIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        }
                      />

                      {id.isAssigned && id.assignedTo?.userName && (
                        <Button
                          variant="outline"
                          size="sm"
                          title="Copy user profile link"
                          onClick={() =>
                            copyToClipboard(
                              `${window.location.origin}/${id.assignedTo.userName}`,
                              "Profile link copied!"
                            )
                          }
                        >
                          <UserRound className="h-4 w-4 mr-2" />
                          Profile
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        title="Copy profile search link by card ID"
                        onClick={() =>
                          copyToClipboard(
                            `${window.location.origin}/profile?cardId=${id.cardId}`,
                            "Search link copied!"
                          )
                        }
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableCard;
