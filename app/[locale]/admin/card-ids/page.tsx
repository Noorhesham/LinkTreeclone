import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCardIds } from "@/app/lib/actions/cardIdActions";
import GenerateCardIdForm from "./FormCard";
import TableCard from "./TableCard";

export default async function CardIdsPage() {
  const cardIds = await getCardIds();

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-10">
        <div>
          <h1 className="text-3xl font-bold">Card IDs Management</h1>
          <p className="text-gray-500 mt-2">
            Generate and manage unique card IDs to associate with users during signup.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Card IDs</CardTitle>
              <CardDescription>Create new unique card IDs that can be used to associate with users.</CardDescription>
            </CardHeader>
            <CardContent>
              <GenerateCardIdForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Instructions</CardTitle>
              <CardDescription>How to use card IDs with your signup process.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">1. Generate Card IDs</h3>
                  <p className="text-sm text-gray-500">Use the form to generate unique card IDs.</p>
                </div>
                <div>
                  <h3 className="font-medium">2. Share Signup Links</h3>
                  <p className="text-sm text-gray-500">Add the card ID as a parameter to your signup URL:</p>
                  <code className="block bg-gray-100 p-2 mt-1 rounded text-sm">
                    https://yourdomain.com/sign-up?cardId=XXXX1234
                  </code>
                </div>
                <div>
                  <h3 className="font-medium">3. Track Associations</h3>
                  <p className="text-sm text-gray-500">
                    When users sign up with these links, the card ID will be associated with their account
                    automatically.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Card IDs</CardTitle>
            <CardDescription>Manage your existing card IDs and their assignment status.</CardDescription>
          </CardHeader>
          <CardContent>
            <TableCard cardIds={cardIds} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
