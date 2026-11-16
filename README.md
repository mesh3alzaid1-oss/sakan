# Sakan · سكن

Demo property app for owners and tenants in Oman, by CUE.

- **Owner:** buildings, units, tenants, rent and maintenance.
- **Marketplace** (`#market`, `#t-market`): owners post ads with photos, price, features and a WhatsApp number; renters search, filter, save ads and request viewings, which the owner sees under إعلاناتي. Adding a tenant to a unit marks its ad as rented.
- **Alerts:** the tenant's rent box turns red while unpaid; the owner's collected box turns red below a threshold set in Settings (default 90%).
- **Tenant portal** (`#t-home`): rent status, card payment (demo), bank-transfer receipt upload, maintenance requests with photos, and a receipt history.

Brand: the ن mark, black and lime, Noto Kufi Arabic.

Live site: https://mesh3alzaid1-oss.github.io/sakan/ · phone preview: /preview.html

All names and amounts are sample data. Changes are saved only in the viewer's browser.

## Demo features (sample data, saved in the browser)
- **Marketplace:** map view, viewing calendar with time slots, accept an inquiry as a tenant (creates the tenant and contract), saved searches with alerts, verified badges, owner ratings and reviews, fair-price hint, featured ads.
- **Owner:** e-sign contracts with renewals and 60-day expiry alerts, finance page (expenses, profit per building, 12-month collection trend), printable monthly report, technician assignment with WhatsApp message, building announcements, payment reminders with auto-reminder schedule, notifications.
- **Tenant:** pay several months ahead, rental record certificate, contract signing on the phone, building announcements, rate finished repairs, notifications.
- Map library: Leaflet 1.9.4 (BSD-2, in `vendor/leaflet`), tiles from CARTO / OpenStreetMap.
- **English:** the English / عربي button switches the whole app, including sample data, to English with a left-to-right layout (`i18n.js`). The choice is remembered in the browser.
