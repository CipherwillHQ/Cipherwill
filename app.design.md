# App Dashboard Design

Applies to: `/app` and `/executor` routes.

## 🎨 Colors (Light / Dark)
- **Sidebar bg**: White `#FFFFFF` / `#101113` (dark)  
- **Content bg**: `#f4f5f7` (dark-50) / `rgba(0,0,0,0.95)` (black/95)  
- **Text**: Black / White  
- **Active selection**: `bg-slate-100 border-l-4 border-black` / `bg-slate-800 border-white`  
- **Borders**: `border-default` (neutral-300 / neutral-800)  
- **Hover**: `bg-neutral-100` / `bg-neutral-700`  

## ✍️ Fonts
- **Body**: Gilroy (400–600)  
- **Sidebar**: `text-sm font-medium`  
- **Divider headers**: `text-sm font-semibold text-neutral-700 dark:text-neutral-300`  

## 🖼️ Layout
- **Shell**: Sidebar (w-min sm:w-60) + content (flex-1, overflow-y-auto)  
- **Viewport**: `w-screen cw-vh-screen cw-app-safe-area`  
- **Executor sidebar**: Same pattern, `w-min sm:w-60`, donor name in header  

## 🔘 Buttons (SimpleButton)
- **Primary**: Blue gradient (`from-primary-700 to-primary`), `rounded-md`  
- **Secondary**: Gray bg + border, `rounded-md`  
- **Danger**: Red gradient, `rounded-md`  

## 🌗 Theme
- `class` strategy on `#app-theme-layout`  
- Persisted in `localStorage` key `"theme"`  
- Switch via `SwitchThemeButton` (TbSun/TbMoon icons)  

## 🎯 Icons
- **Library**: `react-icons` (tb, bi, fi, fa)  
- **Size**: `text-xl` / `text-2xl` in sidebar  
