
var url

const openLink = (info, tab) => {
  if(url)
    chrome.tabs.create({ url: url})
}

chrome.contextMenus.create({
  'title': 'Open matching pattern...', 
  'enabled': true, 
  "contexts": ["all"],
  'onclick': openLink
})

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message == 'updateContextMenu') {
    const link = request.value[0]

    if(!link)
      url = false
    else
      url = link.url
  } else
    sendResponse({})
})
