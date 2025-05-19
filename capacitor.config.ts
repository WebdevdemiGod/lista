import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.43d8aa39e34f4e72b17e272d343e58df",
  appName: "mobile-ui-wizardry-touch",
  webDir: "dist",
  server: {
    url: "https://43d8aa39-e34f-4e72-b17e-272d343e58df.lovableproject.com?forceHideBadge=true",
    cleartext: false, // since your API is HTTPS
    allowNavigation: [
      "todo-list.dcism.org",
      "43d8aa39-e34f-4e72-b17e-272d343e58df.lovableproject.com",
    ],
  },
  bundledWebRuntime: false,
};

export default config;
