aws cloudformation package \
    --template-file ./template.cf.json \
    --s3-bucket numnum-cloudformation-template \
    --use-json \
    --output-template-file ./packaged-template.cf.json