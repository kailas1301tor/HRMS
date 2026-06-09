# Git Standards & Branching Workflow

This document defines the Git workflow for the HRMS & Asset Management project. All contributors must follow these rules.

Repository: `https://github.com/kailas1301tor/HR-Optim`

---

## Branch overview

| Branch | Purpose | Deploys to |
|--------|---------|------------|
| **`develop`** | Integration branch for daily work | Stage — `roka-stage.hroptim.com` |
| **`production`** | Live, release-ready code only | Production (when live) |
| **`feature/*`** | New features | — |
| **`fix/*`** | Non-urgent bug fixes | — |
| **`hotfix/*`** | Urgent production patches | — |
| **`chore/*`** | Tooling, dependencies, docs | — |

> **Legacy branch:** `main` is kept temporarily for backward compatibility and should stay synced with `production`. Do **not** open new PRs into `main`. Use `develop` and `production` instead.

**Rule:** No direct commits to `develop` or `production`. All changes go through pull requests.

---

## Branch naming

```
feature/<short-name>    e.g. feature/leave-calendar
fix/<short-name>        e.g. fix/login-error-banner
hotfix/<short-name>     e.g. hotfix/session-cookie
chore/<short-name>      e.g. chore/update-deps
```

Use lowercase and hyphens. Include a ticket ID when available: `feature/HR-123-leave-calendar`.

---

## Workflow

```
feature/fix branch  →  PR into develop       →  deploy to stage
develop             →  PR into production   →  deploy to production
hotfix/*            →  PR into production   →  back-merge PR into develop
```

### Starting new work

```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# ... make changes, commit ...

git push -u origin feature/my-feature
gh pr create --base develop --title "feat(scope): short description"
```

### Releasing to production

After stage QA on `develop`:

```bash
gh pr create --base production --head develop --title "release: YYYY-MM-DD stage sign-off"
```

Merge with a **merge commit** (not squash) to preserve the release boundary.

### Hotfix (urgent production fix)

```bash
git checkout production
git pull origin production
git checkout -b hotfix/critical-fix

# ... fix, commit ...

git push -u origin hotfix/critical-fix
gh pr create --base production --title "hotfix: description"
```

After merging to `production`, open a second PR to merge `production` back into `develop` so both branches stay aligned.

---

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(requests): add leave request form
fix(login): show invalid credential errors without reload
chore: centralize API base URL for stage backend
docs: update git standards
```

Rules:
- Imperative mood ("add", not "added")
- No trailing period on the subject line
- Optional scope in parentheses
- Use the body only when the "why" is not obvious

---

## Pull request rules

- One feature or fix per PR — keep PRs small and reviewable
- Target **`develop`** for all feature/fix/chore work
- Require **1 approval** before merging to `develop` or `production`
- **Squash merge** feature branches into `develop`
- **Merge commit** when merging `develop` → `production`
- Delete the feature branch after merge
- PR title should match commit message format

---

## Server deployment

| Environment | Branch | Deploy steps |
|-------------|--------|--------------|
| **Stage** | `develop` | `git pull origin develop && npm install && npm run build && restart` |
| **Production** | `production` | `git pull origin production && npm install && npm run build && restart` |

Ensure `NEXT_PUBLIC_API_URL` is set before building (see Environment section below).

---

## Environment variables

| File | Committed? | Use |
|------|------------|-----|
| `.env.example` | Yes | Template — copy to `.env.local` locally |
| `.env.local` | No (gitignored) | Local development |
| `.env.production` | Optional | Server-side production/stage build |

Never commit secrets. Stage URL (not secret):

```
NEXT_PUBLIC_API_URL=https://roka-stage-backend.hroptim.com
```

---

## Release checklist (develop → production)

- [ ] Feature tested on stage (`roka-stage.hroptim.com`)
- [ ] `npm run build` passes locally or in CI
- [ ] No known blockers or open critical bugs
- [ ] PR from `develop` → `production` reviewed and approved
- [ ] Optional: tag release on `production` (e.g. `v0.2.0`)

---

## What NOT to do

- Do not commit directly to `develop` or `production`
- Do not reuse a branch name after it has been merged (e.g. `requests`)
- Do not force-push `develop` or `production`
- Do not merge to `production` without going through `develop` (except `hotfix/*`)
- Do not commit `.env.local` or credentials
- Do not open new PRs targeting `main` — use `develop` or `production`

---

## GitHub repository setup (admin — one-time)

Complete these in **GitHub → Settings** for `kailas1301tor/HR-Optim`:

### 1. Default branch

Settings → General → Default branch → set to **`develop`**

### 2. Branch protection — `develop`

Settings → Branches → Add rule → Branch name pattern: `develop`

- [x] Require a pull request before merging
- [x] Require approvals (1)
- [x] Do not allow bypassing the above settings
- [x] Block force pushes

### 3. Branch protection — `production`

Settings → Branches → Add rule → Branch name pattern: `production`

- [x] Require a pull request before merging
- [x] Require approvals (1)
- [x] Restrict who can push (optional — leads/devops only)
- [x] Block force pushes

### 4. Update stage server deploy script

Change the deploy branch from `main` to **`develop`**:

```bash
git pull origin develop
npm install
npm run build
# restart app (pm2, systemd, etc.)
```

### 5. Clean up stale branches (when team confirms)

Delete merged or obsolete remote branches:

```bash
git push origin --delete requests
git push origin --delete feature/employees   # if superseded
```

---

## Quick reference

```bash
# Clone and start working
git clone https://github.com/kailas1301tor/HR-Optim.git
cd HR-Optim
git checkout develop

# New feature
git checkout -b feature/my-feature
git push -u origin feature/my-feature
gh pr create --base develop

# Sync local after merge
git checkout develop && git pull origin develop
```
