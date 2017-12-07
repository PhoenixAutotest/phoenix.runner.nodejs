#!/usr/bin/env node

var fs = require('fs');
var os = require('os');
var cli = require('cli');
var program = require('commander');
var exec = require('child_process').exec;

program.version('0.0.1')
    .option('-u, --update', '更新程序')
    .option('-r, --runners <items>', '测试套件')
    .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
    .parse(process.argv);

var OPTIONS = {

};

var exports = {
    interpret: function (args) {
        cli.setArgv(args);
        cli.setApp(path.resolve(__dirname + "/package.json"));
    },
    copy: function (src, dst) {
        fs.writeFileSync(dst, fs.readFileSync(src));
    },
    copyDemo: function () {
        var baseDir = os.homedir() + '/phoenix';

        this.copy(__dirname + '/pom.xml', baseDir + '/pom.xml');
        this.copy(__dirname + '/test.xml', baseDir + '/test.xml');
        this.copy(__dirname + '/page-demo.xml', baseDir + '/page-demo.xml');
    },
    getBaseDir: function () {
        var baseDir = os.homedir() + '/phoenix';

        return baseDir;
    },
    update: function (callback) {
        var baseDir = os.homedir() + '/phoenix';

        function exe() {
            exec('mvn -f ' + baseDir + '/pom.xml package', function(){
                if((typeof callback) === 'function') {
                    callback();
                }
            });
        }

        fs.exists(baseDir, function (exists) {
            if(!exists) {
                fs.mkdir(baseDir, function(){
                    exe();
                });
            }else{
                exe();
            }
        });
    },
    execute: function () {
        var baseDir = this.getBaseDir();
        var param = this.getPhoenixParam();
        var cmd = 'java -jar ' + baseDir + '/autotest.suite.runner-1.0.1-20170824-20171205.093339-1.jar' + param;
        console.log(cmd);

        exec(cmd, function (err, stdout, stderr) {
            console.log(stdout);
            console.log(err);
        });
    },
    getPhoenixParam: function () {
        var param = '';
        if(program.runners) {
            param += ' -runners ' + program.runners;
        }

        return param;
    }
};

module.exports = exports;

if(program.update) {
    exports.update(exports.execute);
} else {
    exports.execute();
}