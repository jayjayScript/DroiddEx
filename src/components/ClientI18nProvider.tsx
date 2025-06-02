// app/i18n-provider.tsx
"use client";

import "../i18n"; // ✅ This must be here
import { ReactNode } from "react";

export default function I18nProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

