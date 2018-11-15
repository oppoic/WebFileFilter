console.log("content_scripts_list.js");
document.addEventListener('DOMContentLoaded', function () {
    console.log('content_scripts_list.js DOMContentLoaded');

    var logList = [];
    var preList = document.getElementsByTagName("pre");
    if (preList.length == 1) {
        var lineList = preList[0].innerHTML.split("\n");
        if (lineList.length > 0) {
            var splitLinetext = []; var splitFileName = []; var fileName = '';
            $.each(lineList, function (i, v) {
                //console.log(v);
                if (i == 0 || v == undefined || v == "")
                    return true;//continue;

                splitLinetext = v.split(/\s+/);
                if (splitLinetext.length != 5)
                    return true;
                //console.log(splitLinetext);

                fileName = splitLinetext[1].match(/>(\S*)</)[1];
                //console.log(fileName);
                if (fileName == null || fileName == '')
                    return true;

                splitFileName = fileName.split('-');
                if (splitFileName.length != 3)
                    return true;
                //console.log(splitFileName);

                logList.push({ Project: splitFileName[0], LogDate: splitFileName[1], LogHour: splitFileName[2], LogChangeTime: formatDate(splitLinetext[2] + ' ' + splitLinetext[3]), LogSize: splitLinetext[4] });
            });
            //console.log(logList);

            var nodeDoctype = document.implementation.createDocumentType('html', '', '');
            if (document.doctype) {
                document.replaceChild(nodeDoctype, document.doctype);
            } else {
                document.insertBefore(nodeDoctype, document.childNodes[0]);
            }

            $("html").attr("lang", "zh-CN");
            $("head").html('<head><meta charset="UTF-8"><link rel="shortcut icon" href="" /><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>LogList</title></head>');

            $("[rel='shortcut icon']").attr("href", chrome.extension.getURL("images/icon_16px.png"));

            $("body").removeAttr("bgcolor").html('<nav class="navbar navbar-default navbar-static-top"><div class="container"><div class="row"><div class="col-sm-2 col-md-2 col-lg-2"></div><div class="col-sm-10 col-md-10 col-lg-10"><div class="navbar-header"><button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button></div><div id="navbar" class="collapse navbar-collapse"><ul class="nav navbar-nav"></ul></div></div></div></div></nav><div class="container"><div class="row"><div id="nav" class="col-sm-2 col-md-2 col-lg-2"><ul class="nav nav-pills nav-stacked"></ul></div><div class="col-sm-10 col-md-10 col-lg-10"><table id="table" class="table table-bordered"></table></div></div></div>');

            var pNames = getProjectNames();
            $.each(pNames, function (idx, val) {
                $("#navbar ul").append("<li data-value=\"" + val + "\"><a href='javascript:;'><strong>" + val + "</strong></a></li>");
            });
            if (pNames.length > 0) {
                if (localStorage.pName != undefined && $.inArray(localStorage.pName, pNames) != -1)
                    navBarLiClick(localStorage.pName);
                else
                    navBarLiClick(pNames[0]);
            }
            else {
                $("body").html('<div class="container"><div class="row"><div class="col-sm-12 col-md-12 col-lg-12"><h3>暂无日志，请稍后刷新重试！</h3></div></div></div>');
            }
        }
        else {
            console.log("can't find any line in <pre> tag");
        }
    }
    else {
        console.log("page's <pre> tag count illegal:" + preList.length);
    }

    $("body").on("click", "#navbar ul li", function () {
        navBarLiClick($(this).attr("data-value"));
    });

    $("body").on("click", "#nav ul li", function () {
        navLiClick($(this).attr("data-pname"), $(this).attr("data-date"));
    });

    $("body").on("click", "#table tbody tr", function () {
        $(this).css("background", "#DCDCDC").siblings().css("background", "");
    });

    function formatDate(dt) {
        var date = new Date(dt);
        var aaaa = date.getFullYear();
        var gg = date.getDate();
        var mm = (date.getMonth() + 1);

        if (gg < 10) gg = "0" + gg;
        if (mm < 10) mm = "0" + mm;

        var cur_day = aaaa + "-" + mm + "-" + gg;
        var hours = date.getHours()
        var minutes = date.getMinutes()
        //var seconds = date.getSeconds();

        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        //if (seconds < 10) seconds = "0" + seconds;

        //return cur_day + " " + hours + ":" + minutes + ":" + seconds;
        return cur_day + " " + hours + ":" + minutes;
    }

    function getProjectNames() {
        return JSLINQ(logList).Distinct(function () { return this.Project; }).items;
    }

    function getDistinctProjectLogDate(pName) {
        return JSLINQ(logList).Where(function () { return this.Project == pName; }).Distinct(function () { return this.LogDate; }).items;
    }

    function getProjectLogFiles(pName, logDate) {
        if (logDate == 'all') {
            return JSLINQ(logList).Where(function () { return this.Project == pName; }).Select("LogDate,LogHour,LogChangeTime,LogSize").items;
        }
        else {
            return JSLINQ(logList).Where(function () { return this.Project == pName && this.LogDate == logDate; }).Select("LogDate,LogHour,LogChangeTime,LogSize").items;
        }
    }

    function navBarLiClick(liPName) {
        $("#navbar ul li[data-value=\"" + liPName + "\"]").addClass("active").siblings().removeClass("active");

        $("#nav ul").empty();
        $("#nav ul").append("<li data-pname=\"" + liPName + "\" data-date=\"all\"><a href='javascript:;'>all</a></li>");

        var liDate = '';
        var listReverse = getDistinctProjectLogDate(liPName).reverse();
        $.each(listReverse, function (i, v) {
            if (localStorage.logDate != undefined && localStorage.pName != undefined && localStorage.pName == liPName && localStorage.logDate == v) {
                liDate = localStorage.logDate;
                $("#nav ul").append("<li class='active' data-pname=\"" + liPName + "\" data-date=\"" + v + "\"><a href='javascript:;'>" + v + "</a></li>");
            }
            else {
                $("#nav ul").append("<li data-pname=\"" + liPName + "\" data-date=\"" + v + "\"><a href='javascript:;'>" + v + "</a></li>");
            }
        });
        if (liDate == '') {
            liDate = 'all';
            $("#nav ul li:first").addClass("active");
        }
        initLogList(liPName, liDate);
    }

    function navLiClick(liPName, liDate) {
        $("#nav ul li[data-date=\"" + liDate + "\"]").addClass("active").siblings().removeClass("active");
        initLogList(liPName, liDate);
    }

    function initLogList(pName, logDate) {
        if (localStorage.pName != pName)
            localStorage.pName = pName;
        if (localStorage.logDate != logDate)
            localStorage.logDate = logDate;

        var fileList = getProjectLogFiles(pName, logDate).reverse();

        $("#table").empty();
        $("#table").append("<thead><tr><th>文件名</th><th>时间</th><th>大小</th><th>操作</th></tr></thead><tbody>");
        if (fileList.length > 0) {
            $.each(fileList, function (i, v) {
                $("#table").append("<tr><td>" + pName + "-" + v.LogDate + "-" + v.LogHour + "</td><td>" + v.LogChangeTime + "</td><td>" + v.LogSize + "</td><td><a href='" + pName + "-" + v.LogDate + "-" + v.LogHour + "' target='_blank'>查看</a></td></tr>");
            });
        }
        else {
            $("#table").append("<tr><td colspan='4'><center>暂无数据</center></td></tr>");
        }
        $("#table").append("</tbody>");
    }
});