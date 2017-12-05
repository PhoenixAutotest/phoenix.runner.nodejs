#!/usr/bin/env node

var mvn = require('maven');
mvn = new mvn();
console.log(mvn.execute);
mvn.execute(['dependency:copy-dependencies', '-o']);

var fs = require('fs');
function copy(src, dst) {
    fs.writeFileSync(dst, fs.readFileSync(src));
}

fs.exists('target/lib', function (exists) {
    if(!exists) {
        fs.mkdir('target/lib');
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

travel('target/dependency', function (path, file) {
    copy(path, 'target/lib/' + file);
});

fs.readdirSync('target/lib/').forEach(function(file) {
    if(file === 'autotest.suite.runner-1.0.1-20170824-SNAPSHOT.jar') {
        copy('target/lib/' + file, 'target/' + file);
    }
});

var exec = require('child_process').exec;
exec('java -jar target/autotest.suite.runner-1.0.1-20170824-SNAPSHOT.jar -runners test.xml', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(err);
});