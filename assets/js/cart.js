/* =========================================================
   ZARQAURA
   CART PAGE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =====================================================
           ELEMENTS
        ====================================================== */

        const cartItemsElement =
            document.querySelector(
                "[data-cart-items]"
            );


        const cartContentElement =
            document.querySelector(
                "[data-cart-content]"
            );


        const cartEmptyElement =
            document.querySelector(
                "[data-cart-empty]"
            );


        const itemCountElement =
            document.querySelector(
                "[data-cart-item-count]"
            );


        const subtotalElement =
            document.querySelector(
                "[data-cart-subtotal]"
            );


        const totalElement =
            document.querySelector(
                "[data-cart-total]"
            );


        const checkoutButton =
            document.querySelector(
                "[data-checkout-button]"
            );



        /* =====================================================
           HELPERS
        ====================================================== */

        function money(value) {

            if (
                window.ZARQAURA &&
                typeof ZARQAURA.money === "function"
            ) {

                return ZARQAURA.money(
                    value
                );

            }


            return (
                "₹" +
                Number(value || 0)
                    .toLocaleString(
                        "en-IN"
                    )
            );

        }



        function findProduct(productId) {

            if (
                window.ZARQAURA &&
                typeof ZARQAURA.findProduct === "function"
            ) {

                return ZARQAURA.findProduct(
                    productId
                );

            }


            return (
                (window.PRODUCTS || [])
                    .find(
                        product =>
                            product.id ===
                            productId
                    )
            );

        }



        function getProductImage(product) {

            if (
                window.ZARQAURA &&
                typeof ZARQAURA.getMainProductImage ===
                "function"
            ) {

                return (
                    ZARQAURA
                        .getMainProductImage(
                            product
                        )
                );

            }


            return (
                `assets/images/products/` +
                `${product.category}/` +
                `${product.id}/1.jpg`
            );

        }



        function formatCategory(category) {

            if (!category) {

                return "";

            }


            return (
                category
                    .charAt(0)
                    .toUpperCase()
                +
                category
                    .slice(1)
            );

        }



        /* =====================================================
           READ CART
        ====================================================== */

        function readCart() {

            if (
                window.ZARQAURA &&
                typeof ZARQAURA.readCart ===
                "function"
            ) {

                const cart =
                    ZARQAURA.readCart();


                return (
                    Array.isArray(cart)
                        ? cart
                        : []
                );

            }


            /*
               Fallback only if app.js cart functions
               are unavailable.
            */

            const possibleKeys = [

                "zarqaura_cart",
                "zarqauraCart"

            ];


            for (
                const key of possibleKeys
            ) {

                try {

                    const saved =
                        JSON.parse(
                            localStorage.getItem(
                                key
                            )
                        );


                    if (
                        Array.isArray(saved)
                    ) {

                        return saved;

                    }

                }

                catch (error) {

                    console.warn(
                        "Unable to read cart:",
                        error
                    );

                }

            }


            return [];

        }



        /* =====================================================
           SAVE CART
        ====================================================== */

        function saveCart(cart) {

            if (
                window.ZARQAURA &&
                typeof ZARQAURA.saveCart ===
                "function"
            ) {

                ZARQAURA.saveCart(
                    cart
                );

            }

            else {

                localStorage.setItem(
                    "zarqaura_cart",
                    JSON.stringify(
                        cart
                    )
                );

            }


            updateHeaderCartCount(
                cart
            );

        }



        /* =====================================================
           CART ITEM HELPERS
        ====================================================== */

        function getItemId(item) {

            return (

                item.id ||
                item.productId ||
                item.sku ||
                ""

            );

        }



        function getItemQuantity(item) {

            const quantity =
                Number(
                    item.quantity ??
                    item.qty ??
                    1
                );


            return (
                Math.max(
                    1,
                    quantity
                )
            );

        }



        function setItemQuantity(
            item,
            quantity
        ) {

            if (
                Object.prototype
                    .hasOwnProperty
                    .call(
                        item,
                        "qty"
                    )
            ) {

                item.qty =
                    quantity;

            }

            else {

                item.quantity =
                    quantity;

            }

        }



        /* =====================================================
           HEADER CART COUNT
        ====================================================== */

        function updateHeaderCartCount(
            cart
        ) {

            const quantity =
                cart.reduce(
                    (
                        total,
                        item
                    ) => {

                        return (
                            total +
                            getItemQuantity(
                                item
                            )
                        );

                    },
                    0
                );


            document
                .querySelectorAll(
                    ".cart-count"
                )
                .forEach(
                    element => {

                        element.textContent =
                            quantity;

                    }
                );

        }



        /* =====================================================
           NORMALIZED VALID CART
        ====================================================== */

        function getValidCart() {

            return (
                readCart()
                    .filter(
                        item => {

                            const product =
                                findProduct(
                                    getItemId(
                                        item
                                    )
                                );


                            return (
                                product &&
                                product.active !== false
                            );

                        }
                    )
            );

        }



        /* =====================================================
           CALCULATIONS
        ====================================================== */

        function calculateCart(
            cart
        ) {

            let itemQuantity =
                0;


            let subtotal =
                0;


            cart.forEach(
                item => {

                    const product =
                        findProduct(
                            getItemId(
                                item
                            )
                        );


                    if (!product) {

                        return;

                    }


                    const quantity =
                        getItemQuantity(
                            item
                        );


                    itemQuantity +=
                        quantity;


                    subtotal +=
                        Number(
                            product.price || 0
                        )
                        *
                        quantity;

                }
            );


            return {

                itemQuantity,
                subtotal,
                total: subtotal

            };

        }



        /* =====================================================
           PRODUCT ROW
        ====================================================== */

        function cartItemMarkup(
            item
        ) {

            const productId =
                getItemId(
                    item
                );


            const product =
                findProduct(
                    productId
                );


            if (!product) {

                return "";

            }


            const quantity =
                getItemQuantity(
                    item
                );


            const stock =
                Number(
                    product.stock || 0
                );


            const image =
                getProductImage(
                    product
                );


            const lineTotal =
                Number(
                    product.price
                )
                *
                quantity;


            const maximumReached =
                stock > 0 &&
                quantity >= stock;


            return `

                <article
                    class="cart-item"
                    data-cart-item="${product.id}"
                >


                    <!-- IMAGE -->

                    <a
                        href="product.html?id=${encodeURIComponent(product.id)}"
                        class="cart-item-image"
                        aria-label="View ${escapeHTML(product.name)}"
                    >

                        <img
                            src="${image}"
                            alt="${escapeHTML(product.name)}"
                            onerror="
                                this.style.display='none';
                                this.nextElementSibling.style.display='flex';
                            "
                        >

                        <span
                            class="cart-image-fallback"
                        >
                            ${escapeHTML(product.name)}
                        </span>

                    </a>



                    <!-- INFO -->

                    <div class="cart-item-content">

                        <p class="cart-item-category">

                            ${escapeHTML(
                                formatCategory(
                                    product.category
                                )
                            )}

                        </p>


                        <h3 class="cart-item-name">

                            <a
                                href="product.html?id=${encodeURIComponent(product.id)}"
                            >
                                ${escapeHTML(product.name)}
                            </a>

                        </h3>


                        <span class="cart-item-sku">

                            SKU:
                            ${escapeHTML(product.id)}

                        </span>


                        <span class="cart-item-price">

                            ${money(product.price)}

                        </span>

                    </div>



                    <!-- ACTIONS -->

                    <div class="cart-item-actions">


                        <div
                            class="cart-quantity"
                            aria-label="Quantity"
                        >

                            <button
                                type="button"
                                aria-label="Decrease quantity"
                                data-cart-decrease="${product.id}"
                            >
                                −
                            </button>


                            <span>
                                ${quantity}
                            </span>


                            <button
                                type="button"
                                aria-label="Increase quantity"
                                data-cart-increase="${product.id}"
                                ${maximumReached ? "disabled" : ""}
                            >
                                +
                            </button>

                        </div>



                        <span class="cart-line-total">

                            ${money(lineTotal)}

                        </span>



                        <button
                            type="button"
                            class="cart-remove"
                            data-cart-remove="${product.id}"
                        >
                            Remove
                        </button>


                    </div>


                </article>

            `;

        }



        /* =====================================================
           RENDER CART
        ====================================================== */

        function renderCart() {

            const cart =
                getValidCart();


            /*
               Remove invalid products from
               stored cart if required.
            */

            const storedCart =
                readCart();


            if (
                cart.length !==
                storedCart.length
            ) {

                saveCart(
                    cart
                );

            }



            /* EMPTY */

            if (
                !cart.length
            ) {

                cartItemsElement.innerHTML =
                    "";


                cartContentElement.style.display =
                    "none";


                cartEmptyElement
                    .classList
                    .add(
                        "show"
                    );


                itemCountElement.textContent =
                    "0 items";


                subtotalElement.textContent =
                    money(0);


                totalElement.textContent =
                    money(0);


                if (
                    checkoutButton
                ) {

                    checkoutButton
                        .setAttribute(
                            "aria-disabled",
                            "true"
                        );


                    checkoutButton.style.pointerEvents =
                        "none";


                    checkoutButton.style.opacity =
                        "0.5";

                }


                updateHeaderCartCount(
                    cart
                );


                return;

            }



            /* CART HAS PRODUCTS */

            cartEmptyElement
                .classList
                .remove(
                    "show"
                );


            cartContentElement.style.display =
                "grid";


            cartItemsElement.innerHTML =
                cart
                    .map(
                        cartItemMarkup
                    )
                    .join("");



            const totals =
                calculateCart(
                    cart
                );


            itemCountElement.textContent =
                `${totals.itemQuantity} ${
                    totals.itemQuantity === 1
                        ? "item"
                        : "items"
                }`;


            subtotalElement.textContent =
                money(
                    totals.subtotal
                );


            totalElement.textContent =
                money(
                    totals.total
                );


            if (
                checkoutButton
            ) {

                checkoutButton
                    .removeAttribute(
                        "aria-disabled"
                    );


                checkoutButton.style.pointerEvents =
                    "";


                checkoutButton.style.opacity =
                    "";

            }


            updateHeaderCartCount(
                cart
            );

        }



        /* =====================================================
           CHANGE QUANTITY
        ====================================================== */

        function changeQuantity(
            productId,
            change
        ) {

            const cart =
                readCart();


            const item =
                cart.find(
                    cartItem =>
                        getItemId(
                            cartItem
                        ) ===
                        productId
                );


            if (!item) {

                return;

            }


            const product =
                findProduct(
                    productId
                );


            if (!product) {

                return;

            }


            const currentQuantity =
                getItemQuantity(
                    item
                );


            let newQuantity =
                currentQuantity +
                change;


            const stock =
                Number(
                    product.stock || 0
                );


            /*
               Quantity below one removes item.
            */

            if (
                newQuantity <= 0
            ) {

                removeItem(
                    productId
                );

                return;

            }


            /*
               Do not exceed known stock.
            */

            if (
                stock > 0
            ) {

                newQuantity =
                    Math.min(
                        newQuantity,
                        stock
                    );

            }


            setItemQuantity(
                item,
                newQuantity
            );


            saveCart(
                cart
            );


            renderCart();

        }



        /* =====================================================
           REMOVE ITEM
        ====================================================== */

        function removeItem(
            productId
        ) {

            const cart =
                readCart()
                    .filter(
                        item =>
                            getItemId(
                                item
                            ) !==
                            productId
                    );


            saveCart(
                cart
            );


            renderCart();

        }



        /* =====================================================
           EVENTS
        ====================================================== */

        document.addEventListener(
            "click",
            event => {


                /* INCREASE */

                const increaseButton =
                    event.target.closest(
                        "[data-cart-increase]"
                    );


                if (
                    increaseButton
                ) {

                    changeQuantity(
                        increaseButton
                            .dataset
                            .cartIncrease,
                        1
                    );


                    return;

                }



                /* DECREASE */

                const decreaseButton =
                    event.target.closest(
                        "[data-cart-decrease]"
                    );


                if (
                    decreaseButton
                ) {

                    changeQuantity(
                        decreaseButton
                            .dataset
                            .cartDecrease,
                        -1
                    );


                    return;

                }



                /* REMOVE */

                const removeButton =
                    event.target.closest(
                        "[data-cart-remove]"
                    );


                if (
                    removeButton
                ) {

                    removeItem(
                        removeButton
                            .dataset
                            .cartRemove
                    );

                }


            }
        );



        /* =====================================================
           ESCAPE HTML
        ====================================================== */

        function escapeHTML(
            value
        ) {

            return String(
                value ?? ""
            )
                .replaceAll(
                    "&",
                    "&amp;"
                )
                .replaceAll(
                    "<",
                    "&lt;"
                )
                .replaceAll(
                    ">",
                    "&gt;"
                )
                .replaceAll(
                    '"',
                    "&quot;"
                )
                .replaceAll(
                    "'",
                    "&#039;"
                );

        }



        /* =====================================================
           FIRST LOAD
        ====================================================== */

        renderCart();


    }
);