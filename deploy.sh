aws cloudformation deploy \
    --template-file ./packaged-template.cf.json \
    --capabilities CAPABILITY_IAM \
    --stack-name numnum 