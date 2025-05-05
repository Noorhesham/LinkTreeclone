"use client";

import { generateCardId } from "@/app/lib/actions/cardIdActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

function GenerateCardIdForm() {
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedId, setGeneratedId] = useState("");

  // Generate a random ID without saving it to the database
  const generateRandomId = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const length = 8;
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    setGeneratedId(result);
    return result;
  };

  // Handle random generation button click
  const handleRandomGenerate = () => {
    generateRandomId();
  };

  // Handle form submission to save to database
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // If we already have a generated ID, use it, otherwise generate a new one
      const idToSave = generatedId || generateRandomId();
      await generateCardId(description, idToSave);
      setDescription("");
      setGeneratedId("");
      // Refresh the page to show the new card ID
      window.location.reload();
    } catch (error) {
      console.error("Error generating card ID:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Button variant="outline" onClick={handleRandomGenerate} className="w-full">
          Generate Random Card ID
        </Button>

        {generatedId && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-lg font-bold mb-1">Generated Card ID:</h3>
                <div className="text-2xl font-mono tracking-wider bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                  {generatedId}
                </div>
                <p className="text-sm text-gray-500 mt-2">This ID is not saved yet. Submit the form to save it.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description (optional)
          </label>
          <Input
            id="description"
            placeholder="E.g., Marketing campaign, Event registration"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={isGenerating} className="w-full">
          {isGenerating ? "Saving..." : generatedId ? `Save Card ID: ${generatedId}` : "Generate & Save Card ID"}
        </Button>
      </form>
    </div>
  );
}

export default GenerateCardIdForm;
