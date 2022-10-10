module.exports = {
  base: "/", //目标地址是：https://openhacking.github.io/vuepress-template/，所以需要配置base地址后缀
  locales: {
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    "/": {
      lang: "zh-CN", // 将会被设置为 <html> 的 lang 属性
      title: "笔记本",
      // description:
      //   "VuePress template, theme, and plugin Demo. The purpose is that users can directly clone this repository as a startup project for initializing a VuePress website, and then add custom configurations and functions based on this project.",
    },
  },
  plugins: ["@vuepress/back-to-top", "@vuepress/last-updated"],
  configureWebpack: {
    resolve: {
      alias: {
        "@assets": "../../assets",
      },
    },
  },
  themeConfig: {
    sidebarDepth: 1, //默认情况下，侧边栏会自动地显示由当前页面的标题（headers）组成的链接，
    lastUpdated: "Last Updated", // string | boolean
    smoothScroll: true,
    locales: {
      "/": {
        selectText: "Languages",
        label: "English",
        ariaLabel: "Languages",
        editLinkText: "Edit this page on GitHub",
        serviceWorker: {
          updatePopup: {
            message: "New content is available.",
            buttonText: "Refresh",
          },
        },
        algolia: {},
        nav: [
          {
            text: "面试题",
            items: [
              {
                link: "/interview/web",
                text: "Web",
              },
              {
                link: "/interview/code",
                text: "code",
              },
              {
                link: "/interview/vue",
                text: "Vue",
              },
            ],
          },
        ],
        sidebar: "auto",
        // sidebar: {
        //   // "/guide/": ["", "theme", "plugin"],
        //   "/JavaScript/": ["", "prototype", "init"],
        //   "/interview/": ["web", "code", "vue"],
        //   "/React/": ["", "method"],
        //   // "/resource/": [],
        // },
      },
    },
  },
};
