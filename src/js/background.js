chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({ url: 'settings.html' })
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    //console.log(changeInfo);
    if (changeInfo.status == "loading"/*"loading"*//*"complete"*/) {
        //console.log(tab);

        var url = tab.url;
        //console.log(url);

        if (localStorage.url != undefined && localStorage.url != '') {
            var urlList = localStorage.url.split("\n");
            //console.log(urlList);

            if (urlList.indexOf(url) != -1) {
                console.log("url matched");

                chrome.tabs.executeScript(tabId, {
                    file: 'js/filelist.js'
                }, _ => {
                    let e = chrome.runtime.lastError;
                    if (e !== undefined) {
                        console.log(tabId, _, e);
                    }
                });
            }
        }
        else {
            console.log("url not found");
        }
    }
}); 