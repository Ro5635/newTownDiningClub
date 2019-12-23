# Bare Minimum JS Lambda 🥦

This is some a what Minimal code setup needed to get a AWS Lambda up for testing something, this was once much more minimal, if you want the non linted, babled ES6 etc version then see the minimalNoBabel branch of this repo.

This is set up as an HTTP API, the routing for the endpoints is defined within the SAM template.

This was repo created and is maintained to be used as a common building block in my projects.

Build and lint:
```
npm run build
```

Package:
```
sam package --s3-bucket your-cf-bucket  --output-template-file packaged.yaml
```

Deploy:
```
 sam deploy --template-file /FULL/PATH/TO/packaged.yaml --stack-name YOUR_STACK_NAME --region eu-west-1 --capabilities CAPABILITY_IAM
```
