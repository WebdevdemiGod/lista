import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.lanutanlabidemagdadaro.todoapp",
  appName: "Labide Todo App",
  webDir: "dist",
  server: {
    cleartext: true, // since your API is HTTPS
    androidScheme: "https",
    allowNavigation: ["todo-list.dcism.org",]
  },
};

export default config;
