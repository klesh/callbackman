# Introduction

A develop tool to help you observe what is being sent to your server. Kinda like postman on server side for developer


# Usage

## Step 1: start up server daemon

```bash
$ docker pull callbackman
$ docker run --rm --name callbackman -p 3000:3000 -d callbackman node index.js
```


## Step 2:

Open Chrome and browse to `http://localhost:3000`


## Step 3:

Send request to `http://localhost:3000/api/callback`, i.e:
```bash
$ curl -XPOST localhost:3000/callback?hello -H 'Content-Type: application/json' -d '{"hello":"wolrd","foo":"bar"}'
```

## Step 4:

Requested URL/Headers/Body should show on webpage of Step2 automaticall.
![](https://github.com/klesh/callbackman/raw/master/public/example.png)
