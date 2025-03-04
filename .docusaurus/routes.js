import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/blog',
    component: ComponentCreator('/blog', '769'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '182'),
    exact: true
  },
  {
    path: '/blog/authors',
    component: ComponentCreator('/blog/authors', '0b7'),
    exact: true
  },
  {
    path: '/blog/authors/haeyoung',
    component: ComponentCreator('/blog/authors/haeyoung', 'ff9'),
    exact: true
  },
  {
    path: '/blog/authors/haeyoung/authors/2',
    component: ComponentCreator('/blog/authors/haeyoung/authors/2', '29a'),
    exact: true
  },
  {
    path: '/blog/benchmark',
    component: ComponentCreator('/blog/benchmark', '9b0'),
    exact: true
  },
  {
    path: '/blog/blog3',
    component: ComponentCreator('/blog/blog3', 'b9a'),
    exact: true
  },
  {
    path: '/blog/book1',
    component: ComponentCreator('/blog/book1', '6d0'),
    exact: true
  },
  {
    path: '/blog/database1',
    component: ComponentCreator('/blog/database1', '4f4'),
    exact: true
  },
  {
    path: '/blog/designproject',
    component: ComponentCreator('/blog/designproject', '82c'),
    exact: true
  },
  {
    path: '/blog/infra',
    component: ComponentCreator('/blog/infra', 'fc9'),
    exact: true
  },
  {
    path: '/blog/iocdi',
    component: ComponentCreator('/blog/iocdi', 'cb5'),
    exact: true
  },
  {
    path: '/blog/makeblog',
    component: ComponentCreator('/blog/makeblog', 'b76'),
    exact: true
  },
  {
    path: '/blog/makeblogdff',
    component: ComponentCreator('/blog/makeblogdff', 'b3e'),
    exact: true
  },
  {
    path: '/blog/mybatis',
    component: ComponentCreator('/blog/mybatis', '383'),
    exact: true
  },
  {
    path: '/blog/mybatis-2',
    component: ComponentCreator('/blog/mybatis-2', 'ded'),
    exact: true
  },
  {
    path: '/blog/page/2',
    component: ComponentCreator('/blog/page/2', '122'),
    exact: true
  },
  {
    path: '/blog/slog22',
    component: ComponentCreator('/blog/slog22', 'd45'),
    exact: true
  },
  {
    path: '/blog/stack',
    component: ComponentCreator('/blog/stack', '03f'),
    exact: true
  },
  {
    path: '/blog/study',
    component: ComponentCreator('/blog/study', '600'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '287'),
    exact: true
  },
  {
    path: '/blog/tags/blog',
    component: ComponentCreator('/blog/tags/blog', 'be8'),
    exact: true
  },
  {
    path: '/blog/tags/book',
    component: ComponentCreator('/blog/tags/book', '729'),
    exact: true
  },
  {
    path: '/blog/tags/cloud',
    component: ComponentCreator('/blog/tags/cloud', 'ce6'),
    exact: true
  },
  {
    path: '/blog/tags/database',
    component: ComponentCreator('/blog/tags/database', '6de'),
    exact: true
  },
  {
    path: '/blog/tags/db',
    component: ComponentCreator('/blog/tags/db', '44f'),
    exact: true
  },
  {
    path: '/blog/tags/design',
    component: ComponentCreator('/blog/tags/design', '25d'),
    exact: true
  },
  {
    path: '/blog/tags/docker',
    component: ComponentCreator('/blog/tags/docker', 'e22'),
    exact: true
  },
  {
    path: '/blog/tags/infra',
    component: ComponentCreator('/blog/tags/infra', '5b3'),
    exact: true
  },
  {
    path: '/blog/tags/ncp',
    component: ComponentCreator('/blog/tags/ncp', 'a9b'),
    exact: true
  },
  {
    path: '/blog/tags/new',
    component: ComponentCreator('/blog/tags/new', 'a48'),
    exact: true
  },
  {
    path: '/blog/tags/portfolio',
    component: ComponentCreator('/blog/tags/portfolio', '348'),
    exact: true
  },
  {
    path: '/blog/tags/troubleshooting',
    component: ComponentCreator('/blog/tags/troubleshooting', '3a1'),
    exact: true
  },
  {
    path: '/blog/togedog',
    component: ComponentCreator('/blog/togedog', 'd43'),
    exact: true
  },
  {
    path: '/blog/trouble',
    component: ComponentCreator('/blog/trouble', 'e71'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '3d7'),
    exact: true
  },
  {
    path: '/me/',
    component: ComponentCreator('/me/', 'dd3'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '912'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '7e2'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'ef2'),
            routes: [
              {
                path: '/docs/category/개인프로젝트',
                component: ComponentCreator('/docs/category/개인프로젝트', '1ae'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/베스텔라랩',
                component: ComponentCreator('/docs/category/베스텔라랩', 'b5f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', '61d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/solo-project/stackover/',
                component: ComponentCreator('/docs/solo-project/stackover/', '9c9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/solo-project/studyground/',
                component: ComponentCreator('/docs/solo-project/studyground/', '1fb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/solo-project/togedog/',
                component: ComponentCreator('/docs/solo-project/togedog/', 'bb2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/solo-project/yeosuro/',
                component: ComponentCreator('/docs/solo-project/yeosuro/', '590'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/vestellalab-project/ansan/',
                component: ComponentCreator('/docs/vestellalab-project/ansan/', '542'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/vestellalab-project/gangnam/',
                component: ComponentCreator('/docs/vestellalab-project/gangnam/', '2a5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/vestellalab-project/pangyo/',
                component: ComponentCreator('/docs/vestellalab-project/pangyo/', '50b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/vestellalab-project/parkops/',
                component: ComponentCreator('/docs/vestellalab-project/parkops/', '900'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/vestellalab-project/thesharpjije-1/',
                component: ComponentCreator('/docs/vestellalab-project/thesharpjije-1/', 'e42'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
