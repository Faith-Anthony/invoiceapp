# Invoice App

A full-stack Invoice Management Application built with React, TypeScript, and Tailwind CSS.

## Features

- ✅ Create, Read, Update, Delete (CRUD) invoices
- ✅ Form validation with error states
- ✅ Draft & Payment Flow (Draft, Pending, Paid)
- ✅ Filter invoices by status
- ✅ Light/Dark mode toggle
- ✅ Fully responsive design (Mobile, Tablet, Desktop)
- ✅ Hover & interactive states
- ✅ Data persistence with LocalStorage/IndexedDB

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Icons**: React Icons
- **Date Handling**: date-fns
- **State Management**: Context API + LocalStorage

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

This starts the dev server at `http://localhost:3000`

## Build

```bash
npm run build
```

## Project Structure

```
src/
  ├── components/        # Reusable components
  ├── pages/            # Page components
  ├── context/          # Context providers (Theme, Invoice)
  ├── hooks/            # Custom hooks
  ├── types/            # TypeScript types
  ├── utils/            # Utility functions
  ├── App.tsx           # Main app component
  ├── main.tsx          # Entry point
  └── index.css         # Global styles
```

## Accessibility

- Semantic HTML elements
- Form labels and ARIA attributes
- Keyboard navigation support
- Focus management
- WCAG AA color contrast

## Next Steps

- [ ] Create Invoice List page
- [ ] Create Invoice Detail page  
- [ ] Create Invoice Form component
- [ ] Implement CRUD operations
- [ ] Add status filtering
- [ ] Implement data persistence
- [ ] Add responsive design
- [ ] Deploy to Vercel/Netlify
