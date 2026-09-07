# ZARQAURA static storefront

Open `index.html` locally or upload all files to GitHub Pages / Netlify / any static host.

## WhatsApp checkout
Orders are sent to `+91 76203 06562`. Update `ZQ.whatsapp` in `assets/app.js` if the number changes.

## Payment details
No public UPI ID or payment QR was present on zarqaura.com when this site was built. Add your UPI ID to `ZQ.upiId` in `assets/app.js` when ready. The payment screenshot button already works with mobile Web Share where supported and falls back to opening WhatsApp.

## Products
Current public products from the Shopify site are defined in `ZQ.products` in `assets/app.js`. Add new product objects there.

## Branding
The palette uses #64413A, #FFF7EC and #2F5D62. The page requests the live `https://zarqaura.com/favicon.ico` first and includes a local fallback icon.
