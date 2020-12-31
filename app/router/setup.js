export function PersonalDescriptions(location, cb) {
	require.ensure([], require => {
		cb(null, require('@/pages/Setup/PersonalDescriptions/index').default)
	}, 'PersonalDescriptions')
}
