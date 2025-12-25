/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Physical AI & Humanoid Robotics Curriculum and Capstone Program',
  tagline: 'A comprehensive curriculum for building intelligent humanoid robots.',
  url: 'https://my-website-two-weld-92.vercel.app/',
  baseUrl: '/',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  markdown: {
    format: 'mdx',
    mermaid: true,
  },
  favicon: 'img/favicon.ico',

  // GitHub deployment config (yeh dono bilkul exact hone chahiye)
  organizationName: 'ayeshaaaqil',                 // lowercase username
  projectName: 'Physical-AI-Humanoid-Robotics-Textbook', // exact repo name



  scripts: [],

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/Ayeshaaaqil/Physical-AI-Humanoid-Robotics-Textbook/edit/main/',
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
          alt: 'Physical AI Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'chapter-1-introduction-to-physical-ai',
            position: 'left',
            label: 'Curriculum',
          },
          { to: '/chatbot', label: 'Chatbot', position: 'left' },
          {
            href: 'https://github.com/Ayeshaaaqil/Physical-AI-Humanoid-Robotics-Textbook',
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
                label: 'Curriculum',
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
                href: 'https://discord.gg/your-discord-invite',
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
                label: 'GitHub',
                href: 'https://github.com/Ayeshaaaqil/Physical-AI-Humanoid-Robotics-Textbook',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Physical AI & Agentic World • Created by Ayesha Aaqil`,
      },
    }),
};
