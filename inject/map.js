window.typeName = {
	promotion: '经营总览',
	goods: '商品数据',
	order: '交易数据',
};

window.listTypeRender = {
	promotion: {
		date: '日期',
		impression: '曝光量',
		click: '点击量',
		ctr: {
			name: '点击率',
			formatter(val) {
				return (val * 100).toFixed(2) + '%';
			},
		},
		spend: {
			name: '花费',
			formatter(val) {
				return (val / 1000).toFixed(2);
			},
		},
		roi: {
			name: '投入产出比',
			formatter(val) {
				return val.toFixed(2);
			},
		},
		costPerOrder: {
			name: '每笔成交花费',
			formatter(val) {
				return (val / 1000).toFixed(2);
			},
		},
		avgPayAmount: {
			name: '每笔成交金额',
			formatter(val) {
				return (val / 1000).toFixed(2);
			},
		},
		orderNum: '成交笔数',
		cpc: {
			name: '平均点击花费',
			formatter(val) {
				return (val / 1000).toFixed(2);
			},
		},
		cvr: {
			name: '点击转化率',
			formatter(val) {
				return (val * 100).toFixed(2) + '%';
			},
		},
		gmv: {
			name: '交易额',
			formatter(val) {
				return (val / 1000).toFixed(2);
			},
		},
		cpm: {
			name: '千次曝光花费',
			formatter(val) {
				return (val / 1000).toFixed(2);
			},
		},
		mallFavNum: '店铺关注量',
		goodsFavNum: '商品收藏量',
		inquiryNum: '询单量',
	},
	goods: {
		statDate: '日期',
		guv: '商品访客数',
		gpv: '商品浏览量',
		goodsFavCnt: '商品收藏用户数',
		vstGoodsCnt: '被访问商品数',
	},
	order: {
		statDate: '日期',
		payOrdrAmt: '支付金额',
		payOrdrUsrCnt: '支付买家数',
		payOrdrAup: {
			name: '支付客单价',
			formatter(val) {
				return val.toFixed(2);
			},
		},
		payUvRto: {
			name: '支付转化率',
			formatter(val) {
				return (val * 100).toFixed(2) + '%';
			},
		},
		mallFavCnt: '店铺关注用户数',
		payOrdrCnt: '支付订单数',
		rpayOrdrUsrRto: {
			name: '老买家占比',
			formatter(val) {
				return (val * 100).toFixed(2) + '%';
			},
		},
	},
};
