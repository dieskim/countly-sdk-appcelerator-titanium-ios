// This is a test harness for your module
// You should do something interesting in this harness
// to test out the module and to provide instructions
// to users on how to use it by example.


// open a single window
var win = Ti.UI.createWindow({
	backgroundColor:'white'
});
var label = Ti.UI.createLabel();
win.add(label);
win.open();

// Start Countly
var Countly = require('count.ly.messaging');

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
	
// START Countly with Messaging - DEVELOPMENT TEST
Countly.setMessagingDeveloperMode();	// setMessagingDeveloperMode
Countly.startMessagingTest('YOUR_APP_KEY','http://yourserver.com');
	
// START Countly with Messaging - PRODUCTION
//Countly.startMessaging('YOUR_APP_KEY','http://yourserver.com');
		
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
            
    	var pushType = "PushToOpenLink";
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
            
            var pushType = "PushToReview";
            
            // SHOW AN REVIEW ALERT HERE 
  
        } else if (pushMessage.data.c.u) {
            
            var pushType = "PushToUpdate";
            
            // SHOW AN UPDATE ALERT HERE

        } else {
        	
        	var pushType = "PushNormal";
        	
        	// SHOW NORMAL ALERT HERE
        }
        // END IF - Set PUSH CATEGORY TYPE
        
        
};
// END FUNCTION - receivePush for iOS

// Countly Set user location
// - Takes two strings: latitudeString and longitudeString of 2 digit lengths
var latitudeString = 12;
var longitudeString = 10;
Countly.setLocation(latitudeString,longitudeString);

