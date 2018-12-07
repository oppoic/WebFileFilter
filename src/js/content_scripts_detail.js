//console.log("content_scripts_detail.js");
document.addEventListener('DOMContentLoaded', function () {
    //console.log('content_scripts_detail.js DOMContentLoaded');

    var preList = document.getElementsByTagName("pre");
    if (preList.length == 1) {
        var lineList = preList[0].innerHTML.split("\n");
        //console.log(lineList);
        if (lineList.length > 0) {
            var nodeDoctype = document.implementation.createDocumentType('html', '', '');
            if (document.doctype) {
                document.replaceChild(nodeDoctype, document.doctype);
            } else {
                document.insertBefore(nodeDoctype, document.childNodes[0]);
            }

            $("html").attr("lang", "zh-CN");
            $("head").html('<head><meta charset="UTF-8"><link rel="shortcut icon" href="" /><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>FileDetail</title></head>');

            $("[rel='shortcut icon']").attr("href", chrome.extension.getURL("images/icon_16px.png"));

            $("body").html('<div class="container-fluid"><div class="row"><div id="nav" class="col-sm-4 col-md-6 col-lg-6" style="overflow-y: scroll;"><ul class="nav nav-pills nav-stacked"></ul></div><div id="detail" class="col-sm-8 col-md-6 col-lg-6" style="overflow-y: scroll;"><div class="container-fluid"><div class="row"><div class="col-sm-12 col-md-12 col-lg-12"><fieldset><legend>格式化JSON</legend><div id="jsonFormat"></div></fieldset></div></div><div class="row"><div class="col-sm-12 col-md-12 col-lg-12"><fieldset><legend>原始字符串</legend><div id="jsonOrigin"></div></fieldset></div></div></div></div></div></div>');

            var wHeight = $(window).height();
            $("#nav").height(wHeight);
            $("#detail").height(wHeight);

            var level = '', time = '', logStore = '', source = ''; var ifLegalItem = false;
            lineList.reverse();
            $.each(lineList, function (i, v) {
                if (v == undefined || v == "") {
                    var line = parseInt(i);
                    line += 1;
                    console.log("line:" + line + " is empty");
                    return true;//continue;
                }
                if (!ifLegalItem) {
                    ifLegalItem = true;
                }

                level = '-'; time = '-'; logStore = '-'; source = '-';
                //console.log(v);
                //console.log(JSON.parse(v));

                try {
                    var obj = JSON.parse(v);
                    if (obj.Level != undefined) {
                        level = obj.Level
                    }
                    if (obj.Time != undefined) {
                        time = formatDate(obj.Time)
                    }
                    if (obj.LogStore != undefined) {
                        logStore = obj.LogStore
                    }
                    if (obj.Source != undefined) {
                        source = obj.Source
                    }
                    $("#nav ul").append("<li><a href='javascript:;'>" + showLevel(level) + "&nbsp;&nbsp;<strong>" + time + "</strong>&nbsp;&nbsp;[Project]&nbsp;" + logStore + "&nbsp;&nbsp;[Source]&nbsp;" + source + "</a><input type='hidden' value='" + escape(v) + "'></li>");
                }
                catch (ex) {
                    $("#nav ul").append("<li><a href='javascript:;'>" + showLevel('格式错误') + "&nbsp;&nbsp;本条格式错误，请点击查看原始字符串</a><input type='hidden' value='" + escape(v) + "'></li>");
                }
            });
            if (ifLegalItem) {
                navLiClick($("#nav ul li:first"));
            }
        }
        else {
            console.log("can't find any line in <pre> tag");
        }
    }
    else {
        console.log("page's <pre> tag count illegal:" + preList.length);
    }

    $("body").on("click", "#nav ul li", function () {
        navLiClick($(this));
    });

    function navLiClick(obj) {
        obj.addClass("active").siblings().removeClass("active");
        var jsonOriginStr = unescape(obj.find("input:hidden").val());
        $("#jsonOrigin").html(jsonOriginStr);

        try {
            var jsonFormatStr = new JSONFormat($.trim(jsonOriginStr), 4).toString();
            $("#jsonFormat").html(jsonFormatStr);
        }
        catch (ex) {
            console.log(jsonOriginStr);
            $("#jsonFormat").html('<h4>格式化失败，请查看下方原始字符串</h4>');
        }
    }

    function showLevel(level) {
        var levelFormat = '';
        switch (level.toLowerCase()) {
            case "debug":
                levelFormat = '<span class="label label-primary">' + level + '</span>';
                break;
            case "info":
                levelFormat = '<span class="label label-default">&nbsp;&nbsp;' + level + '&nbsp;&nbsp;</span>';
                break;
            case "warn":
                levelFormat = '<span class="label label-info">&nbsp;' + level + '&nbsp;</span>';
                break;
            case "error":
                levelFormat = '<span class="label label-warning">&nbsp;' + level + '&nbsp;</span>';
                break;
            case "fatal":
                levelFormat = '<span class="label label-danger">&nbsp;' + level + '&nbsp;</span>';
                break;
            default:
                levelFormat = '<span class="label label-danger">' + level + '</span>';
                break;
        }
        return levelFormat;
    }

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
});