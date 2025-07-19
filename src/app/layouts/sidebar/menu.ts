import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'MENUITEMS.MENU.TEXT',
    isTitle: true
  },
  {
    id: 2,
    label: 'MENUITEMS.DASHBOARD.TEXT',
    icon: 'ri-dashboard-2-line',
    link: '/',
  },
  {
    id: 3,
    label: 'MENUITEMS.SETTINGS.TEXT',
    icon: 'ri-dashboard-2-line',
    isCollapsed: true,
    subItems: [
      {
        id: 3,
        label: 'MENUITEMS.SETTINGS.LIST.ADMIN',
        link: '/settings/administration',
        roles: ['admin'],
        parentId: 3
      },
    ]
  },

];
