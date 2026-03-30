import React from "react";
import { siteConfigError } from "../api";

export default function SiteErrorBanner() {
  if (!siteConfigError) return null;

  return (
    <div className="sticky top-0 z-50 w-full bg-red-500 text-white text-sm font-medium px-4 py-3 text-center shadow-md">
      ⚠️&nbsp; WordPress site URL is not configured. Open{" "}
      <code className="font-mono bg-red-600 px-1 py-0.5 rounded text-xs">
        src/api.js
      </code>{" "}
      and set your <code className="font-mono bg-red-600 px-1 py-0.5 rounded text-xs">SITE_URL</code>.
    </div>
  );
}
