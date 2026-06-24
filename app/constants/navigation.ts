import type { NavigationMenuItem } from "~/types/navigation";

export const navigationItems: NavigationMenuItem[] = [
  {
    label: "DASHBOARD",
    icon: "i-lucide-layout-dashboard",
    to: "/",
  },
  {
    label: "MATERIAIS",
    icon: "i-lucide-package",
    to: "/items/",
  },
  {
    label: "COMPRAS",
    icon: "i-lucide-shopping-cart",
    to: "/shopping/",
  },
  {
    label: "FRACIONAMENTO",
    icon: "i-lucide-shopping-cart",
    to: "/auxiliary/",
  },
];
