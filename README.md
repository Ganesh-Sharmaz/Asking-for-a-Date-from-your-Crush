# Asking for a Date with a crush using an automated message sent on WhatsApp 💘

This is a repo for making a Website using HTML, CSS, and JavaScript that allows users to ask their crush for a Date! and a custom message is sent to your crush automatically using JavaScript.

# Disclaimer ⚠️
We cannot guarantee that this landing page will result in a successful date or relationship. Use at your own risk (but hey, at least you tried, right?).

## Use it without touching code

You do not need to edit `index.html`, change JavaScript, or replace a phone number manually anymore.

1. Open the live [Ask Your Crush landing page](https://asking-for-a-date-from-your-crush.vercel.app/landing).
2. Choose **Create yours**.
3. Fill in your own question, button labels, celebration message, and **your WhatsApp number**.
4. Click **Save & create link**.
5. Copy your unique `/d-...` link and send it to your crush.

The home page at [asking-for-a-date-from-your-crush.vercel.app](https://asking-for-a-date-from-your-crush.vercel.app/) is still the original playable example. Your custom pages are created from the builder and can be edited or deleted from the same browser. Two links are free; additional links will be part of a paid plan currently under development.

## Installation for developers

Clone the repository and install the server dependency:

```bash
npm install
```

Run it as a Vercel project, configure the Firebase Admin variables from `.env.example`, and deploy the Firestore rules before using the builder. Opening `index.html` directly is only useful for viewing the static example; the creator dashboard and generated links need the Vercel API and Firestore.

## Customize everything yourself

If you are a developer and want full control, edit the HTML, CSS, and JavaScript directly. The original example lives in `index.html`; the landing page, builder, generated page, API routes, and styling are separated into their own files. Please keep the server-only Firebase private key out of client-side code and out of Git.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening an issue or pull request. For anything beyond a small documentation or typo fix, open an issue first and wait for the proposal to be acknowledged. Pull requests without enough context, testing details, or a related issue may be closed and asked to be resubmitted.

Please also review the [Code of Conduct](CODE_OF_CONDUCT.md), [Security Policy](SECURITY.md), and [MIT License](LICENSE).

## Create personalized date pages

- Landing page: `/landing`
- Date page builder and creator dashboard: `/create`
- Generated public links use the `/d-xxxxxxxxxx` format.

The builder allows two free links per browser creator. The creator cookie is `HttpOnly` and is checked server-side for listing, editing, and deleting links. Generated links remain publicly readable so the person receiving a link can open it without an account.

### Firebase and Vercel setup

The API uses the Firebase Admin SDK, so the service-account credentials must never be placed in client-side JavaScript. Copy `.env.example` to `.env` for local development, or add these variables to Vercel Project Settings → Environment Variables:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

Deploy `firestore.rules` before using the builder. The rules intentionally deny direct browser access; the Vercel API uses the Admin SDK on the server.

### Private admin dashboard

The owner dashboard is available at `/admin`. It requires the username and password configured in Vercel and uses a signed, `HttpOnly` session cookie. It shows saved creator data, links, page views, Yes clicks, WhatsApp clicks, daily activity, and quick link removal controls. Never put the admin credentials in frontend files or commit them to Git.

![Date6](https://github.com/Ganesh-Sharmaz/Date/assets/151487165/6072ce08-9e9a-4d60-8adc-1eb5e86ac17c)


## How it looks

![Date1](https://github.com/Ganesh-Sharmaz/Date/assets/151487165/4547e047-7f0c-48df-be03-73caa61a07b2)

![Date2](https://github.com/Ganesh-Sharmaz/Date/assets/151487165/bb595cc7-09ac-4591-889c-649a6a87b568)

![Date3](https://github.com/Ganesh-Sharmaz/Date/assets/151487165/b42335c2-eefd-46db-958a-a0deea2550be)


