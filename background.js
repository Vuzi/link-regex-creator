
const openLink = (url) => (info, tab) => {
  chrome.tabs.create({ url: url})
}
  

let contextMenuId

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message == 'updateContextMenu') {
    const link = request.value[0]

    if(!link) {
      if(contextMenuId) {
        chrome.contextMenus.remove(contextMenuId)
        contextMenuId = undefined
      }
    } else {
      const conf = {
        'title': link.message, 
        'enabled': true, 
        "contexts": ["all"],
        'onclick': openLink(link.url)
      }

      if(contextMenuId)
        chrome.contextMenus.update(contextMenuId, conf)
      else
        contextMenuId = chrome.contextMenus.create(conf)
    }
  } else {
      sendResponse({})
  }
})
