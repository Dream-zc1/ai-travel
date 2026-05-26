export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
