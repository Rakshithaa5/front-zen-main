# Changelog

All notable changes to MoodByte will be documented in this file.

## [1.0.0] - 2026-04-15

### Added
- Mood-based restaurant and dish recommendations (6 moods: Happy, Sad, Tired, Angry, Sick, Celebration)
- Customer order placement, tracking, and history
- Real-time order tracking with interactive delivery map
- 5 payment methods: UPI, Card, Net Banking, Wallet, COD
- Coupon system with 3 active discount codes
- Restaurant owner dashboard with menu management and analytics
- Admin dashboard with platform-wide analytics and restaurant verification
- Customer profile with order history and password management
- Role-based access control (Customer, Owner, Admin)
- Docker Compose setup for local development
- GitHub Actions CI/CD pipeline
- Full TypeScript coverage with Vite build tooling

### Features
- **Frontend**: React 18, Tailwind CSS, shadcn/ui, React Router, TanStack Query
- **Backend**: Node.js, Express, Supabase, JWT auth
- **Database**: PostgreSQL (Supabase)
- **Maps**: Leaflet with OpenStreetMap
- **Testing**: Vitest + Testing Library
- **Quality**: ESLint, TypeScript strict mode

## Versioning Scheme

Uses [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

## Tag Format

- Production releases: `v1.0.0`, `v1.1.0`, `v2.0.0`
- Beta releases: `v1.0.0-beta.1`
- Release candidates: `v1.0.0-rc.1`

## How to Create a New Release

    # 1. Update VERSION file
    echo "1.1.0" > VERSION

    # 2. Update package.json versions
    npm version minor

    # 3. Commit changes
    git commit -am "chore: release v1.1.0"

    # 4. Create annotated tag
    git tag -a v1.1.0 -m "Release v1.1.0 - Description of changes"

    # 5. Push to GitHub
    git push origin main --tags
