import Image from "next/image";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Signin from "@/components/Auth/Signin";

export const metadata: Metadata = {
  title: "FedArb ADR | Sign In",
  description: "Sign in to the FedArb ADR admin portal.",
};

const SignIn = () => {
  return (
    <DefaultLayout>
      <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center bg-surface-secondary px-4 py-8 sm:min-h-[calc(100vh-3rem)]">
        <div className="w-full max-w-[560px] overflow-hidden rounded-xl border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark">
          <div className="flex justify-center bg-primary px-10 py-10">
            <Image
              src="/images/fedarb-adr.svg"
              alt="FedArb ADR"
              width={210}
              height={52}
              priority
              className="h-auto w-[210px]"
            />
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <h1 className="mb-2 text-center text-2xl font-semibold text-primary dark:text-white">
              Admin Portal Sign In
            </h1>
            <p className="mb-8 text-center text-sm text-dark-5">
              Enter your credentials to access the dashboard.
            </p>
            <Signin />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SignIn;
