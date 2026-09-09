/* =========================================================
   ZARQAURA
   GLOBAL WEBSITE LOGIC
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIG
    ===================================================== */

    const config = window.SITE_CONFIG || {};


    const SETTINGS = {

        businessName:
            config.businessName || "ZARQAURA",

        whatsappNumber:
            config.whatsappNumber || "",

        currencySymbol:
            config.currencySymbol || "₹",

        announcement:
            config.announcement ||
            "Anti-Tarnish Jewellery • Free Shipping Across India",

        shippingText:
            config.shippingText ||
            "Free Shipping Across India",

        deliveryText:
            config.deliveryText ||
            "3–7 Business Days",

        dispatchText:
            config.dispatchText ||
            "Dispatch within 24–48 hours",

        instagram:
            config.instagram || "#"

    };


    /* =====================================================
       CART
    ===================================================== */

    function getCart() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "zarqauraCart"
                ) || "[]"
            );

        }

        catch {

            return [];

        }

    }


    function saveCart(items) {

        localStorage.setItem(
            "zarqauraCart",
            JSON.stringify(items)
        );

        updateCartCount();

    }


    function updateCartCount() {

        const totalQuantity =
            getCart().reduce(
                (total, item) =>
                    total +
                    Number(item.qty || 0),
                0
            );


        document
            .querySelectorAll(
                "[data-cart-count]"
            )
            .forEach(
                element => {

                    element.textContent =
                        totalQuantity;

                }
            );

    }


    /* =====================================================
       PRODUCT IMAGES

       Example:

       assets/images/products/rings/RG0001/
       1.jpg
       2.jpg
       3.jpg
       4.jpg
    ===================================================== */

    function getProductImages(product) {

        if (!product) {

            return [];

        }


        const basePath =
            `assets/images/products/${product.category}/${product.id}`;


        return [

            `${basePath}/1.jpg`,
            `${basePath}/2.jpg`,
            `${basePath}/3.jpg`,
            `${basePath}/4.jpg`

        ];

    }


    function getMainProductImage(product) {

        return getProductImages(product)[0] || "";

    }


    function productImageMarkup(product) {

        const image =
            getMainProductImage(product);


        return `

            <img
                src="${image}"
                alt="${escapeHTML(product.name)}"
                loading="lazy"

                onerror="
                    this.style.display='none';
                    this.nextElementSibling.style.display='flex';
                "
            >

            <div
                class="product-image-fallback"
                style="display:none;"
            >

                <div>

                    <span>
                        ✦
                    </span>

                    <strong>
                        ${escapeHTML(product.id)}
                    </strong>

                    <small>
                        Image coming soon
                    </small>

                </div>

            </div>

        `;

    }


    /* =====================================================
       CURRENCY
    ===================================================== */

    function money(value) {

        return (
            SETTINGS.currencySymbol +
            Number(value || 0)
                .toLocaleString("en-IN")
        );

    }


    /* =====================================================
       PRODUCTS
    ===================================================== */

    function findProduct(productId) {

        if (!window.PRODUCTS) {

            return null;

        }


        return (
            window.PRODUCTS.find(
                product =>
                    product.id === productId
            ) || null
        );

    }


    function formatCategory(value) {

        if (!value) {

            return "";

        }


        return value
            .replace(/-/g, " ")
            .replace(
                /\b\w/g,
                character =>
                    character.toUpperCase()
            );

    }


    /* =====================================================
       ADD TO CART
    ===================================================== */

    function addToCart(
        productId,
        quantity = 1
    ) {

        const product =
            findProduct(productId);


        if (
            !product ||
            !product.active ||
            Number(product.stock) <= 0
        ) {

            return false;

        }


        const cart =
            getCart();


        const existing =
            cart.find(
                item =>
                    item.id === productId
            );


        const requestedQuantity =
            Math.max(
                1,
                Number(quantity || 1)
            );


        if (existing) {

            existing.qty =
                Math.min(
                    Number(existing.qty) +
                    requestedQuantity,

                    Number(product.stock)
                );

        }

        else {

            cart.push({

                id:
                    productId,

                qty:
                    Math.min(
                        requestedQuantity,
                        Number(product.stock)
                    )

            });

        }


        saveCart(cart);

        return true;

    }


    /* =====================================================
       PRODUCT CARD
    ===================================================== */

    function productCard(product) {

        if (!product) {

            return "";

        }


        const badges = [];


        if (product.newArrival) {

            badges.push(
                `<span class="badge">
                    New
                </span>`
            );

        }


        if (product.bestseller) {

            badges.push(
                `<span class="badge">
                    Bestseller
                </span>`
            );

        }


        if (
            Number(product.stock) <= 0
        ) {

            badges.push(
                `<span class="badge out">
                    Out of Stock
                </span>`
            );

        }


        return `

            <article
                class="product-card"
            >

                <a
                    href="product.html?id=${encodeURIComponent(product.id)}"
                    class="product-card-image-link"
                >

                    <div
                        class="product-image"
                    >

                        ${productImageMarkup(product)}

                    </div>

                </a>


                <div
                    class="product-body"
                >

                    <div
                        class="badges"
                    >

                        ${badges.join("")}

                    </div>


                    <p
                        class="product-card-category"
                    >

                        ${escapeHTML(
                            formatCategory(
                                product.category
                            )
                        )}

                    </p>


                    <h3>

                        <a
                            href="product.html?id=${encodeURIComponent(product.id)}"
                        >

                            ${escapeHTML(
                                product.name
                            )}

                        </a>

                    </h3>


                    <div
                        class="price"
                    >

                        ${money(
                            product.price
                        )}

                    </div>


                    <div
                        class="actions product-card-actions"
                    >

                        <a
                            href="product.html?id=${encodeURIComponent(product.id)}"
                            class="btn secondary"
                        >

                            View

                        </a>


                        <button
                            type="button"
                            class="btn"
                            data-add="${escapeHTML(product.id)}"

                            ${
                                Number(product.stock) <= 0
                                    ? "disabled"
                                    : ""
                            }
                        >

                            ${
                                Number(product.stock) <= 0
                                    ? "Out of Stock"
                                    : "Add to Cart"
                            }

                        </button>

                    </div>

                </div>

            </article>

        `;

    }


    /* =====================================================
       HEADER
    ===================================================== */

    function renderHeader() {

        const target =
            document.querySelector(
                "[data-site-header]"
            );


        if (!target) {

            return;

        }


        target.innerHTML = `

            <div
                class="announcement"
            >

                ${escapeHTML(
                    SETTINGS.announcement
                )}

            </div>


            <header
                class="header"
            >

                <div
                    class="container header-inner"
                >


                    <!-- LOGO -->

                    <a
                        href="index.html"
                        class="logo"
                        aria-label="ZARQAURA Home"
                    >

                        <img
                            src="assets/images/branding/logo.png"
                            alt="ZARQAURA"
                            class="site-logo"

                            onerror="
                                this.style.display='none';
                                this.nextElementSibling.style.display='inline';
                            "
                        >

                        <span
                            class="logo-text-fallback"
                        >
                            ZARQAURA
                        </span>

                    </a>


                    <!-- MOBILE MENU -->

                    <button
                        type="button"
                        class="mobile-toggle"
                        aria-label="Open menu"
                        aria-expanded="false"
                    >

                        <span></span>
                        <span></span>
                        <span></span>

                    </button>


                    <!-- NAVIGATION -->

                    <nav
                        class="nav"
                    >

                        <a
                            href="index.html"
                        >
                            Home
                        </a>


                        <a
                            href="shop.html"
                        >
                            Shop
                        </a>


                        <a
                            href="collections.html"
                        >
                            Collection
                        </a>


                        <a
                            href="about.html"
                        >
                            About
                        </a>


                        <a
                            href="cart.html"
                            class="cart-link"
                        >

                            Cart

                            <span
                                class="cart-count"
                                data-cart-count
                            >
                                0
                            </span>

                        </a>

                    </nav>

                </div>

            </header>

        `;


        setupMobileNavigation(
            target
        );


        setActiveNavigation(
            target
        );

    }


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    function setupMobileNavigation(
        header
    ) {

        const toggle =
            header.querySelector(
                ".mobile-toggle"
            );


        const nav =
            header.querySelector(
                ".nav"
            );


        if (
            !toggle ||
            !nav
        ) {

            return;

        }


        toggle.addEventListener(
            "click",
            () => {

                const open =
                    nav.classList.toggle(
                        "open"
                    );


                toggle.classList.toggle(
                    "open",
                    open
                );


                toggle.setAttribute(
                    "aria-expanded",
                    String(open)
                );

            }
        );


        nav.addEventListener(
            "click",
            event => {

                if (
                    !event.target.closest(
                        "a"
                    )
                ) {

                    return;

                }


                nav.classList.remove(
                    "open"
                );


                toggle.classList.remove(
                    "open"
                );


                toggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }
        );

    }


    /* =====================================================
   ACTIVE NAVIGATION
===================================================== */

function setActiveNavigation(header) {

    let currentPage =
        window.location.pathname
            .split("/")
            .pop();


    /* GitHub Pages / root homepage */

    if (
        !currentPage ||
        currentPage === ""
    ) {

        currentPage =
            "index.html";

    }


    header
        .querySelectorAll(
            ".nav a"
        )
        .forEach(
            link => {

                const href =
                    link
                        .getAttribute(
                            "href"
                        )
                        .split("?")[0]
                        .split("#")[0];


                link.classList.remove(
                    "active"
                );


                if (
                    href === currentPage
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            }
        );

}


    /* =====================================================
       FOOTER
    ===================================================== */

    function renderFooter() {

        const target =
            document.querySelector(
                "[data-site-footer]"
            );


        if (!target) {

            return;

        }


        target.innerHTML = `

            <footer
                class="footer"
            >

                <div
                    class="container footer-grid"
                >


                    <!-- BRAND -->

                    <div
                        class="footer-brand"
                    >

                        <img
                            src="assets/images/branding/logo.png"
                            alt="ZARQAURA"
                            class="footer-logo"
                        >


                        <p
                            class="footer-brand-message"
                        >

                            Anti-tarnish jewellery
                            for everyday elegance.

                        </p>


                        <p>

                            ZARQAURA is made for women
                            who love to express their
                            aura with confidence.

                        </p>


                        <a
                            href="${SETTINGS.instagram}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="footer-social"
                        >

                            Instagram →

                        </a>

                    </div>


                    <!-- SHOP -->

                    <div>

                        <h3>
                            Shop
                        </h3>

                        <a
                            href="shop.html"
                        >
                            Shop All
                        </a>

                        <a
                            href="shop.html?category=bracelets"
                        >
                            Bracelets
                        </a>

                        <a
                            href="shop.html?category=chains"
                        >
                            Chains
                        </a>

                        <a
                            href="shop.html?category=rings"
                        >
                            Rings
                        </a>

                        <a
                            href="shop.html?category=earrings"
                        >
                            Earrings
                        </a>

                        <a
                            href="shop.html?category=mangalsutras"
                        >
                            Mangalsutras
                        </a>

                    </div>


                    <!-- CUSTOMER CARE -->

                    <div>

                        <h3>
                            Customer Care
                        </h3>

                        <a
                            href="contact.html"
                        >
                            Contact Us
                        </a>

                        <a
                            href="refund.html"
                        >
                            Refund Policy
                        </a>

                        <a
                            href="privacy.html"
                        >
                            Privacy Policy
                        </a>

                        <a
                            href="cart.html"
                        >
                            Your Cart
                        </a>

                    </div>


                    <!-- DELIVERY -->

                    <div>

                        <h3>
                            Delivery
                        </h3>

                        <p>
                            ${escapeHTML(
                                SETTINGS.shippingText
                            )}
                        </p>

                        <p>
                            ${escapeHTML(
                                SETTINGS.dispatchText
                            )}
                        </p>

                        <p>
                            ${escapeHTML(
                                SETTINGS.deliveryText
                            )}
                        </p>

                    </div>


                </div>


                <div
                    class="container footer-bottom"
                >

                    <span>

                        ©
                        ${new Date().getFullYear()}
                        ZARQAURA

                    </span>

                    <span>

                        Made with love in India ♡

                    </span>

                </div>

            </footer>

        `;

    }


    /* =====================================================
       GLOBAL ADD TO CART
    ===================================================== */

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-add]"
                );


            if (
                !button ||
                button.disabled
            ) {

                return;

            }


            const added =
                addToCart(
                    button.dataset.add
                );


            if (!added) {

                return;

            }


            const originalText =
                button.textContent;


            button.classList.add(
                "added"
            );


            button.textContent =
                "Added ✓";


            setTimeout(
                () => {

                    button.textContent =
                        originalText;


                    button.classList.remove(
                        "added"
                    );

                },

                1000
            );

        }
    );


    /* =====================================================
       SECURITY / ESCAPE
    ===================================================== */

    function escapeHTML(value) {

        return String(
            value ?? ""
        )

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* =====================================================
       PUBLIC FUNCTIONS
    ===================================================== */

    window.ZARQAURA = {

        cart:
            getCart,

        saveCart:
            saveCart,

        addToCart:
            addToCart,

        money:
            money,

        getProductImages:
            getProductImages,

        getMainProductImage:
            getMainProductImage,

        imageMarkup:
            productImageMarkup,

        productCard:
            productCard,

        findProduct:
            findProduct,

        formatCategory:
            formatCategory,

        updateCartCount:
            updateCartCount

    };


    /* =====================================================
       INITIALIZE
    ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            renderHeader();

            renderFooter();

            updateCartCount();

        }
    );


})();