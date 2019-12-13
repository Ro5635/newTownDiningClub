# Bare Minimum JS Lambda 🥦

Some what Minimal code setup needed to get a AWS Lambda up for testing something, this is not a best practice thing, just a quick thing.

Package:
```
sam package --s3-bucket your-cf-bucket  --output-template-file packaged.yaml
```

Deploy:
```
 sam deploy --template-file /FULL/PATH/TO/packaged.yaml --stack-name YOUR_STACK_NAME --region eu-west-1 --capabilities CAPABILITY_IAM
```
