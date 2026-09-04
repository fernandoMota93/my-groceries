import type { NavigationMenuItem } from "~/types/navigation";

export const navigationItems: NavigationMenuItem[] = [
  {
    label: "DASHBOARD",
    icon: "i-lucide-layout-dashboard",
    to: "/",
  },
  {
    label: "MATERIAIS DO MÊS",
    icon: "i-lucide-package",
    to: "/items/",
  },
    {
    label: "MATERIAIS DA SEMANA",
    icon: "i-lucide-package",
    to: "/items-weekly/",
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
