#!/usr/bin/env node

var mvn = require('maven');
mvn = new mvn();
mvn.execute(['-f ' + __dirname + '/pom.xml', 'dependency:copy-dependencies']);

var fs = require('fs');
function copy(src, dst) {
    fs.writeFileSync(dst, fs.readFileSync(src));
}

fs.exists(__dirname + '/target/lib', function (exists) {
    if(!exists) {
        fs.mkdir(__dirname + '/target/lib');
    }
});

var path = require('path');

function travel(dir, callback) {
    fs.readdirSync(dir).forEach(function(file) {
        var pathname = path.join(dir, file);

        if(fs.statSync(pathname).isDirectory()) {
            travel(pathname, callback);
        }else {
            callback(pathname, file);
        }
    });
}

travel(__dirname + '/target/dependency', function (path, file) {
    copy(path, __dirname + '/target/lib/' + file);
});

fs.readdirSync(__dirname + '/target/lib/').forEach(function(file) {
    if(file === 'autotest.suite.runner-1.0.1-20170824-SNAPSHOT.jar') {
        copy(__dirname + '/target/lib/' + file, __dirname + '/target/' + file);
    }
});

var exec = require('child_process').exec;
exec('java -jar ' + __dirname + '/target/autotest.suite.runner-1.0.1-20170824-SNAPSHOT.jar -runners test.xml', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(err);
});