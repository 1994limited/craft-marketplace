**Collect newsletter subscribers on your own Craft site. Add the form to a template; people who sign up get an email to confirm (double opt-in), and only then join the list. The list is in the control panel, ready to download as a CSV for Mailchimp, Brevo, Campaign Monitor or whatever you send with.**

Newsletter doesn't send newsletters. It keeps a clean, consented list, and hands it over.

## A form in one line

`{{ craft.newsletter.form() }}` gives you an accessible sign-up form that works without JavaScript. Or write your own form and post it to the plugin, with JSON answers for `fetch()`.

## Double opt-in, done properly

Each sign-up is emailed a signed link that lasts 72 hours. The link opens a page with a button, so mail scanners that open links can't confirm anyone by themselves.

## A record of consent

The wording next to the tick box is saved with each sign-up, with when they signed up, when they confirmed and the page the form was on.

## The list in the control panel

Its own section: subscribed, waiting to confirm and unsubscribed, searchable and sortable, with Craft's own bulk delete. Permissions to see and export the list, and to delete subscribers. In templates too, with `craft.newsletter.subscribers()`.

## Download it as a CSV

A Download CSV button (subscribed, waiting, unsubscribed or everyone), and the list in Craft's own Export menu too. Each row carries the subscriber's own unsubscribe link, to merge into the emails you send. It opens cleanly in Excel, and no cell can run as a spreadsheet formula.

## Unsubscribe in one click

Every subscriber has an unsubscribe link that works with mail apps' one-click unsubscribe (the `List-Unsubscribe` header).

## No leaks, little spam

The form says the same thing whether an address is new or already subscribed, so it can't be used to find out who is on your list. A hidden honeypot field, a limit on sign-ups per visitor and a limit on confirmation emails per address. And a captcha if you want one: Cloudflare Turnstile, hCaptcha, Google reCAPTCHA v2 or v3, or your own.

## Tidy

Sign-ups nobody confirmed are deleted after 30 days, when Craft tidies up.

## Make it yours

The confirmation email is a system message (Utilities > System Messages), in each site's language. Copy the form and the confirm and unsubscribe pages into `templates/_newsletter/` to change them; they can extend your own layout. Or send people to pages of your own after they confirm or unsubscribe. Anyone can be told about new subscribers by email.

## Events

Before subscribe (turn a sign-up away), after subscribe, after confirm (send them on to your email platform) and after unsubscribe.

## Requirements

- Craft CMS 5.6 or later
- PHP 8.2 or later
- Craft's email settings working: the confirmation email is sent with them
