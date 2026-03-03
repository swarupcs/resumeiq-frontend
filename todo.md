# 🚀 ResumIQ — Product Roadmap & Feature Tracker

> **Stack:** React + Vite · Redux Persist · TanStack Query · Tailwind CSS · Axios · Node.js Backend
> 
> A living document tracking every feature — built, in progress, and planned.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Already built |
| 🔨 | Partially built / needs polish |
| 📋 | Planned — next priority |
| 🔮 | Future / stretch goal |
| 💰 | Revenue-critical (SaaS) |
| 🤖 | AI-powered feature |

---

## 1. 🔐 Authentication & User Management

- [x] ✅ Email + password **signup**
- [x] ✅ Email + password **signin**
- [x] ✅ **JWT session** via HTTP-only cookies
- [x] ✅ **Redux Persist** auth state across page reloads
- [x] ✅ **Protected routes** (redirect to login if unauthenticated)
- [x] ✅ **Guest routes** (redirect to dashboard if already logged in)
- [x] ✅ User **logout** with full state clear
- [x] ✅ Display user **first name** in navbar + dashboard greeting
- [ ] 📋 **Google OAuth** login (reduces signup friction significantly)
- [ ] 📋 **GitHub OAuth** login
- [ ] 📋 **Email verification** on signup
- [ ] 📋 **Forgot password** flow (send reset email)
- [ ] 📋 **Reset password** page
- [ ] 📋 **Change password** in settings
- [ ] 🔮 **Two-factor authentication** (2FA via TOTP/email)
- [ ] 🔮 **Active session management** — view & revoke sessions
- [ ] 🔮 **Account deletion** with data wipe

---

## 2. 👤 User Profile & Settings

- [x] ✅ Basic user data stored (firstName, lastName, emailId)
- [ ] 📋 **User profile page** — edit name, email, avatar
- [ ] 📋 **Avatar upload** for user account
- [ ] 📋 **Notification preferences** toggle (email alerts on/off)
- [ ] 📋 **Timezone / locale** settings
- [ ] 🔮 **Linked accounts** — show connected OAuth providers
- [ ] 🔮 **Data export** — download all resume data as JSON/ZIP
- [ ] 🔮 **GDPR compliance** — cookie consent, data deletion request

---

## 3. 📄 Resume Management (Core)

- [x] ✅ **Create resume** with custom title
- [x] ✅ **Fetch resume by ID** (authenticated)
- [x] ✅ **Update resume** (full data patch via multipart/form-data)
- [x] ✅ **Delete resume** with confirmation dialog
- [x] ✅ **Rename resume title** inline from dashboard
- [x] ✅ **List all user resumes** on dashboard
- [x] ✅ **Toggle public / private** visibility per resume
- [x] ✅ **Public resume preview** page (no auth required)
- [x] ✅ **Share resume link** — copy to clipboard
- [x] ✅ **Upload existing resume PDF** — extract text via pdf.js
- [x] ✅ **Search resumes** by title on dashboard
- [x] ✅ **Sort resumes** by title / created / updated
- [x] ✅ **Grid / list view** toggle on dashboard
- [x] ✅ **Resume accent color** — 20 color options
- [x] ✅ **Accent color dot** shown on resume card
- [ ] 📋 **Duplicate / clone resume** — copy as starting point
- [ ] 📋 **Resume versioning** — save named snapshots, restore old versions
- [ ] 📋 **Section reordering** — drag-and-drop form sections
- [ ] 📋 **Resume completion score** — % of sections filled, shown on card
- [ ] 📋 **Last saved indicator** — "Saved 2 min ago" in builder toolbar
- [ ] 📋 **Auto-save** on change with debounce (currently manual save only)
- [ ] 🔮 **Resume folders / tags** — organise resumes into categories
- [ ] 🔮 **Resume lock** — prevent accidental edits to finalised resumes
- [ ] 🔮 **Bulk delete** resumes from dashboard
- [ ] 🔮 **Archive resumes** — hide without deleting

---

## 4. ✍️ Resume Builder — Sections

- [x] ✅ **Personal Info** — name, email, phone, location, profession, LinkedIn, website
- [x] ✅ **Profile photo upload** with preview
- [x] ✅ **Background removal** toggle for profile photo
- [x] ✅ **Professional Summary** with character textarea
- [x] ✅ **Work Experience** — company, position, dates, description, "currently working" checkbox
- [x] ✅ **Education** — institution, degree, field, graduation date, GPA
- [x] ✅ **Projects** — name, type, description
- [x] ✅ **Skills** — tag-based input with add/remove
- [x] ✅ **Progress bar** showing builder section completion
- [x] ✅ **Section navigation** icons (prev/next + click to jump)
- [ ] 📋 **Certifications** section — name, issuer, date, credential URL
- [ ] 📋 **Languages** section — language + proficiency level
- [ ] 📋 **Volunteer Work** section
- [ ] 📋 **Publications / Research** section
- [ ] 📋 **Awards & Honors** section
- [ ] 📋 **Custom section** — user-defined section name + free-form content
- [ ] 📋 **Skill categories** — group skills (Frontend, Backend, Tools, Soft Skills)
- [ ] 📋 **Skill proficiency levels** — beginner / intermediate / expert with visual bars
- [ ] 🔮 **Drag-and-drop** reorder items within each section (e.g. reorder jobs)
- [ ] 🔮 **Rich text editor** for description fields (bold, bullets, links)

---

## 5. 🎨 Templates & Design

- [x] ✅ **Classic** template
- [x] ✅ **Modern** template (sidebar layout)
- [x] ✅ **Minimal** template
- [x] ✅ **Minimal Image** template
- [x] ✅ **Executive** template
- [x] ✅ **Creative** template
- [x] ✅ **Professional** template
- [x] ✅ **Template selector** dropdown in builder
- [x] ✅ **Live preview** updates instantly on edit
- [x] ✅ **Template switcher** on public preview page
- [x] ✅ **Color switcher** on public preview page
- [ ] 📋 **2–3 more templates** (e.g. Two-Column, Timeline, Compact)
- [ ] 📋 **Font family selector** — choose from 4–5 curated font pairs
- [ ] 📋 **Font size control** — small / medium / large
- [ ] 📋 **Spacing control** — compact / normal / spacious
- [ ] 📋 **Section visibility toggles** — show/hide sections without deleting data
- [ ] 🔮 **Custom color for each template element** (header, text, borders)
- [ ] 🔮 **Dark mode resume** option for creative roles
- [ ] 🔮 **Template preview thumbnails** (visual cards instead of text list)
- [ ] 🔮 **Community templates** — user-submitted template marketplace

---

## 6. 🤖 AI Features

- [x] ✅ 🤖 **AI enhance Professional Summary** — rewrite with GPT
- [x] ✅ 🤖 **AI enhance Job Description** — improve bullet points per role
- [x] ✅ 🤖 **AI resume upload parser** — extract structured data from PDF text
- [ ] 📋 🤖 **Job description tailoring** — paste a JD, AI rewrites resume to match keywords
- [ ] 📋 🤖 **ATS score checker** — simulate ATS parsing, show keyword gap analysis
- [ ] 📋 🤖 **Cover letter generator** — generate from resume + job description
- [ ] 📋 🤖 **Resume grader** — overall quality score with per-section feedback
- [ ] 📋 🤖 **Skill suggestions** — AI suggests missing skills based on profession
- [ ] 📋 🤖 **AI summary from scratch** — generate summary purely from experience data
- [ ] 📋 🤖 **Bullet point generator** — turn a rough note into 3 polished achievement bullets
- [ ] 🔮 🤖 **LinkedIn profile import** — paste LinkedIn URL → auto-fill entire resume
- [ ] 🔮 🤖 **Multi-language resume** — generate resume in French, German, Spanish, etc.
- [ ] 🔮 🤖 **AI interview prep** — generate likely interview questions from your resume
- [ ] 🔮 🤖 **Tone detector** — flag passive or weak language ("responsible for" → "led")
- [ ] 🔮 🤖 **Quantification suggestions** — prompt user to add numbers to vague bullets
- [ ] 🔮 🤖 **AI chat assistant** — chat sidebar to ask "make this more senior-sounding"

---

## 7. 📤 Export & Download

- [x] ✅ **Export to PDF** — Puppeteer server-side rendering from live frontend state
- [x] ✅ **Public resume PDF download** (no auth required for public resumes)
- [x] ✅ **Print** support via CSS `@media print`
- [x] ✅ **Zoom controls** on preview page (50%–150%)
- [x] ✅ **Fullscreen** preview mode
- [ ] 📋 **Export to DOCX** — Word-compatible download
- [ ] 📋 **One-page enforcement** — warn/auto-scale if resume exceeds one page
- [ ] 📋 **Custom filename** when downloading PDF
- [ ] 🔮 **Export to plain text** — for copy-pasting into ATS portals
- [ ] 🔮 **Export to JSON** — portable resume data (JSON Resume standard)
- [ ] 🔮 **Save to Google Drive** directly
- [ ] 🔮 **Send via email** — email PDF to yourself or a recruiter

---

## 8. 🔗 Sharing & Public Profile

- [x] ✅ **Public resume URL** — `/preview/:resumeId`
- [x] ✅ **Copy share link** to clipboard
- [x] ✅ **Share via Web Share API** (mobile)
- [x] ✅ **Share via Email** (mailto link)
- [x] ✅ **Share on LinkedIn**
- [x] ✅ **Share on Twitter/X**
- [x] ✅ **QR code modal** for the share URL
- [ ] 📋 **Resume analytics** — track total views, downloads, unique visitors per resume
- [ ] 📋 **View count display** — show real count (currently random mock number)
- [ ] 📋 **Custom slug** — `resumeiq.com/u/johndoe` vanity URL
- [ ] 📋 **Password-protected resume** — set a password for private sharing
- [ ] 🔮 **Resume expiry** — set link to expire after N days
- [ ] 🔮 **Viewer notifications** — "Someone viewed your resume in New York"
- [ ] 🔮 **Public profile page** — one page listing all public resumes from a user

---

## 9. 💰 Monetization & Subscriptions

- [ ] 📋 💰 **Stripe integration** — checkout, webhooks, customer portal
- [ ] 📋 💰 **Free tier limits** — 3 resumes, 5 AI enhancements/month, watermark on PDF
- [ ] 📋 💰 **Pro plan** — unlimited resumes, unlimited AI, no watermark, priority support
- [ ] 📋 💰 **Team plan** — workspace, multiple seats, shared templates
- [ ] 📋 💰 **Usage tracking** — count AI calls per user per billing period
- [ ] 📋 💰 **Upgrade prompt** — show paywall modal when free limits hit
- [ ] 📋 💰 **Billing page** — current plan, next renewal date, invoice history
- [ ] 📋 💰 **Plan comparison page** — Pricing page on landing
- [ ] 🔮 💰 **Annual discount** — save 20% on annual billing
- [ ] 🔮 💰 **Lifetime deal** — one-time payment option (for launches)
- [ ] 🔮 💰 **Referral program** — invite friend → both get 1 month Pro free
- [ ] 🔮 💰 **Promo / coupon codes** — apply discount codes at checkout
- [ ] 🔮 💰 **Free trial** — 7-day Pro trial, no credit card required

---

## 10. 📊 Dashboard & Analytics (User-facing)

- [x] ✅ Resume cards with gradient, template badge, color dot
- [x] ✅ Public/private badge per resume
- [x] ✅ Last updated date on card
- [x] ✅ Hover actions (Preview, Download)
- [x] ✅ Empty state with feature highlights
- [x] ✅ Search + sort + view toggle
- [ ] 📋 **Resume completion indicator** — progress ring on card
- [ ] 📋 **Activity feed** — "Resume updated 2h ago", "Downloaded 3 times today"
- [ ] 📋 **Quick stats bar** — total resumes, total views, AI uses remaining
- [ ] 📋 **Pinned / favourite resume** — star a resume to pin it to top
- [ ] 🔮 **Resume performance chart** — views over time graph
- [ ] 🔮 **Suggested actions** — "Your resume hasn't been updated in 30 days"

---

## 11. 🗂️ Job Application Tracker

- [ ] 📋 **Job board** — add job applications (company, role, URL, salary)
- [ ] 📋 **Application status pipeline** — Applied → Screening → Interview → Offer → Rejected
- [ ] 📋 **Link resume to application** — attach which resume version was used
- [ ] 📋 **Notes per application** — interview notes, follow-up reminders
- [ ] 🔮 **Kanban view** — drag cards across pipeline stages
- [ ] 🔮 **Calendar view** — interview dates, follow-up deadlines
- [ ] 🔮 **Email reminders** — "Follow up with Stripe in 3 days"
- [ ] 🔮 **Chrome extension** — one-click save jobs from LinkedIn/Indeed

---

## 12. 👥 Teams & Collaboration

- [ ] 🔮 **Team workspaces** — create an org, invite members
- [ ] 🔮 **Shared template library** — team-wide custom templates
- [ ] 🔮 **Role-based access** — owner / editor / viewer per resume
- [ ] 🔮 **Inline comments** — leave feedback on specific resume sections
- [ ] 🔮 **Review & approval flow** — mark resume as "needs review" / "approved"
- [ ] 🔮 **Activity log** — who edited what and when

---

## 13. 🏠 Landing Page & Marketing

- [x] ✅ **Hero section** with animated mockup
- [x] ✅ **Features section** (6 feature cards)
- [x] ✅ **How it works** (3-step process)
- [x] ✅ **CTA section** with feature pills
- [x] ✅ **Footer** with nav links
- [x] ✅ **Navbar** with auth-aware state, theme toggle, mobile menu
- [ ] 📋 **Testimonials section** (component exists, currently commented out — add real data)
- [ ] 📋 **Pricing section** on landing page
- [ ] 📋 **FAQ section**
- [ ] 📋 **SEO meta tags** — title, description, og:image per page
- [ ] 📋 **Sitemap.xml** + robots.txt
- [ ] 🔮 **Blog / content section** — resume tips for SEO traffic
- [ ] 🔮 **Changelog page** — "What's new" updates
- [ ] 🔮 **Affiliate landing pages** — for specific job roles (e.g. "Software Engineer Resume")
- [ ] 🔮 **Product Hunt launch kit** — assets, upvote link

---

## 14. 🔔 Notifications & Email

- [ ] 📋 **Transactional emails** — welcome, password reset, plan confirmation (Resend / SendGrid)
- [ ] 📋 **Resume view notification** — email when someone views your public resume
- [ ] 📋 **Weekly digest** — "Your resume was viewed 12 times this week"
- [ ] 📋 **In-app notification bell** — real-time alerts in the navbar
- [ ] 🔮 **Push notifications** (PWA) — browser push for view alerts
- [ ] 🔮 **Slack integration** — get resume view notifications in Slack

---

## 15. 🛡️ Admin Panel

- [ ] 📋 **Admin dashboard** — total users, MRR, active resumes, AI usage
- [ ] 📋 **User management** — search users, view details, suspend accounts
- [ ] 📋 **Revenue metrics** — MRR, churn, new signups chart
- [ ] 📋 **Feature flags** — toggle features per user / globally
- [ ] 🔮 **Support ticket view** — see user-submitted issues
- [ ] 🔮 **Impersonate user** — log in as a user for debugging
- [ ] 🔮 **Audit log** — track all admin actions

---

## 16. ⚙️ Developer & Infrastructure

- [x] ✅ **Axios interceptors** — request/response logging, 401 handling
- [x] ✅ **Public Axios instance** — separate instance for unauthenticated endpoints
- [x] ✅ **Centralised error handler** — `handleApiError` with toast
- [x] ✅ **TanStack Query** — caching, invalidation, loading/error states
- [x] ✅ **Environment variables** — `VITE_BACKEND_URL` via `.env`
- [ ] 📋 **Error boundary** — catch React render errors gracefully
- [ ] 📋 **Loading skeleton components** — replace spinners with content skeletons
- [ ] 📋 **Rate limiting UI** — show "5 AI uses left this month" indicator
- [ ] 📋 **Offline detection** — toast when user loses internet connection
- [ ] 📋 **PWA manifest** — installable on mobile home screen
- [ ] 🔮 **E2E tests** — Playwright or Cypress critical path tests
- [ ] 🔮 **Unit tests** — Vitest for hooks and service functions
- [ ] 🔮 **CI/CD pipeline** — GitHub Actions: lint → test → deploy
- [ ] 🔮 **Error monitoring** — Sentry for frontend error tracking
- [ ] 🔮 **Analytics** — PostHog or Mixpanel for funnel/event tracking
- [ ] 🔮 **Web Vitals monitoring** — track CWV scores

---

## 17. 📱 Mobile & Accessibility

- [x] ✅ **Responsive navbar** with mobile hamburger menu
- [x] ✅ **Responsive dashboard** grid (1→2→3→4 cols)
- [ ] 📋 **Mobile-optimised builder** — stacked layout, preview below form
- [ ] 📋 **Touch-friendly controls** — larger tap targets on mobile
- [ ] 📋 **ARIA labels** on all interactive elements
- [ ] 📋 **Keyboard navigation** throughout builder
- [ ] 🔮 **Mobile app** (React Native or Expo)

---

## 18. 🌐 Internationalisation

- [ ] 🔮 **i18n support** — English, Spanish, French, German, Hindi
- [ ] 🔮 **RTL layout support** — Arabic, Hebrew
- [ ] 🔮 **Localised date/currency formats**
- [ ] 🔮 **Resume language selector** — generate resume content in target language

---

## 📅 Suggested Sprint Order

### Sprint 1 — Make it a Real SaaS 💰
1. Stripe subscriptions (Free / Pro tiers)
2. Usage limits + paywall modal
3. Pricing page on landing
4. Billing management page

### Sprint 2 — AI Value Boost 🤖
5. Job description tailoring (paste JD → AI rewrites resume)
6. ATS score checker
7. Cover letter generator
8. Resume grader with per-section feedback

### Sprint 3 — Retention & Engagement
9. Auto-save with debounce
10. Resume analytics (real view/download tracking)
11. Resume completion score on cards
12. Job application tracker (basic kanban)

### Sprint 4 — Builder Polish
13. Duplicate resume
14. Section visibility toggles
15. Certifications + Languages sections
16. Custom sections

### Sprint 5 — Growth & Auth
17. Google OAuth
18. Email verification + forgot password
19. Transactional emails (Resend)
20. Referral program

### Sprint 6 — Scale
21. Admin dashboard
22. Feature flags
23. Error monitoring (Sentry)
24. E2E tests (Playwright)

---

## 📈 Current Progress

```
Auth & User Management       ████████░░  75%
Resume Management (Core)     █████████░  88%
Resume Builder Sections      ███████░░░  65%
Templates & Design           ████████░░  72%
AI Features                  ████░░░░░░  35%
Export & Download            ██████░░░░  55%
Sharing & Public Profile     ████████░░  75%
Monetization                 ░░░░░░░░░░   0%  ← CRITICAL GAP
Dashboard & Analytics        █████░░░░░  50%
Job Application Tracker      ░░░░░░░░░░   0%
Landing Page & Marketing     ███████░░░  68%
Infrastructure & DevOps      ████░░░░░░  40%
```

---

*Last updated: 2026 · Built with React + Node.js · AI-powered by Claude/GPT*