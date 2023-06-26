export default [
    {
        name: 'Home',
        path: '/',
        component: require('@/views/HomePage').default,
    },
    {
        name: 'Basic',
        path: '/basic',
        component: require('@/views/BasicPage').default,
    },
    {
        name: 'Profile',
        path: '/profile',
        component: require('@/views/MyNfts').default,
    }
]