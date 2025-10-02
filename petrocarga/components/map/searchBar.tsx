"use client";

import { useState } from "react";

interface MapboxFeature {
  id: string;
  place_name: string;
  geometry: { type: "Point"; coordinates: [number, number] };
}

interface SearchBarProps {
  onSelect: (place: MapboxFeature) => void;
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);

  async function handleInput(value: string) {
    setQuery(value);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      value
    )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&autocomplete=true&limit=5`;

    const res = await fetch(url);
    const data = await res.json();
    setSuggestions(data.features);
  }

  function handleSelect(place: MapboxFeature) {
    setQuery(place.place_name);
    setSuggestions([]);
    onSelect(place); // envia para o Map.tsx
  }

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => handleInput(e.target.value)}
        placeholder="Buscar endereço..."
        className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none"
      />

      {suggestions.length > 0 && (
        <ul className="absolute w-full bg-white border rounded-lg shadow-md mt-1 max-h-60 overflow-y-auto z-10">
          {suggestions.map((place) => (
            <li
              key={place.id}
              onClick={() => handleSelect(place)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {place.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
