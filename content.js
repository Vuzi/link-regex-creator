
var links = []
var template = (tpl, args) => tpl.replace(/\${(\w+)}/g, (_, v) => args[v]);

document.addEventListener("mousedown", function(event){
    if(event.button == 2) {
      const nodeTarget = event.target
      
      chrome.storage.sync.get({
        conf: []
      }, function(res) {
        const matchers = res.conf

        links = [... nodeTarget.childNodes].reduce((links, node) => {
          if(node.nodeName.toLowerCase() === '#text') {
            const newLinks = matchers.reduce((links, matcher) => {
              const res = new RegExp(matcher.regex).exec(node.data)
              if(res)
                return links.concat({
                  message : template(matcher.message, res),
                  value : res[0],
                  url : template(matcher.link, res)
                })
              else
                return links
            }, [])
            return links.concat(newLinks)
          } else
            return links
        }, [])

        chrome.extension.sendMessage({
          'message': 'updateContextMenu', 
          'value': links
        })
      })
    }
}, true)

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request == "getClickedEl") {
      sendResponse({value: links})
    }
})
