#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface BatteryModule : RCTEventEmitter <RCTBridgeModule>
@end

@implementation BatteryModule

// Expose the module to React Native (exported as "BatteryModule")
RCT_EXPORT_MODULE();

// If needed, ensure that this module is initialized on the main thread
+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

#pragma mark - RCTEventEmitter Methods

// List the events that this module may send
- (NSArray<NSString *> *)supportedEvents {
  return @[@"BatteryChanged"];
}

- (instancetype)init {
  if (self = [super init]) {
    // Enable battery monitoring
    [[UIDevice currentDevice] setBatteryMonitoringEnabled:YES];
    // Listen for battery level changes
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(batteryLevelDidChange:)
                                                 name:UIDeviceBatteryLevelDidChangeNotification
                                               object:nil];
  }
  return self;
}

- (void)batteryLevelDidChange:(NSNotification *)notification {
  float batteryLevel = [UIDevice currentDevice].batteryLevel;
  NSInteger batteryPercentage = batteryLevel * 100;
  // Emit the event to JS
  [self sendEventWithName:@"BatteryChanged" body:@{@"batteryLevel": @(batteryPercentage)}];
}

RCT_EXPORT_METHOD(getBatteryLevel:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  float batteryLevel = [UIDevice currentDevice].batteryLevel;
  if (batteryLevel < 0) {
    NSError *error = [NSError errorWithDomain:@"BatteryModule"
                                         code:0
                                     userInfo:@{NSLocalizedDescriptionKey:@"Battery level unavailable"}];
    reject(@"no_battery", @"Battery level unavailable", error);
  } else {
    NSInteger batteryPercentage = batteryLevel * 100;
    resolve(@(batteryPercentage));
  }
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end
