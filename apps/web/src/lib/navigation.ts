import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingCart,
  FileText,
  Wallet,
  BarChart3,
  Boxes,
  Sparkles,
  Settings,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
  children?: NavItem[];
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export const mainNavGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', href: '/', icon: LayoutDashboard }],
  },
  {
    label: 'Commerce',
    items: [
      { label: 'Retailers', href: '/retailers', icon: Store },
      { label: 'Products', href: '/products', icon: Package },
      { label: 'Orders', href: '/orders', icon: ShoppingCart, badge: 12 },
      { label: 'Invoices', href: '/invoices', icon: FileText },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Payments', href: '/payments', icon: Wallet },
      { label: 'Inventory', href: '/inventory', icon: Boxes },
      { label: 'Reports', href: '/reports', icon: BarChart3 },
    ],
  },
  {
    items: [
      { label: 'AI Assistant', href: '/ai', icon: Sparkles, disabled: false },
      { label: 'Settings', href: '/settings', icon: Settings },
      { label: 'Help', href: '/help', icon: HelpCircle },
    ],
  },
];

export function flattenNavGroups(groups: NavGroup[]): NavItem[] {
  return groups.flatMap((g) => g.items);
}

export function findActiveNavItem(pathname: string): NavItem | undefined {
  const all = flattenNavGroups(mainNavGroups);
  return (
    all.find((item) => item.href === pathname) ??
    all.find((item) => pathname.startsWith(item.href) && item.href !== '/')
  );
}

export function generateBreadcrumbs(pathname: string): { label: string; href: string }[] {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: { label: string; href: string }[] = [{ label: 'Home', href: '/' }];

  let path = '';
  for (const segment of segments) {
    path += `/${segment}`;
    const item = findActiveNavItem(path);
    crumbs.push({
      label: item?.label ?? segment.charAt(0).toUpperCase() + segment.slice(1),
      href: path,
    });
  }

  return crumbs;
}

export interface CommandAction {
  id: string;
  label: string;
  icon: LucideIcon;
  category: 'Navigation' | 'Action' | 'Setting';
  shortcut?: string;
  href?: string;
  action?: () => void;
}

export function getCommandActions(): CommandAction[] {
  return [
    {
      id: 'nav-dashboard',
      label: 'Go to Dashboard',
      icon: LayoutDashboard,
      category: 'Navigation',
      href: '/',
    },
    {
      id: 'nav-retailers',
      label: 'Go to Retailers',
      icon: Store,
      category: 'Navigation',
      href: '/retailers',
    },
    {
      id: 'nav-products',
      label: 'Go to Products',
      icon: Package,
      category: 'Navigation',
      href: '/products',
    },
    {
      id: 'nav-orders',
      label: 'Go to Orders',
      icon: ShoppingCart,
      category: 'Navigation',
      href: '/orders',
    },
    {
      id: 'nav-invoices',
      label: 'Go to Invoices',
      icon: FileText,
      category: 'Navigation',
      href: '/invoices',
    },
    {
      id: 'nav-payments',
      label: 'Go to Payments',
      icon: Wallet,
      category: 'Navigation',
      href: '/payments',
    },
    {
      id: 'nav-inventory',
      label: 'Go to Inventory',
      icon: Boxes,
      category: 'Navigation',
      href: '/inventory',
    },
    {
      id: 'nav-reports',
      label: 'Go to Reports',
      icon: BarChart3,
      category: 'Navigation',
      href: '/reports',
    },
    {
      id: 'nav-settings',
      label: 'Go to Settings',
      icon: Settings,
      category: 'Navigation',
      href: '/settings',
    },
    {
      id: 'nav-help',
      label: 'Go to Help',
      icon: HelpCircle,
      category: 'Navigation',
      href: '/help',
    },
    {
      id: 'action-create-order',
      label: 'Create New Order',
      icon: ShoppingCart,
      category: 'Action',
      shortcut: '⌘N',
    },
    { id: 'action-add-product', label: 'Add New Product', icon: Package, category: 'Action' },
    { id: 'action-add-retailer', label: 'Add New Retailer', icon: Store, category: 'Action' },
    {
      id: 'action-theme',
      label: 'Toggle Theme',
      icon: LayoutDashboard,
      category: 'Setting',
      shortcut: '⌘T',
    },
  ];
}
