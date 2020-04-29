.PHONY: build clean create-package-dir package deploy

BUCKET_NAME := $(shell cat .bucket-name)

build: clean
	@sam build

clean:
	@rm -rf .package .aws-sam

create-package-dir:
	@mkdir .package

package: clean create-package-dir build
	@sam package --output-template-file ".package/packaged-template.yaml" --s3-bucket "$(BUCKET_NAME)"

deploy: package
	@sam deploy \
		--template-file .package/packaged-template.yaml \
		--stack-name aws-xray-demo \
		--capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND
