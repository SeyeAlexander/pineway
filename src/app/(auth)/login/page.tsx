import { cn } from "@/lib/utils";
import Image from "next/image";
import pinewayLogoMark from "~/public/pineway-logo-mark.svg";
import SignInForm from "./SignInForm";

const wrapperClassname = cn(
  `flex xs:pt-40 lg:pt-56 justify-center xs:justify-start px-5 md:px-0 gap-y-6 min-h-full flex-col w-full md:max-w-xs mx-auto`,
);

export default function SignInPage() {
  return (
    <div className={wrapperClassname}>
      <div className="text-center">
        <Image
          src={pinewayLogoMark}
          alt="Pineway logo mark"
          className="mx-auto"
        />
      </div>
      <SignInForm />
    </div>
  );
}
