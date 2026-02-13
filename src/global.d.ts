declare module '*.png';
declare module '*.svg';

// Loose module declaration for the playbook barrel to satisfy TS imports in this workspace.
declare module '@/app/components/playbook' {
  export const Box: any;
  export const Grid: any;
  export const IconButton: any;
  export const Tabs: any;
  export const Tab: any;
  export const TextField: any;
  export type TextFieldProps = any;
  export const List: any;
  export const ListItemButton: any;
  export const ListItemIcon: any;
  export const ListItemText: any;
  export const Tooltip: any;
  export const Select: any;
  export const MenuItem: any;
  export const FormControl: any;
  export const InputLabel: any;
  export const Chip: any;
  export const Checkbox: any;
  export const Avatar: any;
  export const Button: any;
  export const Drawer: any;
  export const Dialog: any;
  export const Card: any;
  export const Badge: any;
  export const Breadcrumbs: any;
  const __playbook_placeholder: any;
  export default __playbook_placeholder;
}

// Allow import of other image types if needed
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
