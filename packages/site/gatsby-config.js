module.exports = {
  siteMetadata: {
    title: 'My Book Club',
    navItems: [
      {
        label: 'Books',
        path: '/books',
      },
      {
        label: 'Authors',
        path: '/authors',
      },
      {
        label: 'Account',
        path: '/account',
      },
    ],
  },
  plugins: [
    `gatsby-plugin-pnpm`,
    // `gatsby-source-filesystem`
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    `gatsby-plugin-emotion`,
    `gatsby-theme-shared-nav`
  ]
};
