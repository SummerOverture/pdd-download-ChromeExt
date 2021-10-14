(function () {
	let realXhr = '__rxhr';

	function configEvent(event, xhrProxy) {
		let e = {};
		for (let attr in event) e[attr] = event[attr];
		// xhrProxy instead
		e.target = e.currentTarget = xhrProxy;
		return e;
	}

	function hook(proxy) {
		// Avoid double hookAjax
		window[realXhr] = window[realXhr] || XMLHttpRequest;

		XMLHttpRequest = function () {
			var xhr = new window[realXhr]();
			// We shouldn't hookAjax XMLHttpRequest.prototype because we can't
			// guarantee that all attributes are on the prototype。
			// Instead, hooking XMLHttpRequest instance can avoid this problem.
			for (var attr in xhr) {
				var type = '';
				try {
					type = typeof xhr[attr]; // May cause exception on some browser
				} catch (e) {}
				if (type === 'function') {
					// hookAjax methods of xhr, such as `open`、`send` ...
					this[attr] = hookFunction(attr);
				} else {
					Object.defineProperty(this, attr, {
						get: getterFactory(attr),
						set: setterFactory(attr),
						enumerable: true,
					});
				}
			}
			var that = this;
			xhr.getProxy = function () {
				return that;
			};
			this.xhr = xhr;
		};

		// Generate getter for attributes of xhr
		function getterFactory(attr) {
			return function () {
				var v = this.hasOwnProperty(attr + '_') ? this[attr + '_'] : this.xhr[attr];
				var attrGetterHook = (proxy[attr] || {})['getter'];
				return (attrGetterHook && attrGetterHook(v, this)) || v;
			};
		}

		// Generate setter for attributes of xhr; by this we have an opportunity
		// to hookAjax event callbacks （eg: `onload`） of xhr;
		function setterFactory(attr) {
			return function (v) {
				var xhr = this.xhr;
				var that = this;
				var hook = proxy[attr];
				// hookAjax  event callbacks such as `onload`、`onreadystatechange`...
				if (attr.substring(0, 2) === 'on') {
					that[attr + '_'] = v;
					xhr[attr] = function (e) {
						e = configEvent(e, that);
						var ret = proxy[attr] && proxy[attr].call(that, xhr, e);
						ret || v.call(that, e);
					};
				} else {
					//If the attribute isn't writable, generate proxy attribute
					var attrSetterHook = (hook || {})['setter'];
					v = (attrSetterHook && attrSetterHook(v, that)) || v;
					this[attr + '_'] = v;
					try {
						// Not all attributes of xhr are writable(setter may undefined).
						xhr[attr] = v;
					} catch (e) {}
				}
			};
		}

		// Hook methods of xhr.
		function hookFunction(fun) {
			return function () {
				var args = [].slice.call(arguments);
				if (proxy[fun]) {
					var ret = proxy[fun].call(this, args, this.xhr);
					// If the proxy return value exists, return it directly,
					// otherwise call the function of xhr.
					if (ret) return ret;
				}
				return this.xhr[fun].apply(this.xhr, args);
			};
		}

		// Return the real XMLHttpRequest
		return window[realXhr];
	}

	const handleChange = function (c) {
		const cPageType = getPageType();
		const readText = () =>
			new Promise((resolve) => {
				if (typeof c.response === 'object') {
					var fr = new FileReader();
					fr.readAsText(c.response);
					fr.onload = function (e) {
						resolve(fr.result);
					};
				} else if (typeof c.response === 'string') {
					resolve(c.responseText);
				}
			});
		// return;
		if (c.readyState === 4 && c.responseURL) {
			const { responseURL } = c;
			readText().then((responseText) => {
				if (cPageType === 'promotion') {
					listType = 'promotion';

					if (responseURL.endsWith('queryDailyReport')) {
						const resData = JSON.parse(responseText);
						overviewData = [
							{
								...resData.result.sumReport,
								date: '总数',
							},
						];
						listData = resData.result.dailyReportList.sort((a, b) => (a.date > b.date ? -1 : 1));

						setButtonDownloadData();
					}
				}

				if (cPageType === 'goods') {
					listType = 'goods';
					allGoodsData = [];

					if (responseURL.endsWith('queryGoodsPageOverView')) {
						const resData = JSON.parse(responseText);
						overviewData = [
							{
								...resData.result,
								statDate: '总计',
							},
						];

						setButtonDownloadData();
					}

					if (responseURL.endsWith('queryGoodsPagePlnOstList')) {
						const resData = JSON.parse(responseText);
						listData = resData.result.sort((a, b) => (a.statDate > b.statDate ? -1 : 1));

						setButtonDownloadData();
					}
				}

				if (cPageType === 'order') {
					listType = 'order';

					allGoodsData = [];

					if (responseURL.endsWith('queryMallDataPageOverView')) {
						const resData = JSON.parse(responseText);
						overviewData = [
							{
								...resData.result,
								statDate: '总计',
							},
						];

						setButtonDownloadData();
					}

					if (responseURL.endsWith('queryMallDataPageOverViewList')) {
						const resData = JSON.parse(responseText);
						listData = resData.result.sort((a, b) => (a.statDate > b.statDate ? -1 : 1));

						setButtonDownloadData();
					}
				}
			});
			return;
		}
	};

	hook({
		onload: handleChange,
		onreadystatechange: handleChange,
	});

	let button = document.createElement('button');
	button.innerText = '下载';
	button.className = 'xlsx_download_btns';

	let listType = '';

	let overviewData = [];
	let listData = [];

	function setButtonDownloadData() {
		console.log(overviewData, listData);
		button.setAttribute('data-downloaddata', JSON.stringify(overviewData.concat(listData)));
		button.setAttribute('data-listtype', listType);
	}

	const getPageType = () => {
		const path = window.location.href;
		console.log('hi');
		if (path.includes('yingxiao.pinduoduo.com/marketing/main/report')) {
			return 'promotion';
		}
		if (path.includes('mms.pinduoduo.com/sycm/goods_effect')) {
			return 'goods';
		}
		if (path.includes('mms.pinduoduo.com/sycm/stores_data/operation')) {
			return 'order';
		}
	};

	pageType = getPageType();

	let currentHref = '';

	const listenUrlChange = () => {
		const exsistButton = document.querySelector('button[class=xlsx_download_btns]');
		if (currentHref !== window.location.href || !exsistButton) {
			currentHref = window.location.href;
			pageType = getPageType();
      document.body.appendChild(button);

			// if (pageType === 'goods') {
			// 	document.body.appendChild(button);
			// }

			// if (pageType === 'order') {
			// 	document.body.appendChild(button);
			// }

			// if (pageType === 'promotion') {
			// 	document.body.appendChild(button);
			// }
		}
	};

	// listenUrlChange();

	setInterval(() => {
		listenUrlChange();
	}, 2000);
})();
