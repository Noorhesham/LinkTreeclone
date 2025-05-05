"use client";
import { Table, TableBody, TableHead, TableRow, TableHeader, TableCell } from "@/components/ui/table";
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, UserRound } from "lucide-react";

const TableCard = ({ cardIds }: { cardIds: any[] }) => {
  const copyToClipboard = (text: string, message: string = "Copied!") => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
    alert(message);
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
            cardIds.map((id) => (
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
                    <Button
                      variant="outline"
                      size="sm"
                      title="Copy signup link with card ID"
                      onClick={() =>
                        copyToClipboard(`${window.location.origin}/sign-up?cardId=${id.cardId}`, "Signup link copied!")
                      }
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Signup
                    </Button>

                    {id.isAssigned && id.assignedTo?.userName && (
                      <Button
                        variant="outline"
                        size="sm"
                        title="Copy user profile link"
                        onClick={() =>
                          copyToClipboard(`${window.location.origin}/${id.assignedTo.userName}`, "Profile link copied!")
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
                        copyToClipboard(`${window.location.origin}/profile?cardId=${id.cardId}`, "Search link copied!")
                      }
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableCard;
