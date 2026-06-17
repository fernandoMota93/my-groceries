export interface NavigationMenuItem {
  label: string;
  icon: string;
  to?: string;
  action?: () => void;
}