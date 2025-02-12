package com.yourapp;

import android.content.Intent;
import android.content.IntentFilter;
import android.os.BatteryManager;
import android.content.BroadcastReceiver;
import android.content.Context;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class BatteryModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private BroadcastReceiver batteryReceiver;

    public BatteryModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        registerBatteryReceiver();
    }

    @Override
    public String getName() {
        return "BatteryModule";
    }

    @ReactMethod
    public void getBatteryLevel(Promise promise) {
        Intent batteryIntent = reactContext.registerReceiver(null, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
        if (batteryIntent == null) {
            promise.reject("NO_BATTERY", "Battery info not available");
            return;
        }
        int level = batteryIntent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
        int scale = batteryIntent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
        if (level == -1 || scale == -1) {
            promise.reject("NO_BATTERY", "Battery info not available");
            return;
        }
        int batteryPercentage = (int)((level / (float)scale) * 100);
        promise.resolve(batteryPercentage);
    }

    private void registerBatteryReceiver() {
        batteryReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if (intent.getAction() == null || !intent.getAction().equals(Intent.ACTION_BATTERY_CHANGED)) {
                    return;
                }
                int level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
                int scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
                if (level == -1 || scale == -1) {
                    return;
                }
                int batteryPercentage = (int)((level / (float)scale) * 100);
                sendEvent(batteryPercentage);
            }
        };
        reactContext.registerReceiver(batteryReceiver, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
    }

    private void sendEvent(int batteryPercentage) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("BatteryChanged", batteryPercentage);
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        if (batteryReceiver != null) {
            try {
                reactContext.unregisterReceiver(batteryReceiver);
            } catch (IllegalArgumentException e) {
                // Receiver was not registered or already unregistered
            }
            batteryReceiver = null;
        }
    }
}
