



get vendor

get acccepted vendors

get vendors by eventId



pk							sk					
vendor_{id} 				detail
vendor_{id}					primaryContact
vendors						acccepted_vendor_{vendorId} 			vendorId		timeStamp
vendors						rejected_vendor_{vendorId}				vendorId		timeStamp
vendors						pendingReview_vendor_{vendorId}			vendorId		timeStamp
event_{id}					vendor_{id}								vendorId
event_{id}					detail



Alternative is to a SK on vendorState and pk on type vendor, I think this will be easier than a load of denomalisation...



pk							sk										GSI1-PK				GSI1-SK
vendor_{id} 				detail 									'vendor' 			vendorState
vendor_{id}					primaryContact							email				'contact'
event_{id}					vendor_{id}								vendorId			'event_{date}'
event_{id}					detail





De-normalisation there of the accepted state of the vendor... show how this is handled in teh event to update all of these aspects in a 
single transaction...

Will need to say that as it stands this is a single shot system, if an event fails to be handled it will just buggle into a oblivian, to
get around this the events should be routed to a sqs queue where it can be retroed etc... But to save typing I have ignored that here...


Going to need to re-build the table I think...
