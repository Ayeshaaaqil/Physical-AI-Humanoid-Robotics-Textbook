/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Physical AI & Humanoid Robotics Curriculum and Capstone Program',
  tagline: 'A comprehensive curriculum for building intelligent humanoid robots.',
  url: 'https://ayeshaaaqil.github.io',                                    // Your GitHub Pages URL
  baseUrl: '/Physical-AI-Humanoid-Robotics-Textbook/',                      // Repo name + trailing slash
  trailingSlash: true,                                                     // Must for GitHub Pages
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub deployment config (yeh dono bilkul exact hone chahiye)
  organizationName: 'ayeshaaaqil',                 // lowercase username
  projectName: 'Physical-AI-Humanoid-Robotics-Textbook', // exact repo name

  themes: [require.resolve('./src/theme/Root.js')],

  scripts: [
    'https://cdn.jsdelivr.net/npm/@anthropic-ai/chatkit@latest/dist/chatkit.js',
  ],

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/Ayeshaaaqil/Physical-AI-Humanoid-Robotics-Textbook/edit/main/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/Ayeshaaaqil/Physical-AI-Humanoid-Robotics-Textbook/edit/main/blog/',
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
          { to: '/blog', label: 'Blog', position: 'left' },
          { to: '/chatbot', label: 'Chatbot', position: 'left' },
          { to: '/login', label: 'Login', position: 'left' },
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
              { label: 'Blog', to: '/blog' },
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
