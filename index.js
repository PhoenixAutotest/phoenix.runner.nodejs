#!/usr/bin/env node

var mvn = require('maven');
mvn = new mvn();
//mvn.execute(['-f ' + __dirname + '/pom.xml', 'dependency:copy-dependencies']);
var exec = require('child_process').exec;
//exec('mvn -f ' + __dirname + '/pom.xml dependency:copy-dependencies');

var fs = require('fs');
function copy(src, dst) {
    fs.writeFileSync(dst, fs.readFileSync(src));
}

copy(__dirname + '/pom.xml', '~/.phoenix/pom.xml');
mvn.execute(['-f ~/pom.xml', 'dependency:copy-dependencies']);

var baseDir = '~';

fs.exists(baseDir + '/target/lib', function (exists) {
    if(!exists) {
        fs.mkdir(baseDir + '/target/lib');
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

fs.exists(baseDir + '/target/dependency', function (exists) {
   if(exists) {
       travel(baseDir + '/target/dependency', function (path, file) {
           copy(path, baseDir + '/target/lib/' + file);
       });

       fs.readdirSync(baseDir + '/target/lib/').forEach(function(file) {
           if(file === 'autotest.suite.runner-1.0.1-20170824-SNAPSHOT.jar') {
               copy(baseDir + '/target/lib/' + file, baseDir + '/target/' + file);
           }
       });

       var exec = require('child_process').exec;
       exec('java -jar ' + baseDir + '/target/autotest.suite.runner-1.0.1-20170824-SNAPSHOT.jar -runners test.xml', function (err, stdout, stderr) {
           console.log(stdout);
           console.log(err);
       });
   }
});