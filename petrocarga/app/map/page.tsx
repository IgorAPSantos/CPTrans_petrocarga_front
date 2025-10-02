"use client";

import { ViewMap } from "@/components/map/viewMap";
import { useState } from "react";

export default function Page() {
  const [selectedPlace, setSelectedPlace] = useState(null);

  return (
    <main className="container mx-auto flex flex-col items-center gap-4">
      <div className="w-full max-w-[640px] h-[400px]">
        <ViewMap selectedPlace={selectedPlace} />
      </div>

      <div className="w-[640px] bg-amber-300 p-4">
        <h1 className="text-lg font-bold">Lista</h1>
      </div>
    </main>
  );
}
