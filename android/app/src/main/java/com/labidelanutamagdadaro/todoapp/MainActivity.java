package com.labidelanutamagdadaro.todoapp;

import android.os.Bundle;                      // Android Bundle class
import com.getcapacitor.BridgeActivity;        // Core Capacitor bridge
import com.getcapacitor.Plugin;                // Plugin base type
import com.getcapacitor.plugin.http.Http;      // ← Correct HTTP plugin path

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // Register the native HTTP plugin
    this.registerPlugin(Http.class);
  }
}
