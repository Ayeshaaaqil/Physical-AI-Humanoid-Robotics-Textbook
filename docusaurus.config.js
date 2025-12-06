
// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: 'Physical AI & Humanoid Robotics Curriculum and Capstone Program',
  tagline: 'A comprehensive curriculum for building intelligent humanoid robots.',
  url: 'https://your-robotics-curriculum.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  markdown: { hooks: { onBrokenMarkdownLinks: 'warn' } },
  headTags: [
    // You can install @chatkit/react via npm and import it directly
    // or use a CDN as an alternative for quick setup
    // If using npm, remove this headTag and ensure @chatkit/react is in package.json
    // The Docusaurus build process will handle bundling.
    // We are not adding the CDN here directly, instead relying on npm install and import in ChatKitWidget.
  ],
  favicon: 'img/favicon.ico',
  clientModules: [require.resolve('./src/theme/Root.js')],
  scripts: [
    'https://cdn.jsdelivr.net/npm/@anthropic-ai/chatkit@latest/dist/chatkit.js',
  ],
  organizationName: 'Anthropic', // Usually your GitHub org/user name.
  projectName: 'humanoid-robotics', // Usually your repo name.

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/Anthropic/humanoid-robotics/edit/main/my-website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/Anthropic/humanoid-robotics/edit/main/my-website/blog/',
          onInlineAuthors: 'ignore', // You can also define authors directly in docusaurus.config.js
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Physical AI Robotics',

        logo: {
          alt: 'Physical AI',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'chapter-1-introduction-to-physical-ai',
            position: 'left',
            label: 'Curriculum',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            to: '/chatbot',
            label: 'Chatbot',
            position: 'left',
          },
          {
            to: '/login',
            label: 'Login',
            position: 'left',
          },
          {
            href: 'https://github.com/Anthropic/humanoid-robotics',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Read-Books',
                to: '/docs/chapter-1-introduction-to-physical-ai',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/robotics-ai',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/your-discord-invite', // Placeholder for Discord
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/AnthropicAI',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/Anthropic/humanoid-robotics',
              },
            ],
          },
        ],
        copyright: '© Physical AI & Agentic World /n created by AYESHA AAQIL'
        ,
      },
    }),
});
