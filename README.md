# New Town Dining Club 🥦

A Fictional dining club in New Town Birmingham, used to exercise usage of EventBridge.

I wrote a [blog about this](https://medium.com/@robertcurran5635/test-driving-the-aws-serverless-event-router-cc031aec00fd) 

All of the infrastructure required to run this is in the Cloud Formation [template.yaml](https://github.com/Ro5635/newTownDiningClub/blob/master/template.yaml) file.

Emails are created and stored in dynamoDB with the messageId added to a dispatchQueue, 
this dispatch queue is handled by lambda which will read of events from the dispatch 
queue at a sedate 🤞 rate and dispatch them using aws SES.

This service uses a single table with heterogeneous keys, so see the data design for the 
key names.

### API:

#### POST: {API URL}/vendor
Create a new Vendor

#### POST: {API URL}/webhooks/vendor?source=trello

Update the state of a vendor.

### Events:

#### vendorCreated
Published on the creation of a new vendor with the details of vendor and its vendorId

### vendorUpdated
Published on updates to an existing vendor, contains past and new state.

 

Build and lint:
```
npm run build
```

Publish:
```
npm run publish
```

