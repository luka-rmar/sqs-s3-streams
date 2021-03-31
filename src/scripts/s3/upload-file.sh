#!/bin/bash

BUECKETNAME=$1
FILE_PATH=$2

aws s3 cp $FILE_PATH s3://$BUECKETNAME \
      --endpoint-url=http://localhost:4566


aws s3 ls \
    --endpoint-url=http://localhost:4566