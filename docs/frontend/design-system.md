# CodeGraph Design System

## Core Aesthetic
CodeGraph is a premium, enterprise-grade developer intelligence platform. The design aesthetic is strictly monochrome, optimized for data density and readability. It draws inspiration from Linear, Vercel, Stripe, and GitHub Enterprise.

## Color Palette
- **Background**: `#FFFFFF` (White)
- **Secondary Surface**: `#FAFAFA` (Off-white)
- **Cards/Modals**: `#FFFFFF` (White)
- **Borders**: `#E5E5E5` (Light Gray)
- **Primary Elements**: `#000000` (Black)
- **Text Main**: `#111111` (Near Black)
- **Text Muted**: `#6B7280` (Gray 500)

## Typography
- **Primary Font**: `Inter`
- **Fallback Font**: `system-ui`, `sans-serif`
- **Hierarchy**:
  - Page Title: Large, Bold (e.g., `text-2xl font-bold`)
  - Section Title: Medium, Semibold (e.g., `text-lg font-semibold`)
  - Body: Regular (e.g., `text-sm font-normal`)
  - Metadata: Small, Muted (e.g., `text-xs text-muted`)

## UI Rules
1. **No Gradients**: Solid colors only.
2. **No Neon**: No bright developer aesthetic colors (e.g., neon green/pink).
3. **No Heavy Shadows**: Use subtle 1px borders instead of large drop shadows.
4. **No Glassmorphism**: Avoid translucent blurs.

## Component Library (components/ui)
We implement a lightweight subset of standard UI components (Card, Button, Badge, Table, CommandMenu) mirroring the `shadcn/ui` aesthetic but tailored strictly to our monochrome system using Tailwind CSS variables.
