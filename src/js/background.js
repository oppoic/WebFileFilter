chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({ url: 'settings.html' })
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    //console.log(changeInfo.status);

    if (changeInfo.status == "loading") {
        var url = tab.url;
        //console.log("loading:" + url);

        if (localStorage.url != undefined && localStorage.url != '') {
            var urlList = localStorage.url.split("\n");

            if (urlList.indexOf(url) != -1) {
                console.log("url matched");

                chrome.tabs.executeScript(tabId, {
                    code: 'document.body.childNodes.forEach(function(el){if(el.tagName!=undefined){el.setAttribute("style","display:none");}});var div = document.createElement("div");div.className = "loader";div.innerHTML = "<span></span><span></span><span></span>";document.body.insertBefore(div, document.body.firstElementChild);', runAt: 'document_start'
                }, _ => {
                    let e = chrome.runtime.lastError;
                    if (e !== undefined) {
                        console.log(tabId, _, e);
                    }
                    else {
                        chrome.tabs.insertCSS(tabId, { file: "css/loading.css", runAt: 'document_start' });
                    }
                });
            }
        }
    };

    if (changeInfo.status == "complete") {
        var url = tab.url;
        //console.log("complete:" + url);

        if (localStorage.url != undefined && localStorage.url != '') {
            var urlList = localStorage.url.split("\n");

            if (urlList.indexOf(url) != -1) {
                //console.log("url matched");

                chrome.tabs.executeScript(tabId, {
                    file: 'js/jquery.min.js'
                }, _ => {
                    let e = chrome.runtime.lastError;
                    if (e !== undefined) {
                        //console.log(tabId, _, e);
                    }
                    else {
                        chrome.tabs.insertCSS(tabId, { file: "css/bootstrap.min.css" });
                        chrome.tabs.insertCSS(tabId, { file: "css/mycss.css" });

                        chrome.tabs.executeScript(tabId, { file: "js/jslinq.js" });
                        chrome.tabs.executeScript(tabId, { file: "js/bootstrap.min.js" });
                        chrome.tabs.executeScript(tabId, { file: "js/filelist.js" });
                    }
                });
            }
        }
    };
}); 