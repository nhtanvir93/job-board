import { Suspense } from "react";

import RegenerateBtnClient from "./_RegenerateBtnClient";
import { getRandomNumber } from "./examples";

const ExamplePage = () => {
  return (
    <Suspense>
      <SuspendedPage />
    </Suspense>
  );
};

async function SuspendedPage() {
  const randomNumber = await getRandomNumber();

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4">
      <h1 className="text-5xl p-8 border-2">
        <span className="font-extrabold">Current Random Number:</span>{" "}
        {randomNumber}
      </h1>
      <RegenerateBtnClient />
    </div>
  );
}

export default ExamplePage;
