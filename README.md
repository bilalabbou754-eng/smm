# SMM Panel Pro

Production-ready starter for a full SMM panel built with Next.js, Tailwind CSS, Firebase Firestore, JWT auth, and an external provider API.

## Folder Setup

```text
app/
  api/
  admin/
  dashboard/
  login/
  register/
components/
  auth/
  dashboard/
  landing/
  ui/
lib/
models/
middleware.js
```

## Local Setup

1. Copy `.env.example` to `.env.local`.
2. Add Firebase Admin, JWT, and SMM provider credentials.
3. Install dependencies with `npm install`.
4. Run the app with `npm run dev`.

## Backend API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/dashboard`
- `GET /api/services`
- `GET /api/orders`
- `POST /api/orders`
- `POST /api/orders/sync`
- `GET /api/tickets`
- `POST /api/tickets`
- `POST /api/tickets/[ticketId]/reply`
- `POST /api/funds`
- `GET /api/admin/overview`

## SMM API Integration

The provider client lives in [lib/apiClient.js](/C:/Users/bilal/Documents/Smm/lib/apiClient.js). It expects:

- `GET /services`
- `POST /orders`
- `GET /orders/:id`
- `GET /balance`

If your provider uses a different payload shape, update only this service layer and keep the rest of the app unchanged.

## Deployment

### Vercel

1. Push the project to GitHub.
2. Import the repo into Vercel.
3. Add the environment variables from `.env.example`.
4. Add your Firebase Admin credentials in the Vercel environment settings.

### VPS

1. Install Node.js 20+.
2. Run `npm install`.
3. Build with `npm run build`.
4. Start with `npm run start`.
5. Put Nginx in front of the app and terminate SSL there.

## Notes

- The add-funds flow is mocked but Stripe-ready.
- Admin support replies are schema-ready and need UI wiring if you want full admin ticket handling next.
- Email notifications, multilingual support, and referrals can be added cleanly on top of this structure.
