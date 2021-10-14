if (window.location.host === 'mms.pinduoduo.com') {
	if (!window.location.pathname.startsWith('/login')) {
		window.fetch = null;
	}
}
