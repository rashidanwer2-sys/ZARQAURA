/* =========================================================
   ZARQAURA
   CHECKOUT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =====================================================
           ELEMENTS
        ====================================================== */

        const checkoutContent =
            document.querySelector(
                "[data-checkout-content]"
            );


        const emptyState =
            document.querySelector(
                "[data-checkout-empty]"
            );


        const productsElement =
            document.querySelector(
                "[data-checkout-products]"
            );


        const subtotalElement =
            document.querySelector(
                "[data-checkout-subtotal]"
            );


        const totalElement =
            document.querySelector(
                "[data-checkout-total]"
            );


        const form =
            document.getElementById(
                "checkout-form"
            );


        const confirmation =
            document.querySelector(
                "[data-order-confirmation]"
            );


        const orderIdElement =
            document.querySelector(
                "[data-order-id]"
            );


        const orderReviewElement =
            document.querySelector(
                "[data-order-review]"
            );


        const whatsappButton =
            document.querySelector(
                "[data-order-whatsapp]"
            );


        const paymentInstruction =
            document.querySelector(
                "[data-payment-instruction]"
            );


        const paymentUPI =
            document.querySelector(
                "[data-payment-upi]"
            );


        const snapshotInput =
            document.getElementById(
                "payment-snapshot"
            );


        const selectSnapshotButton =
            document.querySelector(
                "[data-select-snapshot]"
            );


        const shareSnapshotButton =
            document.querySelector(
                "[data-share-snapshot]"
            );


        const snapshotStatus =
            document.querySelector(
                "[data-snapshot-status]"
            );



        let currentOrder = null;



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
                Number(
                    value || 0
                ).toLocaleString(
                    "en-IN"
                )
            );

        }



        function findProduct(productId) {

            if (
                window.ZARQAURA &&
                typeof ZARQAURA.findProduct ===
                "function"
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
                typeof ZARQAURA
                    .getMainProductImage ===
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
                        "Unable to read cart.",
                        error
                    );

                }

            }


            return [];

        }



        function getItemId(item) {

            return (
                item.id ||
                item.productId ||
                item.sku ||
                ""
            );

        }



        function getItemQuantity(item) {

            return Math.max(
                1,
                Number(
                    item.quantity ??
                    item.qty ??
                    1
                )
            );

        }



        /* =====================================================
           VALID CART
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
           TOTALS
        ====================================================== */

        function calculateCart(
            cart
        ) {

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


                    subtotal +=
                        Number(
                            product.price || 0
                        )
                        *
                        getItemQuantity(
                            item
                        );

                }
            );


            return {

                subtotal,
                shipping: 0,
                total: subtotal

            };

        }



        /* =====================================================
           SUMMARY PRODUCT
        ====================================================== */

        function productMarkup(
            item
        ) {

            const product =
                findProduct(
                    getItemId(
                        item
                    )
                );


            if (!product) {

                return "";

            }


            const quantity =
                getItemQuantity(
                    item
                );


            return `

                <div class="checkout-product">

                    <div class="checkout-product-image">

                        <img
                            src="${getProductImage(product)}"
                            alt="${escapeHTML(product.name)}"
                        >

                        <span>
                            ${quantity}
                        </span>

                    </div>


                    <div class="checkout-product-info">

                        <strong>
                            ${escapeHTML(product.name)}
                        </strong>

                        <small>
                            ${escapeHTML(product.id)}
                        </small>

                    </div>


                    <span class="checkout-product-price">

                        ${money(
                            Number(product.price)
                            *
                            quantity
                        )}

                    </span>

                </div>

            `;

        }



        /* =====================================================
           RENDER
        ====================================================== */

        function renderCheckout() {

            const cart =
                getValidCart();


            if (
                !cart.length
            ) {

                checkoutContent.style.display =
                    "none";


                emptyState
                    .classList
                    .add(
                        "show"
                    );


                return;

            }


            emptyState
                .classList
                .remove(
                    "show"
                );


            checkoutContent.style.display =
                "grid";


            productsElement.innerHTML =
                cart
                    .map(
                        productMarkup
                    )
                    .join("");


            const totals =
                calculateCart(
                    cart
                );


            subtotalElement.textContent =
                money(
                    totals.subtotal
                );


            totalElement.textContent =
                money(
                    totals.total
                );

        }



        /* =====================================================
           ORDER ID
        ====================================================== */

        function createOrderId() {

            const now =
                new Date();


            const date =
                String(
                    now.getFullYear()
                ).slice(-2)
                +
                String(
                    now.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                )
                +
                String(
                    now.getDate()
                ).padStart(
                    2,
                    "0"
                );


            const time =
                String(
                    now.getHours()
                ).padStart(
                    2,
                    "0"
                )
                +
                String(
                    now.getMinutes()
                ).padStart(
                    2,
                    "0"
                );


            const random =
                Math.floor(
                    100 +
                    Math.random() *
                    900
                );


            return (
                `ZQ${date}${time}${random}`
            );

        }



        /* =====================================================
           BUILD ORDER
        ====================================================== */

        function buildOrder(
            customer
        ) {

            const cart =
                getValidCart();


            const totals =
                calculateCart(
                    cart
                );


            return {

                id:
                    createOrderId(),

                createdAt:
                    new Date()
                        .toISOString(),

                customer,

                cart,

                totals

            };

        }



        /* =====================================================
           ORDER TEXT
        ====================================================== */

        function buildOrderText(
            order
        ) {

            const lines = [];


            lines.push(
                "ZARQAURA ORDER"
            );


            lines.push(
                "--------------------------"
            );


            lines.push(
                `Order ID: ${order.id}`
            );


            lines.push("");


            lines.push(
                "CUSTOMER DETAILS"
            );


            lines.push(
                `Name: ${order.customer.name}`
            );


            lines.push(
                `Phone: ${order.customer.phone}`
            );


            lines.push(
                `Email: ${order.customer.email}`
            );


            lines.push("");


            lines.push(
                "DELIVERY ADDRESS"
            );


            lines.push(
                order.customer.address
            );


            if (
                order.customer.landmark
            ) {

                lines.push(
                    `Landmark: ${order.customer.landmark}`
                );

            }


            lines.push(
                `${order.customer.city}, ${order.customer.state} - ${order.customer.pin}`
            );


            lines.push("");


            lines.push(
                "ORDER ITEMS"
            );


            order.cart.forEach(
                (
                    item,
                    index
                ) => {

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


                    lines.push(
                        `${index + 1}. ${product.name}`
                    );


                    lines.push(
                        `   SKU: ${product.id}`
                    );


                    lines.push(
                        `   Qty: ${quantity}`
                    );


                    lines.push(
                        `   Price: ${money(product.price)}`
                    );


                    lines.push(
                        `   Total: ${money(
                            Number(
                                product.price
                            ) *
                            quantity
                        )}`
                    );

                }
            );


            lines.push("");


            lines.push(
                `Subtotal: ${money(order.totals.subtotal)}`
            );


            lines.push(
                "Shipping: Free"
            );


            lines.push(
                `Order Total: ${money(order.totals.total)}`
            );


            lines.push("");


            lines.push(
                "Please confirm my ZARQAURA order."
            );


            return lines.join(
                "\n"
            );

        }



        /* =====================================================
           FORM
        ====================================================== */

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                if (
                    !form.checkValidity()
                ) {

                    form.reportValidity();

                    return;

                }


                const formData =
                    new FormData(
                        form
                    );


                const customer = {

                    name:
                        String(
                            formData.get(
                                "name"
                            )
                        ).trim(),

                    phone:
                        String(
                            formData.get(
                                "phone"
                            )
                        ).trim(),

                    email:
                        String(
                            formData.get(
                                "email"
                            )
                        ).trim(),

                    address:
                        String(
                            formData.get(
                                "address"
                            )
                        ).trim(),

                    landmark:
                        String(
                            formData.get(
                                "landmark"
                            ) || ""
                        ).trim(),

                    city:
                        String(
                            formData.get(
                                "city"
                            )
                        ).trim(),

                    state:
                        String(
                            formData.get(
                                "state"
                            )
                        ).trim(),

                    pin:
                        String(
                            formData.get(
                                "pin"
                            )
                        ).trim()

                };


                currentOrder =
                    buildOrder(
                        customer
                    );


                const orderText =
                    buildOrderText(
                        currentOrder
                    );


                /*
                   Show exact same order details
                   on the website.
                */

                orderIdElement.textContent =
                    `Order ID: ${currentOrder.id}`;


                orderReviewElement.textContent =
                    orderText;



                /* =========================================
                   WHATSAPP
                ========================================== */

                const whatsappNumber =
                    String(
                        SITE_CONFIG.whatsappNumber ||
                        ""
                    ).replace(
                        /\D/g,
                        ""
                    );


                if (
                    whatsappNumber
                ) {

                    whatsappButton.href =
                        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderText)}`;

                }

                else {

                    whatsappButton.href =
                        "#";

                }



                /* =========================================
                   PAYMENT INSTRUCTION
                ========================================== */

                paymentInstruction.textContent =
                    SITE_CONFIG.paymentInstruction ||
                    "Complete the payment and share the payment snapshot on WhatsApp.";



                /*
                   Only display UPI when you
                   actually configure it.
                */

                if (
                    SITE_CONFIG.upiId
                ) {

                    paymentUPI.innerHTML = `

                        Payment UPI:
                        <strong>
                            ${escapeHTML(
                                SITE_CONFIG.upiId
                            )}
                        </strong>

                    `;


                    paymentUPI
                        .classList
                        .add(
                            "show"
                        );

                }

                else {

                    paymentUPI
                        .classList
                        .remove(
                            "show"
                        );

                }



                /* =========================================
                   SHOW CONFIRMATION
                ========================================== */

                checkoutContent.style.display =
                    "none";


                confirmation
                    .classList
                    .add(
                        "show"
                    );


                confirmation.scrollIntoView(
                    {
                        behavior:
                            "smooth",

                        block:
                            "start"
                    }
                );

            }
        );



        /* =====================================================
           SNAPSHOT SELECT
        ====================================================== */

        selectSnapshotButton
            .addEventListener(
                "click",
                () => {

                    snapshotInput.click();

                }
            );



        snapshotInput
            .addEventListener(
                "change",
                () => {

                    const file =
                        snapshotInput
                            .files?.[0];


                    if (!file) {

                        shareSnapshotButton.disabled =
                            true;


                        snapshotStatus.textContent =
                            "Select your payment screenshot after completing the payment.";


                        return;

                    }


                    shareSnapshotButton.disabled =
                        false;


                    snapshotStatus.textContent =
                        `Selected: ${file.name}`;

                }
            );



        /* =====================================================
           SHARE SNAPSHOT
        ====================================================== */

        shareSnapshotButton
            .addEventListener(
                "click",
                async () => {

                    const file =
                        snapshotInput
                            .files?.[0];


                    if (!file) {

                        return;

                    }


                    const shareText =
                        currentOrder
                            ? `ZARQAURA payment snapshot for Order ${currentOrder.id}`
                            : "ZARQAURA payment snapshot";


                    /*
                       On supported mobile browsers,
                       native share can pass the image
                       to WhatsApp or another app.
                    */

                    if (
                        navigator.share &&
                        navigator.canShare &&
                        navigator.canShare(
                            {
                                files:
                                    [file]
                            }
                        )
                    ) {

                        try {

                            await navigator.share(
                                {

                                    title:
                                        "ZARQAURA Payment",

                                    text:
                                        shareText,

                                    files:
                                        [file]

                                }
                            );


                            snapshotStatus.textContent =
                                "Payment snapshot shared.";

                            return;

                        }

                        catch (error) {

                            if (
                                error.name ===
                                "AbortError"
                            ) {

                                return;

                            }

                        }

                    }


                    /*
                       Desktop/browser fallback:
                       open WhatsApp. User attaches
                       the selected screenshot manually.
                    */

                    const whatsappNumber =
                        String(
                            SITE_CONFIG.whatsappNumber ||
                            ""
                        ).replace(
                            /\D/g,
                            ""
                        );


                    const message =
                        currentOrder
                            ? `Hi ZARQAURA, I am sharing the payment snapshot for Order ID: ${currentOrder.id}.`
                            : "Hi ZARQAURA, I am sharing my payment snapshot.";


                    if (
                        whatsappNumber
                    ) {

                        window.open(
                            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
                            "_blank",
                            "noopener,noreferrer"
                        );

                    }


                    snapshotStatus.textContent =
                        "WhatsApp opened. Please attach the selected payment screenshot in the chat.";

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
           START
        ====================================================== */

        renderCheckout();


    }
);