
### Data Access Requirements:
* Get vendor
* Get accepted vendors
* Get vendors by eventId
* Get email by emailId


pk							sk										GSI1-PK				GSI1-SK
vendor_{id} 				detail 									'vendor' 			vendorState
vendor_{id}					primaryContact							email				'contact'
event_{id}					vendor_{id}								vendorId			'event_{date}'
event_{id}					detail
Message_{id}				messageType_{email}						Vendor_{id}			message_{timestamp}					messageId	vendorId	messageType

Going to need to have 2 index's to stop excessive de-normalisation for this :( 
