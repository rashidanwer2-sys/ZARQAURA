# ZARQAURA Starter Website

Static HTML/CSS/JS starter designed for GitHub Pages and easy product management.

## Core files
- `assets/data/site-config.js` — business settings
- `assets/data/products.js` — all product data
- `assets/css/styles.css` — design
- `assets/js/app.js` — header/footer/common cart helpers
- `assets/js/shop.js` — dynamic shop/filtering
- `assets/js/product.js` — product details
- `assets/js/cart.js` — cart
- `assets/js/checkout.js` — checkout + WhatsApp order

## Add a new product
1. Add photos to a product folder, e.g. `assets/images/products/bracelets/BR002/`
2. Add one object to `assets/data/products.js`
3. Set `active`, `featured`, `newArrival`, `bestseller`, and `stock` as needed.

## SKU prefixes
- Bracelets: BR
- Chains: CH
- Rings: RG
- Earrings: ER
- Mangalsutras: MG

## Run
Open `index.html` with VS Code Live Server.
