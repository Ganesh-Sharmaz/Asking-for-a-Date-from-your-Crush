# Security Policy

## Supported versions

This project is a small static website. Security fixes are applied to the latest version on the `main` branch. Older commits and forks are not actively supported.

## Reporting a vulnerability

Please do not report security vulnerabilities in a public issue, pull request, or discussion. Use GitHub's private vulnerability reporting feature, if enabled for this repository, or contact the repository maintainer privately through the contact method listed on the maintainer's GitHub profile.

Include:

- A clear description of the vulnerability and its potential impact
- The affected file, URL, commit, or browser/version
- Reproduction steps or a minimal proof of concept
- Any suggested mitigation, if available

Please allow reasonable time for investigation and a fix before publicly disclosing the issue. Do not include real phone numbers, personal data, credentials, or other sensitive information in a report.

## Scope

Reports about third-party assets, external services, browsers, or GitHub should also be reported to their respective maintainers. This project does not guarantee the behavior, availability, or security of external URLs embedded in the page.

## Admin dashboard

The private dashboard at `/admin` is protected by `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` environment variables. Keep these values only in Vercel Environment Variables or a local untracked `.env` file. Rotate them immediately if they are exposed.
