const {test, expect} = require('@playwright/test');
 
// ------ URL
const url   = 'https://eventhub.rahulshettyacademy.com';
// ------ Credentials
const email =  'email@gmail.com'; 
const password = 'password' ;
 
async function login(page) {
  await page.goto(`${url}/login`);
  await page.getByLabel('Email').fill(email);
  await page.getByPlaceholder('••••••').fill(password);
  await page.locator('#login-btn').click();
  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
  await page.waitForLoadState("networkidle");
  
}
 
// ── Test 1: 1 ticket → eligible ───────────────────────────────────────────────
test('refund eligible check for single ticket booking', async ({ page }) => {
  await login(page);
 
  // Book event with 1 ticket 
  await page.goto(`${url}/events`);
  await page.getByTestId('event-card').first().getByTestId('book-now-btn').click();
 
  // give details
  await page.getByLabel('Full Name').fill('User1');
  await page.locator('#customer-email').fill(email);
  await page.getByPlaceholder('+91 98765 43210').fill('1234567890');
  await page.locator('.confirm-booking-btn').click();
 
  // Navigate to booking detail
  await page.getByRole('link', { name: 'View My Bookings' }).click();
  await expect(page).toHaveURL(`${url}/bookings`);
  await page.getByRole('link', { name: 'View Details' }).first().click();
  await expect(page.getByText('Booking Information')).toBeVisible();
 
  // Validate booking ref first letter matches event name first letter
  const bookingRef = await page.locator('span.font-mono.font-bold').innerText();
  const eventTitle = await page.locator('h1').innerText();
  expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));
  await page.locator('#check-refund-btn').click();
 
  // Spinner must appear immediately and disappear after 6s
  await expect(page.locator('#refund-spinner')).toBeVisible({ timeout: 2000 });
  await expect(page.locator('#refund-spinner')).not.toBeVisible({ timeout: 6000 });
 
  // Validate eligible message
  const result = page.locator('#refund-result');
  await expect(result).toBeVisible();
  await expect(result).toContainText('Eligible for refund');
  await expect(result).toContainText('Single-ticket bookings qualify for a full refund');
});
 


// ── Test 2: 3 tickets → not eligible ─────────────────────────────────────────
test('refund not eligible for group ticket booking', async ({ page }) => {
  await login(page);
 
  // Book event with 3 tickets 
  await page.goto(`${url}/events`);
  await page.getByTestId('event-card').first().getByTestId('book-now-btn').click();
 
  // Increase quantity to 3
  await page.locator('button:has-text("+")').click();
  await page.locator('button:has-text("+")').click();
 
  await page.getByLabel('Full Name').fill('User2');
  await page.locator('#customer-email').fill(email);
  await page.getByPlaceholder('+91 98765 43210').fill('1234567899');
  await page.locator('.confirm-booking-btn').click();
 
  // Navigate to booking detail
  await page.getByRole('link', { name: 'View My Bookings' }).click();
  await expect(page).toHaveURL(`${url}/bookings`);
  await page.getByRole('link', { name: 'View Details' }).first().click();
  await expect(page.getByText('Booking Information')).toBeVisible();
 
  // Validate booking ref first letter matches event name first letter
  const bookingRef = await page.locator('span.font-mono.font-bold').innerText();
  const eventTitle = await page.locator('h1').innerText();
  expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));
  await page.locator('#check-refund-btn').click();
 
  // Spinner must appear immediately and disappear after 6s
  await expect(page.locator('#refund-spinner')).toBeVisible({ timeout: 2000 });
  await expect(page.locator('#refund-spinner')).not.toBeVisible({ timeout: 6000 });
 
  // Validate ineligible message
  const result = page.locator('#refund-result');
  await expect(result).toBeVisible();
  await expect(result).toContainText('Not eligible for refund');
  await expect(result).toContainText('Group bookings (3 tickets) are non-refundable');
});
 