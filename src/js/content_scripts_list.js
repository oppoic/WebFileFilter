//console.log("content_scripts_list.js");
document.addEventListener('DOMContentLoaded', function () {
    //console.log('content_scripts_list.js DOMContentLoaded');

    var fileList = [];
    var preList = document.getElementsByTagName("pre");
    if (preList.length == 1) {
        var lineList = preList[0].innerHTML.split("\n");
        //console.log(lineList);
        if (lineList.length > 0) {
            var splitLinetext = []; var splitFileName = []; var fileName = '';
            $.each(lineList, function (i, v) {
                //console.log(v);
                if (i == 0) {
                    return true;//continue;
                }
                if (v == undefined || v == "") {
                    var line = parseInt(i);
                    line += 1;
                    console.log("line:" + line + " is empty");
                    return true;
                }

                splitLinetext = v.split(/\s+/);
                if (splitLinetext.length != 5) {
                    console.log(splitLinetext);
                    return true;
                }

                fileName = splitLinetext[1].match(/>(\S*)</)[1];
                //console.log(fileName);
                if (fileName == null || fileName == '') {
                    console.log("fileName is or empty");
                    return true;
                }

                splitFileName = fileName.split('-');
                if (splitFileName.length < 3) {
                    console.log(splitFileName);
                    return true;
                }

                fileList.push({ PartA: splitFileName[0], PartB: splitFileName[1], FileTime: formatDate(splitLinetext[2] + ' ' + splitLinetext[3]), FileSize: splitLinetext[4], FileName: fileName });
            });
            //console.log(fileList);

            var nodeDoctype = document.implementation.createDocumentType('html', '', '');
            if (document.doctype) {
                document.replaceChild(nodeDoctype, document.doctype);
            } else {
                document.insertBefore(nodeDoctype, document.childNodes[0]);
            }

            $("html").attr("lang", "zh-CN");
            $("head").html('<head><meta charset="UTF-8"><link rel="shortcut icon" href="" /><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>FileList</title></head>');

            $("[rel='shortcut icon']").attr("href", chrome.extension.getURL("images/icon_16px.png"));

            $("body").removeAttr("bgcolor").html('<nav class="navbar navbar-default navbar-static-top"><div class="container"><div class="row"><div class="col-sm-2 col-md-2 col-lg-2"></div><div class="col-sm-10 col-md-10 col-lg-10"><div class="navbar-header"><button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button></div><div id="navbar" class="collapse navbar-collapse"><ul class="nav navbar-nav"></ul></div></div></div></div></nav><div class="container"><div class="row"><div id="nav" class="col-sm-2 col-md-2 col-lg-2"><ul class="nav nav-pills nav-stacked"></ul></div><div class="col-sm-10 col-md-10 col-lg-10"><table id="table" class="table table-bordered"></table><ul class="pager"><span id="pageIndexSpan"></span>&nbsp;/&nbsp;<span id="pageSizeSpan"></span>&nbsp;/&nbsp;<span id="totalCountSpan"></span>&nbsp;&nbsp;<li id="previousPageLi"><a href="javascript:;">Prev</a></li>&nbsp;<li id="nextPageLi"><a href="javascript:;">Next</a></li></ul></div></div></div>');

            var partAs = getDistinctPartA();
            $.each(partAs, function (idx, val) {
                $("#navbar ul").append("<li data-value=\"" + val + "\"><a href='javascript:;'><strong>" + val + "</strong></a></li>");
            });
            if (partAs.length > 0) {
                if (localStorage.partA != undefined && $.inArray(localStorage.partA, partAs) != -1)
                    navBarLiClick(localStorage.partA);
                else
                    navBarLiClick(partAs[0]);
            }
            else {
                $("body").html('<div class="container"><div class="row"><div class="col-sm-12 col-md-12 col-lg-12"><h3>no data, pls wait and refresh this page :)</h3></div></div></div>');
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
        navLiClick($(this).attr("data-parta"), $(this).attr("data-partb"));
    });

    $("body").on("click", "#table tbody tr", function () {
        $(this).css("background", "#DCDCDC").siblings().css("background", "");
    });

    $("body").on("click", "#previousPageLi", function () {
        if (localStorage.pageIndex != 1) {
            localStorage.pageIndex = parseInt(localStorage.pageIndex) - 1;
            initFileList(localStorage.partA, localStorage.partB);
        }
    });

    $("body").on("click", "#nextPageLi", function () {
        var totalPageCount = localStorage.totalCount % localStorage.pageSize == 0 ? localStorage.totalCount / localStorage.pageSize : Math.ceil(localStorage.totalCount / localStorage.pageSize);
        if (localStorage.pageIndex != totalPageCount) {
            localStorage.pageIndex = parseInt(localStorage.pageIndex) + 1;
            initFileList(localStorage.partA, localStorage.partB);
        }
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

    function getDistinctPartA() {
        return JSLINQ(fileList).Distinct(function () { return this.PartA; }).items;
    }

    function getDistinctPartB(partA) {
        return JSLINQ(fileList).Where(function () { return this.PartA == partA; }).Distinct(function () { return this.PartB; }).items;
    }

    function getFileListPage(partA, partB) {
        var totalPageCount = localStorage.totalCount % localStorage.pageSize == 0 ? localStorage.totalCount / localStorage.pageSize : Math.ceil(localStorage.totalCount / localStorage.pageSize);

        if (localStorage.pageIndex == 1) {
            $("#previousPageLi").addClass("disabled");
        }
        else {
            $("#previousPageLi").removeClass("disabled");
        }
        if (localStorage.pageIndex == totalPageCount) {
            $("#nextPageLi").addClass("disabled");
        }
        else {
            $("#nextPageLi").removeClass("disabled");
        }

        $("#pageIndexSpan").text(localStorage.pageIndex);
        $("#pageSizeSpan").text(localStorage.pageSize);
        $("#totalCountSpan").text(localStorage.totalCount);

        if (partB == 'all') {
            return JSLINQ(fileList).Reverse().Where(function () { return this.PartA == partA; }).Skip(parseInt(localStorage.pageSize) * (parseInt(localStorage.pageIndex) - 1)).Take(parseInt(localStorage.pageSize)).Select("PartB,FileTime,FileSize,FileName").items;
        }
        else {
            return JSLINQ(fileList).Reverse().Where(function () { return this.PartA == partA && this.PartB == partB; }).Skip(parseInt(localStorage.pageSize) * (parseInt(localStorage.pageIndex) - 1)).Take(parseInt(localStorage.pageSize)).Select("PartB,FileTime,FileSize,FileName").items;
        }
    }

    function getFileListTotalCount(partA, partB) {
        if (partB == 'all') {
            return JSLINQ(fileList).Count(function () { return this.PartA == partA; });
        }
        else {
            return JSLINQ(fileList).Count(function () { return this.PartA == partA && this.PartB == partB; });
        }
    }

    function navBarLiClick(partA) {
        $("#navbar ul li[data-value=\"" + partA + "\"]").addClass("active").siblings().removeClass("active");

        $("#nav ul").empty();
        $("#nav ul").append("<li data-parta=\"" + partA + "\" data-partb=\"all\"><a href='javascript:;'>all</a></li>");

        var partB = '';
        var list = getDistinctPartB(partA);
        //list.sort();
        list.reverse();
        $.each(list, function (i, v) {
            if (localStorage.partB != undefined && localStorage.partA != undefined && localStorage.partA == partA && localStorage.partB == v) {
                partB = localStorage.partB;
                $("#nav ul").append("<li class='active' data-parta=\"" + partA + "\" data-partb=\"" + v + "\"><a href='javascript:;'>" + v + "</a></li>");
            }
            else {
                $("#nav ul").append("<li data-parta=\"" + partA + "\" data-partb=\"" + v + "\"><a href='javascript:;'>" + v + "</a></li>");
            }
        });
        if (partB == '') {
            partB = 'all';
            $("#nav ul li:first").addClass("active");
        }
        initFileList(partA, partB);
    }

    function navLiClick(partA, partB) {
        $("#nav ul li[data-partb=\"" + partB + "\"]").addClass("active").siblings().removeClass("active");
        initFileList(partA, partB);
    }

    function initFileList(partA, partB) {
        if (localStorage.partA != partA || localStorage.partB != partB) {
            localStorage.pageIndex = 1;
            localStorage.pageSize = 10;
        }

        if (localStorage.partA != partA) {
            localStorage.partA = partA;
        }
        if (localStorage.partB != partB) {
            localStorage.partB = partB;
        }

        var totalCount = getFileListTotalCount(partA, partB);
        if (localStorage.totalCount != totalCount) {
            localStorage.totalCount = totalCount;
        }

        var fileList = getFileListPage(partA, partB);

        $("#table").empty();
        // $("#table").append("<thead><tr><th>FileName</th><th>Time</th><th>FileSize</th><th>Operate</th></tr></thead><tbody>");
        if (fileList.length > 0) {
            $.each(fileList, function (i, v) {
                $("#table").append("<tr><td>" + v.FileName + "</td><td>" + v.FileTime + "</td><td>" + v.FileSize + "</td><td><a href='" + v.FileName + "' target='_blank'>Link</a></td></tr>");
            });
        }
        else {
            $("#table").append("<tr><td colspan='4'><center>no data</center></td></tr>");
        }
        $("#table").append("</tbody>");
    }
});