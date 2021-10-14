let tjsurl = chrome.runtime.getURL('inject/hooks.js');
let tscript = document.createElement('script');
tscript.src = tjsurl;
tscript.setAttribute('crossorigin', 'anonymous');
document.querySelector('*').appendChild(tscript);

const cssUrl = chrome.runtime.getURL('inject/main.css');

document.addEventListener('click', (e) => {
	const target = e.target;

	if (target.className === 'xlsx_download_btns') {
		// console.log(target.dataset.downloaddata);
		const { downloaddata, listtype } = target.dataset;
		doDonload(downloaddata, listtype);
	}
});

function doDonload(json, listType) {
	let jsonData, nameKeys;

	loadData();

	function loadData() {
		try {
			parseType(JSON.parse(json));
		} catch (e) {
			console.log(e);
			alert('出错了, 可以找程序员看看是什么问题');
		}
	}

	function parseType(json) {
		jsonData = json;
		if (['promotion', 'goods', 'order'].includes(listType)) {
			json2List();
		} else {
			alert('下载数据类型不正确');
		}
	}

	function json2List() {
		let types = listTypeRender[listType];
		let keys = Object.keys(types);

		nameKeys = keys.map((key) => (typeof types[key] === 'string' ? types[key] : types[key].name));

		// 循环json
		jsonData = jsonData.map((item) => {
			// 循环数据 产出中文key以及对应格式化数据
			let result = {};
			keys.forEach((key) => {
				let type = types[key];
				let name = type;
				let render = (val) => val;
				if (typeof type === 'object') {
					name = type.name;
					render = type.formatter;
				}

				result[name] = render(item[key]);
			});
			return result;
		});

		exportXlsx();
	}

	function exportXlsx() {
		console.log(jsonData);
		let ws = XLSX.utils.json_to_sheet(jsonData, {
			header: nameKeys,
		});
		let wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'sheet');

		const dateNow = new Date();
		// const colon = encodeURIComponent(':')
		const formatedDate = `${dateNow.getFullYear()}-${
			dateNow.getMonth() + 1
		}-${dateNow.getDate()} ${dateNow.getHours()}点${dateNow.getMinutes()}分${dateNow.getSeconds()}秒`;
		return XLSX.writeFile(wb, `${formatedDate}_${typeName[listType]}.xlsx`);
	}
}
