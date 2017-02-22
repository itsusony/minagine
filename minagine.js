#! /usr/local/bin/phantomjs
var args = require('system').args;
function args_error(){console.log("args error");phantom.exit();}

if (args.length == 4) {
    var userid = args[1];
    var passwd = args[2];
    var how    = args[3];
    if (!userid || !/^[a-zA-Z._]+@[a-zA-Z._]+$/.test(userid) || !passwd || how || !/^[01]$/.test(how)) args_error();

    var url_login = 'https://minagine.awg.co.jp/hcm/user/login';
    var page = require('webpage').create();
    page.onError = function(msg, trace) { }
    page.onAlert = function(msg){ console.log(msg); }

    function first_login(){
        page.evaluate(function(u,p){
            document.querySelector("#user_cntrctr_dmn").value='fout.jp';
            document.querySelector("#user_login").value=u;
            document.querySelector("#user_password").value=p;
            document.querySelector("form").submit();
        }, userid, passwd);
        page.onLoadFinished = logined;
    }
    function logined() {
        var rtn = page.evaluate(function(h){
            var fms = j$("form");
            if (fms.length == 3 && fms[1].id && /^input_form/.test(fms[1].id)) {
                j$("#button"+h).click();
                return 1;
            }
            return 0;
        }, how);
        setTimeout(function(){console.log(rtn);phantom.exit();},2000);
    }
    page.open(url_login, first_login);
} else {
    args_error();
}
