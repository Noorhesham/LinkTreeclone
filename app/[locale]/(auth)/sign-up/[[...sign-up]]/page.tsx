import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import SignUpWrapper from "../Wrapper";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUpWrapper />
    </div>
  );
}
