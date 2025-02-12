import { NativeModules, NativeEventEmitter, EmitterSubscription } from 'react-native';

// Correctly extract BatteryModule from NativeModules.
const { BatteryInfoModule } = NativeModules;

export type BatteryEvent = { batteryLevel: number } | number;

class Battery {
  /**
   * Get the current battery level.
   */
  static async getBatteryLevel(): Promise<number> {
    const level = await BatteryInfoModule.getBatteryLevel();
    // For iOS, the returned value might be an object; for Android it might be a number.
    console.log(level)
    return typeof level === 'object' && level !== null && 'batteryLevel' in level
      ? level.batteryLevel
      : level;
  }

  /**
   * Subscribe to battery changes.
   */
  static addListener(callback: (batteryPercentage: number) => void): EmitterSubscription {
    const eventEmitter = new NativeEventEmitter(BatteryInfoModule);
    return eventEmitter.addListener('BatteryChanged', (data: BatteryEvent) => {
      const batteryPercentage =
        typeof data === 'object' && data !== null && 'batteryLevel' in data
          ? data.batteryLevel
          : data;
      callback(batteryPercentage);
    });
  }
}

export default Battery;
