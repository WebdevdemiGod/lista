import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.labidelanutamagdadaro.todoapp",
  appName: "Group Labide Todo App",
  webDir: "dist",
  server: {
    cleartext: true,
    androidScheme: "https",
    allowNavigation: ["todo-list.dcism.org"]
  },
  android: {
    allowMixedContent: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;