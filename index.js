#!/usr/bin/env node

var exec = require('child_process').exec;
exec('java -jar autotest.suite.runner-1.0.1-20170824-SNAPSHOT.jar -runners test.xml', function (err, stdout, stderr) {
    console.log(stdout);
});