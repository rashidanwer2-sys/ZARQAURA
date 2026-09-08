/* =========================================================
   ZARQAURA
   GLOBAL WEBSITE LOGIC
========================================================= */

(function () {

    const config = window.SITE_CONFIG;


    /* =====================================================
       CART
    ===================================================== */

    function getCart() {

        return JSON.parse(
            localStorage.getItem("zarqauraCart") || "[]"
        );

    }


    function saveCart(items) {

        localStorage.setItem(
            "zarqauraCart",
            JSON.stringify(items)
        );

        updateCartCount();

    }


    function updateCartCount() {

        const count = getCart().reduce(
            (total, item) =>
                total + item.qty,
            0
        );


        document
            .querySelectorAll(
                "[data-cart-count]"
            )
            .forEach(
                element => {

                    element.textContent =
                        count;

                }
            );

    }



    /* =====================================================
       PRODUCT IMAGE SYSTEM
    ===================================================== */

    function getProductImages(product) {

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

        return getProductImages(product)[0];

    }


    function productImageMarkup(product) {

        const mainImage =
            getMainProductImage(product);


        return `
            <img
                src="${mainImage}"
                alt="${product.name}"
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

                    <strong>
                        ${product.id}
                    </strong>

                    <small>
                        Product image unavailable
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
            config.currencySymbol +
            Number(value).toLocaleString(
                "en-IN"
            )
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
            window.PRODUCTS.find(
                item =>
                    item.id === productId
            );


        if (
            !product ||
            !product.active ||
            product.stock <= 0
        ) {

            return;

        }


        const cart =
            getCart();


        const existing =
            cart.find(
                item =>
                    item.id === productId
            );


        if (existing) {

            existing.qty =
                Math.min(
                    existing.qty + quantity,
                    product.stock
                );

        }

        else {

            cart.push({

                id:
                    productId,

                qty:
                    Math.min(
                        quantity,
                        product.stock
                    )

            });

        }


        saveCart(cart);

    }



    /* =====================================================
       PRODUCT CARD
    ===================================================== */

    function productCard(product) {

        const badges = [];


        if (product.newArrival) {

            badges.push(
                `<span class="badge">
                    New Arrival
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


        if (product.stock <= 0) {

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
                    href="product.html?id=${product.id}"
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


                    <h3>

                        <a
                            href="product.html?id=${product.id}"
                        >

                            ${product.name}

                        </a>

                    </h3>


                    <div
                        class="price"
                    >

                        ${money(product.price)}

                    </div>


                    <div
                        class="actions"
                    >

                        <a
                            href="product.html?id=${product.id}"
                            class="btn secondary"
                        >

                            View

                        </a>


                        <button
                            class="btn"
                            data-add="${product.id}"

                            ${
                                product.stock <= 0
                                    ? "disabled"
                                    : ""
                            }
                        >

                            ${
                                product.stock <= 0
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
       HEADER + FOOTER
    ===================================================== */

    function renderShell() {

        const header =
            document.querySelector(
                "[data-site-header]"
            );


        if (header) {

            header.innerHTML = `

                <div
                    class="announcement"
                >

                    ${config.announcement}

                </div>


                <header
                    class="header"
                >

                    <div
                        class="container header-inner"
                    >

                        <a
                            href="index.html"
                            class="logo"
                        >

                            ZARQAURA

                        </a>


                        <button
                            class="mobile-toggle"
                            aria-label="Open navigation menu"
                        >

                            ☰

                        </button>


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
                                (
                                <span
                                    data-cart-count
                                >
                                    0
                                </span>
                                )

                            </a>

                        </nav>

                    </div>

                </header>

            `;


            const toggle =
                header.querySelector(
                    ".mobile-toggle"
                );


            const nav =
                header.querySelector(
                    ".nav"
                );


            if (
                toggle &&
                nav
            ) {

                toggle.addEventListener(
                    "click",
                    () => {

                        nav.classList.toggle(
                            "open"
                        );

                    }
                );

            }

        }



        const footer =
            document.querySelector(
                "[data-site-footer]"
            );


        if (footer) {

            footer.innerHTML = `

                <footer
                    class="footer"
                >

                    <div
                        class="container footer-grid"
                    >


                        <div>

                            <h3>
                                ZARQAURA
                            </h3>

                            <p>
                                Anti-tarnish jewellery
                                designed for everyday
                                elegance.
                            </p>

                            <p>
                                Jewellery for a brighter you.
                            </p>

                        </div>



                        <div>

                            <h3>
                                Shop
                            </h3>

                            <a
                                href="shop.html"
                            >
                                All Products
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



                        <div>

                            <h3>
                                Help
                            </h3>

                            <a
                                href="contact.html"
                            >
                                Contact
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

                        </div>



                        <div>

                            <h3>
                                Delivery
                            </h3>

                            <p>
                                ${config.shippingText}
                            </p>

                            <p>
                                ${config.deliveryText}
                            </p>

                            <p>
                                ${config.dispatchText}
                            </p>

                        </div>


                    </div>

                </footer>

            `;

        }

    }



    /* =====================================================
       GLOBAL ADD TO CART CLICK
    ===================================================== */

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-add]"
                );


            if (!button) {

                return;

            }


            const productId =
                button.dataset.add;


            addToCart(
                productId
            );


            const originalText =
                button.textContent;


            button.textContent =
                "Added ✓";


            setTimeout(
                () => {

                    button.textContent =
                        originalText;

                },
                900
            );

        }
    );



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

        updateCartCount:
            updateCartCount

    };



    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            renderShell();

            updateCartCount();

        }
    );


})();