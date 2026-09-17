# Playwright — Event Refund Eligibility Check

Two end-to-end UI tests written with Playwright (JavaScript) against the
[EventHub](https://eventhub.rahulshettyacademy.com) practice application.

What you are testing: Two separate tests — booking with 1 ticket should show "Eligible for refund", a booking with 3 tickets should show "Not eligible for refund".
Both tests verify the spinner appears and disappears before showing the result.

Both tests book an event, open the booking detail page, and check whether the
booking qualifies for a refund.

> Practice application and assignment courtesy of [Rahul Shetty Academy](https://rahulshettyacademy.com).

## What the tests do

**Test 1 — Single ticket is eligible**

1. Logs in with a reusable `login()` helper
2. Books the first event on the Events page with the default quantity of 1 ticket
3. Opens the booking from **My Bookings** and confirms the detail page loads
4. Asserts the first character of the booking reference matches the first character of the event title
5. Clicks **Check Refund Eligibility** and verifies the spinner appears and then disappears
6. Asserts the result says *Eligible for refund* and *Single-ticket bookings qualify for a full refund*

**Test 2 — Group booking is not eligible**

Same flow, except the quantity is increased to 3 tickets before the form is
submitted. The result is expected to say *Not eligible for refund* and
*Group bookings (3 tickets) are non-refundable*.

## Tech

- Playwright Test
- JavaScript
- Chromium

## Locator strategies used

| Strategy | Example |
|---|---|
| Test ID | `getByTestId('event-card')` |
| Label | `getByLabel('Full Name')` |
| Placeholder | `getByPlaceholder('+91 98765 43210')` |
| Role | `getByRole('link', { name: 'View My Bookings' })` |
| ID | `locator('#check-refund-btn')` |
| CSS class | `locator('.confirm-booking-btn')` |
| Text match | `locator('button:has-text("+")')` |

## Timeouts

The spinner assertions use explicit timeouts rather than the project default:

```javascript
await expect(page.locator('#refund-spinner')).toBeVisible({ timeout: 2000 });
await expect(page.locator('#refund-spinner')).not.toBeVisible({ timeout: 6000 });
```

The config sets a 30-second expect timeout, which is too loose here — a spinner
that took 20 seconds to appear would still pass. The tight timeouts make the
assertions mean what the requirement says: *immediately* visible, and gone
*within 6 seconds*.

## Setup

```bash
git clone https://github.com/sushma-tk/<repo-name>.git
cd <repo-name>
npm install
npx playwright install
```

Register an account at https://eventhub.rahulshettyacademy.com, then set your
credentials at the top of the spec file (or move them to a `.env` file):

```javascript
const email = 'your-email@example.com';
const password = 'your-password';
```

## Running

```bash
npx playwright test              # headless
npx playwright test --headed     # watch it run
npx playwright show-report       # open the HTML report
```
