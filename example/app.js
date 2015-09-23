/// FIND GOOD TEST APP HERE - easy Test app you can download, build and run to test all the functions in this module 
// https://github.com/dieskim/ly-count-appcelerator

//Require the Count.ly Module
var Countly = require('count.ly.messaging');

//Start Count.ly on own server without Messaging
//Countly.start('APP_KEY','http://YOUR_HOST.com');

//Start Count.ly on cloud without Messaging
//Countly.startOnCloud('APP_KEY');

// START IF - ENABLE DEBUGGING
if (OS_ANDROID){
	
	// enableDebug if needed
	Countly.enableDebug();

};
// END IF - ENABLE DEBUGGIN

// START IF - RECEIVE PUSH
if (OS_ANDROID){
	
	// ADD EVENTLISTENTER AND FUNCTION TO MODULE
	Countly.addEventListener('receivePush',function(pushMessageData){
	
	    // *** IN ANDROID THERE IS NO NEED TO RUN recordPushOpen as it happens Automatically on the Native Module side **//
	
	    // Ti.API.info Raw pushMessage
	    Ti.API.info("Received Push");  
	    Ti.API.info(JSON.stringify(pushMessageData));  
	
	    var pushID = pushMessageData.id;
	    var pushAlertMessage = pushMessageData.message;
	    var pushType = pushMessageData.type || 'unknownType';
	    var pushLink = pushMessageData.link || '';
	    var pushSound = pushMessageData.sound || '';
	    var pushData = pushMessageData.data;                        // all message data if needed
	
	    Ti.API.info("pushID: " + pushID + " pushAlertMessage: " + pushAlertMessage + "pushType: " + pushType + " pushData: " + pushData + " pushSound: " + pushSound);
	
	    if (pushType == "hasLink"){
	
	        ///////////////////////////////////////////////////////////
	        //              SHOW AN LINK ALERT HERE                 //
	        // 1. Use info  - pushType
	        //              - pushLink
	        //              - pushAlertMessage
	        // 2. Once user Takes action log action with recordPushAction using pushID
	
	
	    }else if (pushType == "hasReview"){
	
	        // SHOW AN REVIEW ALERT HERE 
	
	    }else if (pushType == "hasMessage"){
	
	        // SHOW NORMAL ALERT HERE
	
	    };
	
	});
	
}else{
	
		// START IF - iOS > 8
	if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
	
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
	
		 // Register notification types to use
	    Ti.App.iOS.registerUserNotificationSettings({
		    types: [
	            Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
	            Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
	            Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
	        ]
	    });
	    
	} else {  // ELSE for iOS 7 and earlier
		
	    Ti.Network.registerForPushNotifications({
	        // Specifies which notifications to receive
	        types: [
	            Ti.Network.NOTIFICATION_TYPE_BADGE,
	            Ti.Network.NOTIFICATION_TYPE_ALERT,
	            Ti.Network.NOTIFICATION_TYPE_SOUND
	        ],
	        success: deviceTokenSuccess,
	        error: deviceTokenError,
	        callback: receivePush
	    });
	};
	// END IF - iOS > 8	
	
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

	// START FUNCTION - receivePush for iOS
	function receivePush(pushMessage) {         
	
	    // Ti.API.info Raw pushMessage
	    Ti.API.info("Received Push:" + JSON.stringify(pushMessage));  
	
	    //////////////////////////////////////////////////////////////////////////////////////////////////////////
	    //                                                  pushMessage EXAMPLE                                 //
	    //                                                                                                      //
	    //          {"code":0,                                                                                  //
	    //          "data":{    "alert":"Test Message",                                                         //
	    //                      "category":"[CLY]_url",                                                         //
	    //                      "c":{"l":"http://count.ly","i":"551b9d03f593a55e11ea62c0"},                     //
	    //                      "sound":"default",                                                              //
	    //                      "aps":{"category":"[CLY]_url","sound":"default","alert":"test5"}                //
	    //                  },                                                                                  //
	    //          "type":"remote",                                                                            //
	    //          "source":{},                                                                                //
	    //          "inBackground":true,                                                                        //
	    //          "success":true};                                                                            //
	    //                                                                                                      //
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
	        //              SHOW AN LINK ALERT HERE                 //
	        // 1. Use info  - pushType
	        //              - pushLink
	        //              - pushAlertMessage
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

};
// START IF - RECEIVE PUSH


// START IF - Android or iOS
if (OS_ANDROID){

	// START Countly with Messaging - DEVELOPMENT TEST
	Countly.startMessagingTest('1a0ea80f9fbd51f457f76adfa5a614e6fc9da024','http://e3host.com','1028701652126');
	
	// START Countly with Messaging - PRODUCTION
	//Countly.startMessaging('COUNLY_APP_KEY','http://yourserver.com','GCM_PROJECT_ID');

}else{
	
	// START Countly with Messaging - DEVELOPMENT TEST
	Countly.setMessagingDeveloperMode();    // setMessagingDeveloperMode
	Countly.startMessagingTest('1a0ea80f9fbd51f457f76adfa5a614e6fc9da024','http://e3host.com');
	
	//START Countly with Messaging - PRODUCTION
	//Countly.startMessaging('YOUR_APP_KEY','http://yourserver.com');
	
}



//Count.ly Record Events
function logEvent(){
	
	//Set any of the following Fields in an Object
	var segmentation = {device:"iPhone 4S", country:"USA"};
	var eventData = {name: "keySegmentationCountSum", segmentation:segmentation, count: 1, sum: 0.99};
	
	Ti.API.log("Log Event");
	Countly.event(eventData);
	
};

function setUserData(){
	
	//Count.ly Set UserData
	var userData = {    name: "testName",
						username: "testUsername",
						email: "testemail@gmail.com",
						organization: "testOrg",
						phone: "testPhone",
						picture: "https://count.ly/wp-content/uploads/2014/10/logo.png",
						picturePath: "/images/appicon.png",
						gender: "M",
						byear: "1980",
	};
	var customUserData = {  key1: "value1",
							key2:"value2",
	};
	
	var args = {    userData:userData,
	customUserData:customUserData,
	};
	
	Ti.API.log("Set UserData");
	Countly.userData(args);

};

// Start Crash Reporting
//Countly.startCrashReporting();

// Start Crash Reporting with Segments
// Add Keypairs to be added to every Crash taht is logged for this app
// Example: FacebookSDK: "4.0"
var segments = { 	key1: "value1",
					key2: "value2",
};

Countly.startCrashReportingWithSegments(segments);

// Run a Native Crash Test (Auto Crash Log)
// - Test will quit out of app
// - Native module will catch exception on native side and log to Countly. 
function runNativeCrashTest(){	
	Countly.crashTest(3);
};


// Add Crash Log Entry
// - add strings entries to the crash log as needed
// - will be sent with crash log when/if app crashes
function addCrashLog(){
	
	Ti.API.log("addCrashLog Event");
	var crashLog = { message: "Error Message",
					 key1: "value1",
	};
	
	Countly.addCrashLog(crashLog);
	
};
// Run a Fatal Exception cought in Javascript side (Auto Crash Log) - Titanium 4.1 ONLY
// - Test will NOT QUIT out of app in development
// - Error will be logged on Javascript side and sent to native module to send to Countly
// - For this to work you for need to add the uncaughtException listener to the app
// - Then run the Countly.recordUncaughtException inside the 

//Alloy.Globals.logError = true;

Ti.App.addEventListener('uncaughtException', function(exception) {
		
		Ti.API.log("Javascript Fatal Exception");
		
		// send exception to Countly
		Countly.recordUncaughtException(exception);	
	
});

function runFatalCrashTest(){	
	//Countly.crashTest(1);	
	//Countly.crashTest(2);
	Countly.crashTest(4);	
};

// Run a NON Fatal Exception cought in Javascript side (NOT Auto Crash Log)
// - This is a Crash Log you can Define and send Manually very much like an error log
function runNonFatalCrashTest(){	
	
	var exception = {
		message: "Custom Error",
		key1: "value1",
		key2: "value2",
	};
	
	// send exception to Countly
	Countly.recordHandledException(exception);	
	
};