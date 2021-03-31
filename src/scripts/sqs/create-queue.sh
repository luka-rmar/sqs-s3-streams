#!/bin/bash

QUEUENAME=$1

aws  \
     sqs create-queue \
     --queue-name $QUEUENAME \
     --endpoint-url=http://localhost:4566



aws  \
     sqs list-queues \
     --endpoint-url=http://localhost:4566




