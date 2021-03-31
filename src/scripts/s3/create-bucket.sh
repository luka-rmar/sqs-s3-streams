#!/bin/bash

BUECKETNAME=$1

aws  s3 mb s3://$BUECKETNAME \
      --endpoint-url=http://localhost:4566


aws s3 ls \
    --endpoint-url=http://localhost:4566