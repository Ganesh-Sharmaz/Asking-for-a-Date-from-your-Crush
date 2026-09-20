# Asking for a Date with a crush using an automated message sent on WhatsApp 💘

This is a repo for making a Website using HTML, CSS, and JavaScript that allows users to ask their crush for a Date! and a custom message is sent to your crush automatically using JavaScript.

# Disclaimer ⚠️
We cannot guarantee that this landing page will result in a successful date or relationship. Use at your own risk (but hey, at least you tried, right?).

## Installation

Clone or download this repository and open `index.html` in your browser.

## Configurations to the code

Open `index.html` in VS Code and enter your own number in the code. Otherwise, the message may be sent to the maintainer's number.

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

Deploy `firestore.rules` before using the builder. The rules intentionally deny direct browser access; the Vercel API uses the Admin SDK on the server.

![Date6](https://github.com/Ganesh-Sharmaz/Date/assets/151487165/6072ce08-9e9a-4d60-8adc-1eb5e86ac17c)


## How it looks

![Date1](https://github.com/Ganesh-Sharmaz/Date/assets/151487165/4547e047-7f0c-48df-be03-73caa61a07b2)

![Date2](https://github.com/Ganesh-Sharmaz/Date/assets/151487165/bb595cc7-09ac-4591-889c-649a6a87b568)

![Date3](https://github.com/Ganesh-Sharmaz/Date/assets/151487165/b42335c2-eefd-46db-958a-a0deea2550be)


