const filterNodes = (tag) => (node) => node.nodeName.toLowerCase() == tag

// Saves options to chrome.storage.sync.
function save_options() {
	const a = document.getElementById('table')
	const conf = [... table.childNodes]
	.filter(filterNodes('tr'))
	.reduce((conf, tr) => {
		const tds = [...tr.childNodes].filter(filterNodes('td'))

        const message = [...tds[0].childNodes].filter(filterNodes('textarea'))[0].value
		const regex = [...tds[1].childNodes].filter(filterNodes('textarea'))[0].value
		const url = [...tds[2].childNodes].filter(filterNodes('textarea'))[0].value

		return conf.concat({
			message: message,
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

function restore_options() {
  chrome.storage.sync.get({
    conf: []
  }, function(res) {
	res.conf.forEach((conf) => {
		add_line(conf.message, conf.regex, conf.link)
	})
  })
}

function add_line(message, regex, link) {
	const tr = document.createElement('tr')
	const td1 = document.createElement('td')
	const ta1 = document.createElement('textarea')
	const td2 = document.createElement('td')
	const ta2 = document.createElement('textarea')
	const td3 = document.createElement('td')
	const ta3 = document.createElement('textarea')

	ta1.value = message
	ta2.value = regex
	ta3.value = link

	td1.appendChild(ta1)
	td2.appendChild(ta2)
	td3.appendChild(ta3)
	tr.appendChild(td1)
	tr.appendChild(td2)
	tr.appendChild(td3)

	document.getElementById('table').appendChild(tr)
}

function remove_line() {
	const table = document.getElementById('table')
	if(table.childNodes.length > 0)
		table.removeChild(table.lastChild)
}

function remove_all_line() {
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
				remove_all_line()
				conf.forEach((matcher) => {
					add_line(matcher.message, matcher.regex, matcher.link)
				})
			}
		}
	})(f)

	reader.readAsText(f)
}

document.addEventListener('DOMContentLoaded', restore_options)
document.getElementById('add').addEventListener('click', () => add_line('Default message', '', ''))
document.getElementById('remove').addEventListener('click', remove_line)
document.getElementById('save').addEventListener('click', save_options)
document.getElementById('fileinput').addEventListener('change', handleFileSelect, false)
