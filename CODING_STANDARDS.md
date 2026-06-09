# Frontend Coding Standards & Architecture Guideline

This document defines the architectural guidelines and frontend coding standards for the HRMS & Asset Management codebase. All developers must adhere to these rules to maintain a readable, scalable, and highly debuggable codebase.

For Git branching, commit messages, PR workflow, and deployment rules, see **[GIT_STANDARDS.md](./GIT_STANDARDS.md)**.

---

## 1. Separation of Concerns (UI vs. Service Layers)

To prevent UI component bloat and keep presentation code clean:
*   **UI Components (`app/` and `components/`):** Must *only* handle presentation, user interactions, local UI state (modals, active tabs, animations), and form validations.
*   **Service Layer (`services/`):** All data fetching, payloads preparation, URL endpoints configuration, HTTP methods, and API error formatting must reside in dedicated service files (e.g. `services/employee-service.ts`, `services/auth-service.ts`).
*   **UI Integration Rule:** UI components must *never* make direct `fetch` or `axios` calls. They must delegate data actions to service methods.

```typescript
// ❌ WRONG: Inline fetch request inside UI component
useEffect(() => {
  fetch('/api/employees')
    .then(res => res.json())
    .then(data => setEmployees(data));
}, []);

//  CORRECT: Delegated fetching to the service layer
useEffect(() => {
  async function load() {
    const data = await employeeService.getEmployees(fallbackData);
    setEmployees(data);
  }
  load();
}, []);
```

---

## 2. API Communication Client & Fallback Strategies

To ensure robust application behavior in all environments:
*   **Centralized Client (`lib/api.ts`):** All REST calls must route through the shared `api` fetch wrapper. This guarantees consistent headers (e.g. JWT injections, credentials), base URL resolution, and unified console debugging.
*   **Environment Variables:** The API base URL must be loaded from `process.env.NEXT_PUBLIC_API_URL` without exception.
*   **Graceful Degradation / Fallback Mode:** To facilitate offline testing and mock-centric development, all services must implement mock fallbacks on connection timeouts or status `404` errors. This guarantees the application remains testable even when backend nodes are down.

---

## 3. Strict TypeScript Contracts

*   **Explicit Return Types:** All service methods must define strict return signatures (e.g., `Promise<Employee[]>`). Avoid using `any` for request bodies or responses.
*   **Data Models:** Shared data schemas (like `Employee`, `Asset`, `User`) must be defined as clear interfaces/types and imported explicitly. Do not re-define inline typings.

---

## 4. Next.js Routing & Middleware

*   **Native Middleware:** Use `middleware.ts` situated in the root directory for page-level access control and session verification. Avoid custom files like `proxy.ts` that clash with Next.js router configurations.
*   **Client vs. Server Components:** Pre-render static pages as Server Components where possible. Use `'use client'` only when components rely on hooks (`useState`, `useEffect`, `useForm`) or event listeners.

---

## 5. Design & Styling (Tailwind CSS)

*   **Harmonious Color Palettes:** Never hardcode generic hex values or generic primary colors in components. Utilize design system variables (`bg-card`, `border-border`, `text-cloud`, `bg-midnight`, `text-violet-glow`).
*   **Consistency:** Interactive elements (buttons, inputs, dialogs) should follow project border-radius styles (`rounded-xl` or `rounded-2xl`) and transition curves for premium micro-animations.
