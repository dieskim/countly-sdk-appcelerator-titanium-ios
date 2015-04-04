# Count.ly Titanium iOS Messaging Module

Countly is an innovative, real-time, open source mobile analytics application. It collects data from mobile phones, and visualizes this information to analyze mobile application usage and end-user behavior. There are two parts of Countly: the server that collects and analyzes data, and mobile SDK that sends this data (for iOS & Android).

Countly:

- [Countly (Countly)](https://count.ly)

Countly Server;

- [Countly Server (countly-server)](https://github.com/Countly/countly-server)

Titanium Countly Messaging Modules
- [Countly Titanium Android Messaging Module](https://github.com/dieskim/Titanium-Count.ly-Android-Messaging)
- [Countly Titanium iOS Messaging Module](https://github.com/dieskim/Titanium-Count.ly-Messaging)

Other Countly SDK repositories;

- [Countly Android SDK (countly-sdk-android)](https://github.com/Countly/countly-sdk-android)
- [Countly iOS SDK (countly-sdk-ios)](https://github.com/Countly/countly-sdk-ios)

Countly SDK Guides;
- [Countly Android Messaging Guide](http://resources.count.ly/v1.0/docs/countly-push-for-android)
- [Countly iOS Messaging Guide]()http://resources.count.ly/v1.0/docs/countly-push-for-ios

## This Titanium iOS module is written to take use of all the Count.ly functions - including events,userData and Messaging.
## It is written with functions as close to the Android module as possible to create uniformed functions.
## Please note that this Module is under development.
## Please log issues via github issues
## Any pull requests and suggestio welcome!
## Author: Dieskim
## Development Sponsor: http://Hamsane.com - Friend who loves your way of working - Thanks!

## Installation

1. Go to: https://github.com/dieskim/Titanium-Count.ly-Messaging
2. Download: count.ly-messaging-iphone-x.x.x.zip
3. Move Zip to root of your Application 

### Register your module with your application by editing `tiapp.xml` and adding your module.

```
<modules>
<module platform="iphone">count.ly.messaging</module>
</modules>
```

## Usage

**Require the Count.ly Module**
```
var Countly = require('count.ly.messaging');
```

**Start Count.ly on own server without Messaging**
```
Countly.start('APP_KEY','http://YOUR_HOST.com');
```

**Start Count.ly on cloud without Messaging**
```
Countly.startOnCloud('APP_KEY');
```

### SETUP Count.ly WITH Messaging - Push

**Require the Count.ly Module**
```
var Countly = require('count.ly.messaging');
```

**Set Push Setup functions**
```
// START FUNCTION - registerForPush
function registerForPush() {
Ti.Network.registerForPushNotifications({
success: deviceTokenSuccess,
error: deviceTokenError,
callback: receivePush
});

// Remove event listener once registered for push notifications
Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush); 
};
// END FUNCTION - registerForPush


// addEventListener to Wait for user settings to be registered before registering for push notifications
Ti.App.iOS.addEventListener('usernotificationsettings', registerForPush);

// Start Function - deviceTokenSuccess
function deviceTokenSuccess(e) {

// get Ti.App.Properties - pushSubscribed - to check if already subscribed or not
var pushSubscribed = Ti.App.Properties.getString('pushSubscribed',false);
Ti.API.log('pushSubscribed Value: ' + pushSubscribed);	

// START IF - not subscribed then subscribe
if (pushSubscribed != true){

Ti.API.log("Not Subscribed to Count.ly Push - Subscribe with deviceToken: " + e.deviceToken);

// run Count.ly Register Device for Push
Countly.registerDeviceSuccess(e.deviceToken);

// Set Ti.App.Properties push_channels
Ti.App.Properties.setString('pushSubscribed',true); 

}else{

Ti.API.log('Already Subscribed to Count.ly Push, wont subscribe again!');

};
// END IF - not subscribed then subscribe	   

};
// End Function - deviceTokenSuccess

// Start Function - deviceTokenError
function deviceTokenError(e) {

Ti.API.log("Failed to Find Token" + e.error);

// run Count.ly Register registerDeviceError
Countly.registerDeviceError();

};
// End Function - deviceTokenError

```

**START Countly with Messaging - DEVELOPMENT TEST**
```
Countly.setMessagingDeveloperMode();	// setMessagingDeveloperMode
Countly.startMessagingTest('YOUR_APP_KEY','http://yourserver.com');
```

**START Countly with Messaging - PRODUCTION**
```
Countly.startMessaging('YOUR_APP_KEY','http://yourserver.com');
```

**Receive and Process push on Titanium side**
```
// START FUNCTION - receivePush for iOS
function receivePush(pushMessage) {			

// Ti.API.info Raw pushMessage
Ti.API.info("Received Push:" + JSON.stringify(pushMessage));  

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 													pushMessage EXAMPLE									//
//																										//
// 			{"code":0,																					//
//			"data":{	"alert":"Test Message",															//
//						"category":"[CLY]_url",															//
//						"c":{"l":"http://count.ly","i":"551b9d03f593a55e11ea62c0"},						//
//						"sound":"default",																//
//						"aps":{"category":"[CLY]_url","sound":"default","alert":"test5"}				//
//					},																					//
//			"type":"remote",																			//
//			"source":{},																				//
//			"inBackground":true,																		//
//			"success":true};																			//
//																										//
//////////////////////////////////////////////////////////////////////////////////////////////////////////


// pushData
var pushData = pushMessage.data;

// set pushUserInfoDictionary
var pushUserInfoDictionary = {userInfoDictionary: pushMessage.data.c};	
// run Count.ly record Push Opened	
Countly.recordPushOpen(pushUserInfoDictionary);	


// START IF - Set pushAlertMessage
if (pushMessage.data.alert){

var pushAlertMessage = pushMessage.data.alert;

};
// END IF -  Set pushAlertMessage 


// START IF - Set PUSH CATEGORY TYPE - check more here - http://resources.count.ly/v1.0/docs/countly-push-for-ios
if (pushMessage.data.c.l) {

var pushType = "hasLink";
var pushLink = pushMessage.data.c.l;

///////////////////////////////////////////////////////////
// 				SHOW AN LINK ALERT HERE					//
// 1. Use info 	- pushType
// 				- pushLink
//				- pushAlertMessage
// 2. Once user Takes action log action with

// Count.ly record Push Action	
// Countly.recordPushAction(pushUserInfoDictionary);	

//////////////////////////////////////////////////////////

} else if (pushMessage.data.c.r) {

var pushType = "hasReview";

// SHOW AN REVIEW ALERT HERE 

} else if (pushMessage.data.c.u) {

var pushType = "hasUpdate";

// SHOW AN UPDATE ALERT HERE

} else {

var pushType = "hasMessage";

// SHOW NORMAL ALERT HERE

};
// END IF - Set PUSH CATEGORY TYPE

};
// END FUNCTION - receivePush for iOS
```

**Set User Location - Enterprise Only**

```
// Countly Set user location
// - Takes two strings: latitudeString and longitudeString of 2 digit lengths
var latitudeString = 12;
var longitudeString = 10;
Countly.setLocation(latitudeString,longitudeString);
```

### Count.ly Record Events

**Set any of the following Fields in an Object**

```
var segmentation = {device:"iPhone 4S", country:"USA"};
var eventData = {name: "keySegmentationCountSum", segmentation:segmentation, count: 1, sum: 0.99};
```
- name (required) : Name of the event to track  
- _(example - Track clicks on the help button "clickedHelp" )_
- count (required) : Number to increment the event in the db
- _(example - User purchases item increment by 1 )_
- sum : If the event is tied to an overall numerical data, such as a purchase, we can use sum to keep track of that
- _(example - 0.99)_
- segmentation : Categorization of the event
- _(example - User is from USA and uses an iPhone 4S so the segmentation will be {device:"iPhone 4S", country:"USA"} )_

**Track Events Examples**

```
var segmentation = {device:"iPhone 4S", country:"USA"};

Ti.API.log("Send keyCount Event");
var eventData = {name: "keyCount", count: 1};
Countly.event(eventData);

Ti.API.log("Send keyCountSum Event");
var eventData = {name: "keyCountSum", count: 1, sum: 0.99};
Countly.event(eventData);

Ti.API.log("Send keySegmentationCount Event");
var eventData = {name: "keySegmentationCount", segmentation:segmentation, count: 1};
Countly.event(eventData);

Ti.API.log("Send keySegmentationCountSum Event");
var eventData = {name: "keySegmentationCountSum", segmentation:segmentation, count: 1, sum: 0.99};
Countly.event(eventData);
```

### Set UserData

**Set any of the following Fields in an Object**

**Set userData{} as information about user
**Possible keys are:

- name - (String) providing user's full name
- username - (String) providing user's nickname
- email - (String) providing user's email address
- organization - (String) providing user's organization's name where user works
- phone - (String) providing user's phone number
- picture - (String) providing WWW URL to user's avatar or profile picture
- picturePath - (String) providing local path to user's avatar or profile picture
- gender - (String) providing user's gender as M for male and F for female
- byear - (int) providing user's year of birth as integer
```
var userData = {	name: "testName",
username: "testUsername",
email: "testemail@gmail.com",
organization: "testOrg",
phone: "testPhone",
picture: "https://count.ly/wp-content/uploads/2014/10/logo.png",
picturePath: "/images/appicon.png",
gender: "M",
byear: "1980",
};
```

**Set customUserData{} as information about user with custom properties
**In customUserData you can provide any string key values to be stored with user

```
var customUserData = {	key1: "value1",
key2:"value2",
};
```

**Set Userdata as set in userData and customData
**Can contain both userData and customData - or just userdata

```
Ti.API.log("Set UserData");
var args = {	userData:userData,
customUserData:customUserData,
};

Countly.userData(args);
```

### Metrics Data

```
console.log('device',countly.device);
console.log('deviceName',countly.deviceName);
console.log('devicePlatform',countly.platform)
console.log('multitaskingSupported',countly.multitaskingSupported);
console.log('orientation', countly.orientation);
console.log('osVersion', countly.osVersion);
console.log('carrier', countly.carrier);
console.log('resolution', countly.resolution);
console.log('locale',countly.locale);
console.log('appVersion',countly.appVersion);
console.log('osVersion',countly.osVersion);
```

## Author

Author: Dieskim

## License

MIT as in License.txt