import type { NavigationMenuItem } from '~/types/navigation';

export const navigationItems: NavigationMenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/',
  },
  {
    label: 'Materiais',
    icon: 'i-lucide-package',
    to: '/items',
  },
  {
    label: 'Compras',
    icon: 'i-lucide-shopping-cart',
    to: '/shop',
  },
];