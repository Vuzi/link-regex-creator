const filterNodes = (tag) => (node) => node.nodeName.toLowerCase() == tag

function saveConf() {
	const a = document.getElementById('table')
	const conf = [... table.childNodes]
	.filter(filterNodes('tr'))
	.reduce((conf, tr) => {
		const tds = [...tr.childNodes].filter(filterNodes('td'))

		const regex = [...tds[0].childNodes].filter(filterNodes('textarea'))[0].value
		const url = [...tds[1].childNodes].filter(filterNodes('textarea'))[0].value

		return conf.concat({
			regex: regex,
			link: url
		})
	}, [])

  	chrome.storage.sync.set({ 'conf' : conf }, function() {
		const status = document.getElementById('status')
		status.textContent = 'Configuration saved'
		setTimeout(function() {
			status.textContent = ''
		}, 1500);
	})
}

function restoreConf() {
  chrome.storage.sync.get({
    conf: []
  }, function(res) {
		res.conf.forEach((conf) => {
			addLine(conf.regex, conf.link)
		})
  })
}

function addLine(regex, link) {
	const tr = document.createElement('tr')
	const td1 = document.createElement('td')
	const ta1 = document.createElement('textarea')
	const td2 = document.createElement('td')
	const ta2 = document.createElement('textarea')

	ta1.value = regex
	ta2.value = link

	td1.appendChild(ta1)
	td2.appendChild(ta2)
	tr.appendChild(td1)
	tr.appendChild(td2)

	document.getElementById('table').appendChild(tr)
}

function removeLine() {
	const table = document.getElementById('table')
	if(table.childNodes.length > 0)
		table.removeChild(table.lastChild)
}

function removeAllLine() {
	const table = document.getElementById('table')
	while(table.childNodes.length > 0)
		table.removeChild(table.lastChild)
}

function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object
	f = files[0];
	var reader = new FileReader();

	// Closure to capture the file information.
	reader.onload = (function(theFile) {
		return function(e) {
			// Render thumbnail.
			const conf = JSON.parse(e.target.result)

			if(conf.forEach) {
				removeAllLine()
				conf.forEach((matcher) => {
					addLine(matcher.regex, matcher.link)
				})
			}
		}
	})(f)

	reader.readAsText(f)
}

document.addEventListener('DOMContentLoaded', restoreConf)
document.getElementById('add').addEventListener('click', () => addLine('', ''))
document.getElementById('remove').addEventListener('click', removeLine)
document.getElementById('save').addEventListener('click', saveConf)
document.getElementById('fileinput').addEventListener('change', handleFileSelect, false)
