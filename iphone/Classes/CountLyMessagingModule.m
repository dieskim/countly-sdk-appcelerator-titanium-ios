/**
 * Titanium-Countly-Messaging
 *
 * Created by Your Name
 * Copyright (c) 2015 Your Company. All rights reserved.
 */

#import "CountLyMessagingModule.h"
#import "TiBase.h"
#import "TiHost.h"
#import "TiUtils.h"
#import "TiApp.h"
#import <CoreTelephony/CTTelephonyNetworkInfo.h>
#import <CoreTelephony/CTCarrier.h>
#include <UIKit/UIKit.h>
#include <sys/types.h>
#include <sys/sysctl.h>

@implementation CountLyMessagingModule

#pragma mark Internal

// this is generated for your module, please do not change it
-(id)moduleGUID
{
	return @"b3b97595-5a4a-4e53-b723-2666570c3590";
}

// this is generated for your module, please do not change it
-(NSString*)moduleId
{
	return @"count.ly.messaging";
}

#pragma mark Lifecycle

-(void)startup
{
	// this method is called when the module is first loaded
	// you *must* call the superclass
	[super startup];

	NSLog(@"[INFO] %@ loaded",self);
}

-(void)shutdown:(id)sender
{
	// this method is called when the module is being unloaded
	// typically this is during shutdown. make sure you don't do too
	// much processing here or the app will be quit forceably

	// you *must* call the superclass
	[super shutdown:sender];
}

#pragma mark Cleanup

-(void)dealloc
{
	// release any resources that have been retained by the module
	[super dealloc];
}

#pragma mark Internal Memory Management

-(void)didReceiveMemoryWarning:(NSNotification*)notification
{
	// optionally release any resources that can be dynamically
	// reloaded once memory is available - such as caches
	[super didReceiveMemoryWarning:notification];
}

/**
 * Starts Countly with given configuration and begins session.
 * @param config CountlyConfig object that defines host, app key and optional features
 */
-(void)start:(id)args
{
    ENSURE_ARG_COUNT(args, 1);
    
    // set CountlyConfigParams as data passed from Titanium Layer
    NSDictionary* CountlyConfigDict = [args objectAtIndex:0];
    
    // create new CountlyConfig
    CountlyConfig* config = CountlyConfig.new;
    
    // add basic needed values
    config.appKey = [CountlyConfigDict objectForKey: @"appkey"];
    config.host = [CountlyConfigDict objectForKey: @"host"];
    
    // add extra values if defined
    
    // set deviceID if passed
    if([CountlyConfigDict objectForKey: @"deviceID"]){
            config.deviceID = [CountlyConfigDict objectForKey: @"deviceID"];
    }
    
    // set forceDeviceIDInitialization if passed
    if([CountlyConfigDict objectForKey: @"forceDeviceIDInitialization"]){
        config.forceDeviceIDInitialization = [CountlyConfigDict objectForKey: @"forceDeviceIDInitialization"];
    }

    
    // run Countly startWithConfig with config
    TiThreadPerformOnMainThread(^{[[Countly sharedInstance] startWithConfig:config];}, NO);
    
}

/**
 * Sets new device ID to be persistently stored and used in following requests.
 * @param deviceID New device ID
 * @param onServer If YES data on server will be merged automatically, otherwise device will be counted as a new device.
 */
-(void)setNewDeviceID:(id)args
{
    
    [[Countly sharedInstance] setNewDeviceID:[args objectForKey: @"deviceID"] onServer:[args objectForKey: @"onServer"]];
    
}


- (id)device
{
    size_t size;
    sysctlbyname("hw.machine", NULL, &size, NULL, 0);
    char *machine = malloc(size);
    sysctlbyname("hw.machine", machine, &size, NULL, 0);
    NSString *platform = [NSString stringWithUTF8String:machine];
    free(machine);
    return platform;
}

- (id)deviceName
{
    return [[UIDevice currentDevice] name];
}

- (id)platform
{
    return [[UIDevice currentDevice] model];
}

- (id)multitaskingSupported
{
    return NUMBOOL([[UIDevice currentDevice] isMultitaskingSupported]);
}

- (id)orientation
{
    //Obtaining the current device orientation
    UIDeviceOrientation orientation = [[UIDevice currentDevice] orientation];
    
    NSString* value = @"portrait";
    
    switch(orientation){
            // Device oriented vertically, home button on the bottom
        case UIDeviceOrientationPortrait:
            value = @"PORTRAIT";
            break;
            // Device oriented vertically, home button on the bottom
        case UIDeviceOrientationPortraitUpsideDown:
            value = @"PORTRAIT_UPSIDE_DOWN";
            break;
            // Device oriented vertically, home button on the top
        case UIDeviceOrientationLandscapeLeft:
            value = @"LANDSCAPE_LEFT";
            break;
            // Device oriented horizontally, home button on the right
        case UIDeviceOrientationLandscapeRight:
            value = @"LANDSCAPE_RIGHT";
            break;
            // Device oriented flat, face up
        case UIDeviceOrientationFaceUp:
            value = @"FACE_UP";
            break;
            // Device oriented flat, face down
        case UIDeviceOrientationFaceDown:
            value = @"FACE_DOWN";
            break;
        default:
            value = @"UNKNOWN";
            break;
    }
    
    return value;
}

- (id)osVersion
{
    return [[UIDevice currentDevice] systemVersion];
}

- (id)systemName
{
    return [[UIDevice currentDevice] systemName];
}

- (id)carrier
{
    if (NSClassFromString(@"CTTelephonyNetworkInfo"))
    {
        CTTelephonyNetworkInfo *netinfo = [[[CTTelephonyNetworkInfo alloc] init] autorelease];
        CTCarrier *carrier = [netinfo subscriberCellularProvider];
        if ([carrier carrierName]) {
            return [carrier carrierName];
        }
        return @"Simulator";
    }
    
    return @"Unknown";
}

- (id)resolution
{
    CGRect bounds = [[UIScreen mainScreen] bounds];
    CGFloat scale = [[UIScreen mainScreen] respondsToSelector:@selector(scale)] ? [[UIScreen mainScreen] scale] : 1.f;
    CGSize res = CGSizeMake(bounds.size.width * scale, bounds.size.height * scale);
    return [TiUtils sizeToDictionary:res];
    
}

- (id)locale
{
    return [[NSLocale currentLocale] localeIdentifier];
}

- (id)appVersion
{
    return [[[NSBundle mainBundle] infoDictionary] objectForKey:(NSString*)kCFBundleVersionKey];
}

- (id)proximityState
{
    return NUMBOOL([[UIDevice currentDevice] proximityState]);
}



@end
