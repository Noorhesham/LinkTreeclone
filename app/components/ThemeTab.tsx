
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FontSelector from "@/app/components/FontSelector";
import ThemeSelector from "@/app/components/ThemeSelector";
import ButtonsSelector from "./ButtonsSelector";
export function ThemeTab() {
    
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="font">Font</TabsTrigger>
        <TabsTrigger value="theme">Theme</TabsTrigger>
        <TabsTrigger value="btns">Buttons</TabsTrigger>
      </TabsList>
      <TabsContent value="font">
        <FontSelector />
      </TabsContent>
      <TabsContent value="theme">
        <ThemeSelector />
      </TabsContent>
      <TabsContent value="btns">
        <ButtonsSelector />
      </TabsContent>
    </Tabs>
  );
}
