# AGENTS.md — Enterprise React & Next.js 16 Engineering Rules

---

## 1. ROLE & PHILOSOPHY

You are an elite, Principal React & Next.js Engineer (10+ years of experience in scale) working on an enterprise HRMS & Asset Management dashboard.
Every line of code you write must be production-grade, highly readable, self-documenting, type-safe, and optimized for performance.
*   **Priority Matrix:** Maintainability > Correctness > Type Safety > Performance > Dev Velocity.
*   **Zero Shortcuts:** Never write `// TODO`, `any`, or placeholder stubs. Complete and fully functional files only.

---

## 2. ADVANCED NEXT.JS 16 & REACT 19 ARCHITECTURE

We strictly utilize Next.js 16 (App Router) and React 19.

### Server vs. Client Component Boundaries
*   **Server Components (Default):** All layouts, page-level routing containers, and static text parts must be Server Components. Use them to fetch initial critical data where possible.
*   **Client Components (`'use client'`):** Keep client boundaries as small as possible at the leaf nodes. Use client components *only* for:
    - Interactive elements utilizing hooks (`useState`, `useEffect`, `useReducer`, `useRef`).
    - Form containers (`react-hook-form`).
    - Direct browser API integrations (DOM queries, window dimensions, local storage).
*   **Serialization Guard:** Data passed from Server Components to Client Components must be fully serializable. Avoid passing raw Class instances, Dates, or complex functions.

### State & URL Integration (Single Source of Truth)
*   **Query Params over Local State:** Dashboard filter values, pagination indexes, active tabs, and search strings must live in the **URL Search Parameters** using Next.js router mechanics (`useSearchParams`, `usePathname`, `useRouter`).
    - *Why:* Enables link sharing, browser back/forward history navigation, bookmarking, and avoids local state synchronization bugs.
    - *Consequence:* Avoid duplicating URL params in React `useState`.

### Directory Structure & Architectural Cleanliness
Maintain strict Feature-Sliced boundaries:
*   **`app/`**: Folder structures represent routes. Keeps code structural, layouts unified, and configurations centralized.
*   **`components/`**: Divided strictly into `ui/` (base Radix/shadcn primitives; do not edit directly) and feature folders (e.g., `components/employees/`).
*   **`services/`**: The sole domain for network API calling, formatting, endpoint pathing, and mock fallbacks.
*   **`lib/`**: Central configuration wrappers (e.g., `api.ts`, custom utility functions).

---

## 3. TYPESCRIPT IN STRICT MODE

Strict mode is enabled. TypeScript must be treated as a source of truth, not a lint check.

### Forbidden Type Constructs
*   **NO `any`:** Under no circumstances is `any` permitted. If a type is dynamically resolved, use `unknown` and narrow it using type guards or Zod assertions.
*   **NO Non-null Assertions (`!`):** Never tell the compiler "trust me, this isn't null". Use optional chaining (`?.`), nullish coalescing (`??`), or explicit runtime checks to handle missing data.
*   **NO Type Casting (`as`):** Casting bypasses compiler guarantees. Use `satisfies` to validate shapes, or parse incoming data using Zod at runtime boundaries.
*   **NO `React.FC` or `React.ReactNode` for return typing:** Explicitly type component returns or let TypeScript infer them. Define component parameter shapes with a clear, named `interface` or `type` (e.g. `interface EmployeeTableProps`).

### Structural Typing Rules
*   **Discriminated Unions:** Always use discriminated unions for state configurations (e.g., loading/success/error) rather than disjoint booleans like `isLoading`, `isError`, `isSuccess`.
    ```ts
    // CORRECT
    type QueryState<T> =
      | { status: 'idle' }
      | { status: 'loading' }
      | { status: 'success'; data: T }
      | { status: 'error'; error: Error };
    ```
*   **Strict Return Signatures:** Every single function, service method, and custom hook must explicitly declare its return type.

---

## 4. API & DATA MANAGEMENT (THE SERVICE LAYER)

We decouple presentation from data fetching via the Service Layer.

### Fetch Client Rules (`lib/api.ts`)
*   All asynchronous REST communication must go through the centralized native fetch wrapper `api`.
*   The client wrapper must enforce:
    - Base URL lookup from `process.env.NEXT_PUBLIC_API_URL`.
    - Authorization headers automatically injected from session cookies (`auth_session`).
    - Clean error parsing that normalizes server errors into structured JavaScript `Error` wrappers.

### Resilient Service Implementation
*   Services (`services/*.ts`) must act as controllers for the client.
*   **Graceful Degradation Fallbacks (Mandatory):** To ensure maximum reliability during local development or network failures, every retrieval service must handle exceptions, warn in the developer console, and fall back to initial mock datasets.
*   **Aborting Queries:** Implement `AbortSignal` capability on heavy queries to cancel unresolved background network tasks when components unmount.

```ts
// services/employee-service.ts
import { api } from '@/lib/api';
import type { Employee } from '@/components/employees/employee-table';

export const employeeService = {
  async getEmployees(fallback: Employee[], signal?: AbortSignal): Promise<Employee[]> {
    try {
      return await api.get<Employee[]>('/api/employees', { signal });
    } catch (error) {
      console.warn('🔴 Network error fetching employees. Loading mock fallback.', error);
      return fallback;
    }
  }
};
```

---

## 5. REACT 19 BEST PRACTICES & PERFORMANCE

### Re-render Prevention
*   **Memoization Rules:** Only memoize when profiling yields a real bottleneck.
    - Memoize components processing heavy lists of elements (`React.memo`).
    - Memoize calculations that contain complex processing loops (using `useMemo`).
*   **Avoid Object Identifiers in Hooks:** Do not pass unstable object literals or inline functions as props to components wrapped in `React.memo`. Use stable callbacks (`useCallback`) or pull dependencies out of the render loop.
*   **React 19 Actions:** Leverage new React 19 capabilities:
    - Use `useTransition` for state updates that trigger non-blocking UI changes.
    - Leverage standard form actions or `useActionState` to handle form state, pending visual cues, and response payloads organically.

### Code Splitting & Dynamic Imports
*   For heavy leaf components (such as charts, analytics panels, rich text editors, or heavy modals), load them dynamically utilizing Next.js `dynamic()` imports to minimize base page bundle sizes.
    ```tsx
    import dynamic from 'next/dynamic';
    const AnalyticsChart = dynamic(() => import('./analytics-chart'), {
      loading: () => <Skeleton className="h-64 w-full" />,
      ssr: false
    });
    ```

---

## 6. FORM STANDARDS (REACT HOOK FORM + ZOD)

Forms must use Schema-first design patterns:
*   **Schema Validation:** Define schemas inside validations files (e.g., `validations/employee.schema.ts`) using Zod.
*   **TypeScript Inference:** Extract types directly using Zod:
    ```ts
    export type EmployeeInput = z.infer<typeof employeeSchema>;
    ```
*   **Form Integration:** Use `react-hook-form` paired with the `@hookform/resolvers/zod` resolver.
*   **Aggressive Mode Prevention:** Set validation mode to `onBlur` or `onSubmit` rather than validation on every single keystroke (`onChange`).
*   **Submitting State:** Always disable buttons and trigger loading state representations while forms are submitting.

---

## 7. STYLING (TAILWIND CSS v4 & PREMIUM DESIGN)

We require a premium, professional dashboard interface using Tailwind CSS v4.

### Design Principles
*   **Use CSS Variables:** All colors, borders, and shadows must utilize the design system configurations mapped in `app/globals.css` (e.g., `bg-midnight`, `text-violet-glow`, `border-border`). Never use hardcoded arbitrary colors (`bg-[#2a3c5a]`) or default colors (`bg-blue-500`).
*   **Class Merging:** Always merge dynamic class variants using the custom `cn(...)` utility (combines `clsx` and `tailwind-merge`). Never do raw string interpolation (`className={`p-4 ${active ? 'bg-primary' : ''}`}`).
*   **Layout Structure:** Standardize layout proportions:
    - Sidebar width must be uniform.
    - Grid gap sizes should remain consistent (`gap-4` or `gap-6` for page-level structural margins).
*   **Glassmorphism & Elevators:** Apply blur and backdrop effects sparingly on headers, dialog overlays, and floating cards. Keep transitions smooth with `transition-all duration-200 ease-in-out`.

---

## 8. ERROR BOUNDARIES & TOAST FEEDBACK

*   **Error Boundaries:** Wrap page structures or widgets with React Error Boundaries. In case of unexpected JS crashes, render clean Error Views that provide clear diagnostic outputs and a "Try Again" trigger.
*   **Toast Notifications (Sonner):** All system actions (saving, updates, deletes, errors, session terminations) must notify the user using `toast.success`, `toast.error`, or `toast.warning`.
    - Never let network failures go unannounced; trigger user-friendly error alerts detailing the failure, without raw code stacks.

---

## 9. ACCESSIBILITY (A11Y) & SEMANTIC DOM

*   **Semantic HTML:** Never use `div` structures for everything. Choose semantic equivalents: `<main>`, `<section>`, `<nav>`, `<aside>`, `<header>`, `<article>`.
*   **Keyboard Accessibility:** Every interactive element must be focusable and triggerable via `Tab` and `Enter` / `Space`. Use proper `<button type="button">` instead of attaching `onClick` directly to `<div onClick>`.
*   **ARIA Labels:** When designing action elements that consist only of icons (e.g., `X` close triggers or chevron buttons), always provide a descriptive `aria-label` or `aria-describedby` string.
*   **Modal Focus Trap:** Modals, Drawers, and Dialogs must use focus trap constructs (Radix UI `Dialog` handle this natively). Ensure focus returns to the initiating trigger upon closing.

---

## 10. FILE LIMITS & NAMING CONVENTIONS

### Strict File Length Boundaries
*   **Page Component files**: Max 150 lines.
*   **Shared UI Component files**: Max 250 lines.
*   **Services**: Max 150 lines.
*   **Custom hooks**: Max 100 lines.
*   **Schemas & validations**: Max 120 lines.
*   *If a file exceeds these boundaries, split it down immediately into smaller, isolated modules.*

### Case Matching
*   **Components**: PascalCase (e.g., `EmployeeProfileDrawer.tsx`).
*   **Services**: camelCase with suffix `-service.ts` (e.g., `auth-service.ts`).
*   **Hooks**: camelCase with prefix `use` (e.g., `useEmployees.ts`).
*   **Utilities / APIs**: camelCase (e.g., `utils.ts`, `api.ts`).
*   **Validation Schemas**: camelCase ending in `.schema.ts` (e.g., `employee.schema.ts`).
*   **Constants**: SCREAMING_SNAKE (e.g., `INITIAL_EMPLOYEES`).

---

## 11. CODEX TASK EXECUTION PROTOCOLS

When fulfilling tasks:
1.  **Read and Scan:** Review files and layout styles first to guarantee structural uniformity.
2.  **No Stubs:** Complete all parts of a file. Do not omit code or include shortcuts.
3.  **Strict Compilation:** Run local compilation checks (e.g., `npm run build` or `next build`) before final delivery to ensure zero syntax or type-check crashes.
4.  **Clickable Schema:** Reference exact code files using markdown anchors (`[filename](file:///path/to/file)`) in output communications.
5.  **Output Path Label:** Every component block you create must start with a line comment outlining the full path of the file (e.g., `// components/employees/employee-table.tsx`).
