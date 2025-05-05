"use client";
import { Table, TableBody, TableHead, TableRow, TableHeader, TableCell } from "@/components/ui/table";
import React from "react";
import { Button } from "@/components/ui/button";

const TableCard = ({ cardIds }: { cardIds: any[] }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Card ID</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Signup URL</TableHead>
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
                <TableCell>{id.description || "-"}</TableCell>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/sign-up?cardId=${id.cardId}`);
                    }}
                  >
                    Copy Link
                  </Button>
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
