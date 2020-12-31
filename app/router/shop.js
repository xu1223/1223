export function Commoditymanage(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Commoditymanage/list').default)
	}, 'Commoditymanage')
}

export function ShopInsert(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Commoditymanage/list/ShopInsert').default)
	}, 'ShopInsert')
}
export function Allorder(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Ordermanage/Allorder').default)
	}, 'Allorder')
}
export function Allorderpor(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Ordermanage/Allorder/SubPage/edit').default)
	}, 'Allorderpor')
}

export function Memberinfo(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Membermanage/Memberinfo').default)
	}, 'Memberinfo')
}

export function Memberinfopro(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Membermanage/Memberinfo/SubPage/edit').default)
	}, 'Memberinfopro')
}


export function Subscription(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Membermanage/Subscription').default)
	}, 'Subscription')
}
export function Cartmem(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Membermanage/Cartmem').default)
	}, 'Cartmem')
}

export function Cartmempro(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Membermanage/Cartmem/SubPage/edit').default)
	}, 'Cartmempro')
}
export function Wishlist(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Membermanage/Wishlist').default)
	}, 'Wishlist')
}
export function Wishlistpro(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Membermanage/Wishlist/SubPage/edit').default)
	}, 'Wishlistpro')
}
export function Membercomments(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Membermanage/Membercomments').default)
	}, 'Membercomments')
}
export function Classify(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Commoditymanage/classify').default)
	}, 'Classify')
}
export function Sizer(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Commoditymanage/sizer').default)
	}, 'Sizer')
}
export function Sizerpor(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Commoditymanage/sizer/SubPage').default)
	}, 'Sizer')
}
export function Commodityproperty(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Commoditymanage/commodityproperty').default)
	}, 'Commodityproperty')
}
export function Brandlabel(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Commoditymanage/brandlabel').default)
	}, 'Brandlabel')
}

export function Message(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Membermanage/Message').default)
	}, 'Message')
}
export function Messagepro(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Membermanage/Message/SubPage').default)
	}, 'Messagepro')
}


export function PrivilegeMenu(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/User/PrivilegeMenu').default)
	}, 'PrivilegeMenu')
}

export function UserManagement(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/User/UserManagement').default)
	}, 'UserManagement')
}


export function Service(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/User/Service').default)
	}, 'Service')
}


export function Logistics(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/User/Logistics').default)
	}, 'Logistics')
}
export function Decorateedit(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Decorate/Decorateedit').default)
	}, 'Decorateedit')
}
export function Posts(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Decorate/Posts').default)
	}, 'Posts')
}
export function Themetemplate(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Decorate/Themetemplate').default)
	}, 'Themetemplate')
}
export function Commodityproject(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Decorate/Commodityproject').default)
	}, 'Commodityproject')
}
export function Basic(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Sitesettings/Basic').default)
	}, 'Basic')
}
export function Parameter(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Sitesettings/Parameter').default)
	}, 'Parameter')
}


export function Domain(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Sitesettings/Domain').default)
	}, 'Domain')
}

export function Languageset(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Sitesettings/Languageset').default)
	}, 'Languageset')
}

export function Currencyset(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Sitesettings/Currencyset').default)
	}, 'Currencyset')
}

export function Emailset(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Sitesettings/Emailset').default)
	}, 'Emailset')
}

export function Trace(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Sitesettings/Trace').default)
	}, 'Trace')
}

export function Navmenu(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Decorate/Navmenu').default)
	}, 'Navmenu')
}
export function Special(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Commoditymanage/special').default)
	}, 'Special')
}

export function Associated(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Commoditymanage/special/Associated').default)
	}, 'Associated')
}


export function EDM(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Plug/EDM').default)
	}, 'EDM')
}


export function Payment(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Plug/Payment').default)
	}, 'Payment')
}

export function Jointlanding(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Plug/Jointlanding').default)
	}, 'Jointlanding')
}




export function Marketing(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Plug/Marketing').default)
	}, 'Marketing')
}




export function Coupons(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Plug/Coupons').default)
	}, 'Coupons')
}

export function Activity(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Plug/Activity').default)
	}, 'Activity')
}



export function Scrollorder(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Plug/Scrollorder').default)
	}, 'Scrollorder')
}

export function Lottery(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Plug/Lottery').default)
	}, 'Lottery')
}

export function INS(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Plug/INS').default)
	}, 'INS')
}

export function echarts(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/echarts').default)
	}, 'echarts')
}

export function Hrinfo(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/User/Hrinfo').default)
	}, 'Hrinfo')
}

export function Productpermissions(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/User/Productpermissions').default)
	}, 'Productpermissions')
}

export function IBM(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Report/IBM').default)
	}, 'IBM')
}

export function Operation(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Report/Operation').default)
	}, 'Operation')
}

export function UserAnalysis(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Report/UserAnalysis').default)
	}, 'UserAnalysis')
}

export function Googleapis(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Shop/Report/Googleapis').default)
	}, 'UserAnalysis')
}


