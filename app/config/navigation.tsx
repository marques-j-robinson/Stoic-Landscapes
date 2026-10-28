export interface NavItem {
    label: string;
    href: string;
}

export const navItems: NavItem[] = [
    { label: 'Home', href: '/'},
    { label: 'About', href: '/about'},
    { label: 'Contact', href: '/contact'},
]