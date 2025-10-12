"use server";

import { revalidateTag } from "next/cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

let randomNumber = 0;

const CACHE_TAG = "random-number";

export async function getRandomNumber(): Promise<number> {
  "use cache";
  cacheTag(CACHE_TAG);

  console.log("Not Cached");

  return new Promise((resolve) =>
    setTimeout(() => resolve(randomNumber), 1000),
  );
}

export async function generateNewRandomNumber(): Promise<{ message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const random = Math.floor(Math.random() * 10) + 1;
      randomNumber += random;
      revalidateTag(CACHE_TAG);

      resolve({ message: `${random} added to old random number` });
    }, 1000);
  });
}
