chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    //console.log(changeInfo);
    if (changeInfo.status == "complete"/*"loading"*//*"complete"*/) {
        //console.log(tab);

        var url = tab.url;
        console.log(url);

        chrome.tabs.executeScript(tabId, {
            file: 'js/filelist.js'
        }, _ => {
            let e = chrome.runtime.lastError;
            if (e !== undefined) {
                console.log(tabId, _, e);
            }
        });


    }
}); 