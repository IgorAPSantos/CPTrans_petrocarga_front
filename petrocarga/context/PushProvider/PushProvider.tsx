"use client";

import { usePushSetup } from "./usePushSetup";
import { useForegroundPush } from "./useForegroundPush";
export function PushProvider({ children }: { children: React.ReactNode }) {
  usePushSetup();
  useForegroundPush();

  return <>{children}</>;
}
