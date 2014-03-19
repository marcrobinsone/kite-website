#!/bin/bash
set -e

##### MANUAL STEPS
#
# 1. make sure that your gopath is set correctly (kite-repo:koding-repo)
# 2. run this script in kite-website directory
#

IFS=':' read -a array <<< "$GOPATH"
FIRST="${array[0]}"  # first component of gopath
KITEPATH=$FIRST/src/github.com/koding/kite  # path to the kite project

# kill all running processes
killall main    || true
killall kontrol || true
killall math    || true

# delete existing kite.key
rm -rf $HOME/.kite

# generate rsa keys
openssl genrsa -out /tmp/privateKey.pem 2048
openssl rsa -in /tmp/privateKey.pem -pubout > /tmp/publicKey.pem

# initialize machine with new kite.key
go run $KITEPATH/regserv/regserv/main.go -public-key /tmp/publicKey.pem -private-key /tmp/privateKey.pem -init -username devrim -kontrol-url "ws://localhost:4000"

# run essential kites
go run kontrol/kontrol.go -public-key /tmp/publicKey.pem -private-key /tmp/privateKey.pem &
go run $KITEPATH/proxy/proxy/main.go -public-key /tmp/publicKey.pem -private-key /tmp/privateKey.pem &
go run $KITEPATH/regserv/regserv/main.go -public-key /tmp/publicKey.pem -private-key /tmp/privateKey.pem &

# run simple math kite
go run math/math.go
