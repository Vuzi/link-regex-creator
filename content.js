
let links = []
let template = (tpl, args) => tpl.replace(/\${(\w+)}/g, (_, v) => args[v]);

chrome.storage.sync.get({
  conf: []
}, function(res) {
  const matchers = res.conf

  window.addEventListener('contextmenu', (event) => {
    const nodeTarget = event.target

    links = [... nodeTarget.childNodes].reduce((links, node) => {
      if(node.nodeName.toLowerCase() === '#text') {
        const newLinks = matchers.reduce((links, matcher) => {
          const res = new RegExp(matcher.regex).exec(node.data)
          if(res)
            return links.concat({
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
})
