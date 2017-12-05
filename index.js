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

var os = require('os');
console.log(os.homedir());
var baseDir = os.homedir() + '/phoenix';
console.log(baseDir);

function exe() {
    copy(__dirname + '/pom.xml', baseDir + '/pom.xml');
    //mvn.execute(['-f ' + baseDir + '/pom.xml', 'dependency:copy-dependencies']);
    exec('mvn -f ' + baseDir + '/pom.xml package', function(){
        var exec = require('child_process').exec;
        exec('java -jar ' + baseDir + '/autotest.suite.runner-1.0.1-20170824-20171205.093339-1.jar -runners test.xml', function (err, stdout, stderr) {
            console.log(stdout);
            console.log(err);
        });
    });
}

fs.exists(baseDir, function (exists) {
    console.log(exists);
    if(!exists) {
        fs.mkdir(baseDir, function(){
            exe();
        });
    }else{
        exe();
    }
});
