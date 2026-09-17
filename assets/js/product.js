/* =========================================================
   ZARQAURA
   PRODUCT DETAIL PAGE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =====================================================
           ELEMENTS
        ====================================================== */

        const content =
            document.querySelector(
                "[data-product-content]"
            );


        const notFound =
            document.querySelector(
                "[data-product-not-found]"
            );


        const titleElement =
            document.querySelector(
                "[data-product-title]"
            );


        const priceElement =
            document.querySelector(
                "[data-product-price]"
            );


        const descriptionElement =
            document.querySelector(
                "[data-product-description]"
            );


        const skuElement =
            document.querySelector(
                "[data-product-sku]"
            );


        const categoryElement =
            document.querySelector(
                "[data-product-category]"
            );


        const stockElement =
            document.querySelector(
                "[data-product-stock]"
            );


        const badgeElement =
            document.querySelector(
                "[data-product-badges]"
            );


        const breadcrumbCategory =
            document.querySelector(
                "[data-product-breadcrumb-category]"
            );


        const breadcrumbName =
            document.querySelector(
                "[data-product-breadcrumb-name]"
            );


        const mainImage =
            document.querySelector(
                "[data-product-main-image]"
            );


        const imageFallback =
            document.querySelector(
                "[data-product-image-fallback]"
            );


        const thumbnailsElement =
            document.querySelector(
                "[data-product-thumbnails]"
            );


        const counterElement =
            document.querySelector(
                "[data-product-counter]"
            );


        const previousButton =
            document.querySelector(
                "[data-product-prev]"
            );


        const nextButton =
            document.querySelector(
                "[data-product-next]"
            );


        const gallery =
            document.querySelector(
                "[data-product-gallery]"
            );


        const quantityElement =
            document.querySelector(
                "[data-product-quantity]"
            );


        const decreaseButton =
            document.querySelector(
                "[data-product-decrease]"
            );


        const increaseButton =
            document.querySelector(
                "[data-product-increase]"
            );


        const addButton =
            document.querySelector(
                "[data-product-add]"
            );


        const feedbackElement =
            document.querySelector(
                "[data-product-feedback]"
            );


        const relatedElement =
            document.querySelector(
                "[data-product-related]"
            );


        const relatedSection =
            document.querySelector(
                "[data-product-related-section]"
            );


        const relatedLink =
            document.querySelector(
                "[data-product-related-link]"
            );



        /* =====================================================
           STATE
        ====================================================== */

        let product = null;

        let quantity = 1;

        let currentImageIndex = 0;

        let touchStartX = 0;

        let touchEndX = 0;



        /* =====================================================
           URL PRODUCT
        ====================================================== */

        const params =
            new URLSearchParams(
                window.location.search
            );


        const productId =
            params.get("id");



        /* =====================================================
           HELPERS
        ====================================================== */

        function findProduct(id) {

            if (
                window.ZARQAURA &&
                typeof ZARQAURA.findProduct ===
                "function"
            ) {

                return ZARQAURA.findProduct(
                    id
                );

            }


            return (
                (window.PRODUCTS || [])
                    .find(
                        item =>
                            item.id === id
                    )
            );

        }



        function money(value) {

            if (
                window.ZARQAURA &&
                typeof ZARQAURA.money ===
                "function"
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



        function formatCategory(value) {

            if (!value) {

                return "";

            }


            return (
                value
                    .charAt(0)
                    .toUpperCase()
                +
                value
                    .slice(1)
            );

        }



        function productImage(
            item,
            number
        ) {

            return (
                `assets/images/products/` +
                `${item.category}/` +
                `${item.id}/` +
                `${number}.jpg`
            );

        }



        function escapeHTML(value) {

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
           PRODUCT NOT FOUND
        ====================================================== */

        function showNotFound() {

            if (content) {

                content.style.display =
                    "none";

            }


            if (notFound) {

                notFound.classList.add(
                    "show"
                );

            }


            if (relatedSection) {

                relatedSection.style.display =
                    "none";

            }

        }



        /* =====================================================
           IMAGES
        ====================================================== */

        function getImages() {

            return [
                productImage(product, 1),
                productImage(product, 2),
                productImage(product, 3),
                productImage(product, 4)
            ];

        }



        function renderThumbnails() {

            const images =
                getImages();


            thumbnailsElement.innerHTML =
                images
                    .map(
                        (
                            image,
                            index
                        ) => `

                            <button
                                type="button"
                                class="
                                    product-thumbnail
                                    ${index === 0 ? "active" : ""}
                                "
                                data-product-thumbnail="${index}"
                                aria-label="View image ${index + 1}"
                            >

                                <img
                                    src="${image}"
                                    alt="${escapeHTML(product.name)} image ${index + 1}"
                                >

                            </button>

                        `
                    )
                    .join("");

        }



        function showImage(index) {

            const images =
                getImages();


            if (
                index < 0
            ) {

                index =
                    images.length - 1;

            }


            if (
                index >=
                images.length
            ) {

                index = 0;

            }


            currentImageIndex =
                index;


            mainImage.style.display =
                "block";


            imageFallback.style.display =
                "none";


            mainImage.src =
                images[index];


            mainImage.alt =
                `${product.name} image ${index + 1}`;


            counterElement.textContent =
                `${index + 1} / ${images.length}`;


            document
                .querySelectorAll(
                    "[data-product-thumbnail]"
                )
                .forEach(
                    thumbnail => {

                        thumbnail
                            .classList
                            .toggle(
                                "active",
                                Number(
                                    thumbnail
                                        .dataset
                                        .productThumbnail
                                ) === index
                            );

                    }
                );

        }



        /* =====================================================
           MAIN IMAGE ERROR
        ====================================================== */

        mainImage.addEventListener(
            "error",
            () => {

                mainImage.style.display =
                    "none";


                imageFallback.style.display =
                    "flex";


                imageFallback.textContent =
                    product
                        ? product.name
                        : "ZARQAURA Jewellery";

            }
        );



        /* =====================================================
           GALLERY EVENTS
        ====================================================== */

        previousButton.addEventListener(
            "click",
            () => {

                showImage(
                    currentImageIndex - 1
                );

            }
        );


        nextButton.addEventListener(
            "click",
            () => {

                showImage(
                    currentImageIndex + 1
                );

            }
        );



        thumbnailsElement.addEventListener(
            "click",
            event => {

                const thumbnail =
                    event.target.closest(
                        "[data-product-thumbnail]"
                    );


                if (!thumbnail) {

                    return;

                }


                showImage(
                    Number(
                        thumbnail
                            .dataset
                            .productThumbnail
                    )
                );

            }
        );



        /* =====================================================
           SWIPE
        ====================================================== */

        gallery.addEventListener(
            "touchstart",
            event => {

                touchStartX =
                    event.changedTouches[0]
                        .screenX;

            },
            {
                passive: true
            }
        );


        gallery.addEventListener(
            "touchend",
            event => {

                touchEndX =
                    event.changedTouches[0]
                        .screenX;


                const difference =
                    touchStartX -
                    touchEndX;


                if (
                    Math.abs(difference) <
                    45
                ) {

                    return;

                }


                if (
                    difference > 0
                ) {

                    showImage(
                        currentImageIndex + 1
                    );

                }

                else {

                    showImage(
                        currentImageIndex - 1
                    );

                }

            },
            {
                passive: true
            }
        );



        /* =====================================================
           QUANTITY
        ====================================================== */

        function stockAmount() {

            return Number(
                product?.stock || 0
            );

        }



        function renderQuantity() {

            quantityElement.textContent =
                quantity;


            decreaseButton.disabled =
                quantity <= 1;


            const stock =
                stockAmount();


            increaseButton.disabled =
                stock <= 0 ||
                quantity >= stock;

        }



        decreaseButton.addEventListener(
            "click",
            () => {

                if (
                    quantity <= 1
                ) {

                    return;

                }


                quantity -= 1;

                renderQuantity();

            }
        );


        increaseButton.addEventListener(
            "click",
            () => {

                const stock =
                    stockAmount();


                if (
                    stock <= 0 ||
                    quantity >= stock
                ) {

                    return;

                }


                quantity += 1;

                renderQuantity();

            }
        );



        /* =====================================================
           CART HELPERS
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


            const keys = [
                "zarqaura_cart",
                "zarqauraCart"
            ];


            for (
                const key of keys
            ) {

                try {

                    const saved =
                        JSON.parse(
                            localStorage
                                .getItem(key)
                        );


                    if (
                        Array.isArray(saved)
                    ) {

                        return saved;

                    }

                }

                catch (error) {

                    console.warn(
                        "Unable to read cart",
                        error
                    );

                }

            }


            return [];

        }



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
                    JSON.stringify(cart)
                );

            }


            updateHeaderCartCount(
                cart
            );

        }



        function itemId(item) {

            return (
                item.id ||
                item.productId ||
                item.sku ||
                ""
            );

        }



        function itemQuantity(item) {

            return Math.max(
                1,
                Number(
                    item.quantity ??
                    item.qty ??
                    1
                )
            );

        }



        function setItemQuantity(
            item,
            value
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
                    value;

            }

            else {

                item.quantity =
                    value;

            }

        }



        /* =====================================================
           CART COUNT
        ====================================================== */

        function updateHeaderCartCount(
            cart
        ) {

            const count =
                cart.reduce(
                    (
                        total,
                        item
                    ) => {

                        return (
                            total +
                            itemQuantity(
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
                            count;

                    }
                );

        }



        /* =====================================================
           ADD TO CART
        ====================================================== */

        addButton.addEventListener(
            "click",
            () => {

                if (
                    !product ||
                    stockAmount() <= 0
                ) {

                    return;

                }


                const cart =
                    readCart();


                const existingItem =
                    cart.find(
                        item =>
                            itemId(item) ===
                            product.id
                    );


                const stock =
                    stockAmount();


                if (
                    existingItem
                ) {

                    const currentQuantity =
                        itemQuantity(
                            existingItem
                        );


                    const newQuantity =
                        Math.min(
                            currentQuantity +
                            quantity,
                            stock
                        );


                    setItemQuantity(
                        existingItem,
                        newQuantity
                    );

                }

                else {

                    cart.push(
                        {
                            id:
                                product.id,

                            quantity:
                                Math.min(
                                    quantity,
                                    stock
                                )
                        }
                    );

                }


                saveCart(
                    cart
                );


                feedbackElement.textContent =
                    `${product.name} added to your cart.`;


                addButton.textContent =
                    "Added to Cart";


                window.setTimeout(
                    () => {

                        addButton.textContent =
                            "Add to Cart";

                    },
                    1500
                );

            }
        );



        /* =====================================================
           BADGES
        ====================================================== */

        function renderBadges() {

            const badges = [];


            if (
                product.newArrival
            ) {

                badges.push(
                    `
                    <span class="product-detail-badge">
                        New Arrival
                    </span>
                    `
                );

            }


            if (
                product.bestseller
            ) {

                badges.push(
                    `
                    <span class="product-detail-badge bestseller">
                        Bestseller
                    </span>
                    `
                );

            }


            if (
                product.featured
            ) {

                badges.push(
                    `
                    <span class="product-detail-badge">
                        Featured
                    </span>
                    `
                );

            }


            badgeElement.innerHTML =
                badges.join("");

        }



        /* =====================================================
           RELATED PRODUCTS
        ====================================================== */

        function renderRelatedProducts() {

            const products =
                (window.PRODUCTS || [])
                    .filter(
                        item =>
                            item.active !== false &&
                            item.id !== product.id
                    );


            const sameCategory =
                products.filter(
                    item =>
                        item.category ===
                        product.category
                );


            const others =
                products.filter(
                    item =>
                        item.category !==
                        product.category
                );


            const related = [
                ...sameCategory,
                ...others
            ].slice(
                0,
                4
            );


            if (
                !related.length
            ) {

                relatedSection.style.display =
                    "none";

                return;

            }


            if (
                window.ZARQAURA &&
                typeof ZARQAURA.productCard ===
                "function"
            ) {

                relatedElement.innerHTML =
                    related
                        .map(
                            item =>
                                ZARQAURA
                                    .productCard(
                                        item
                                    )
                        )
                        .join("");

            }

            else {

                relatedElement.innerHTML =
                    related
                        .map(
                            item => `

                                <article class="product-card">

                                    <a
                                        href="product.html?id=${encodeURIComponent(item.id)}"
                                        class="product-card-image-link"
                                    >

                                        <img
                                            class="product-image"
                                            src="${productImage(item, 1)}"
                                            alt="${escapeHTML(item.name)}"
                                        >

                                    </a>


                                    <div class="product-body">

                                        <h3>
                                            <a
                                                href="product.html?id=${encodeURIComponent(item.id)}"
                                            >
                                                ${escapeHTML(item.name)}
                                            </a>
                                        </h3>


                                        <p>
                                            ${money(item.price)}
                                        </p>


                                        <a
                                            href="product.html?id=${encodeURIComponent(item.id)}"
                                            class="zq-text-link"
                                        >
                                            View Product →
                                        </a>

                                    </div>

                                </article>

                            `
                        )
                        .join("");

            }


            relatedLink.href =
                `shop.html?category=${encodeURIComponent(product.category)}`;

        }



        /* =====================================================
           RENDER PRODUCT
        ====================================================== */

        function renderProduct() {

            product =
                findProduct(
                    productId
                );


            if (
                !product ||
                product.active === false
            ) {

                showNotFound();

                return;

            }


            content.style.display =
                "grid";


            notFound.classList.remove(
                "show"
            );



            /* =========================================
               DOCUMENT
            ========================================== */

            document.title =
                `${product.name} | ZARQAURA`;



            /* =========================================
               BASIC DATA
            ========================================== */

            titleElement.textContent =
                product.name;


            priceElement.textContent =
                money(
                    product.price
                );


            descriptionElement.textContent =
                product.description ||
                "A thoughtfully curated ZARQAURA piece designed for effortless everyday styling.";


            skuElement.textContent =
                product.id;


            const categoryName =
                formatCategory(
                    product.category
                );


            categoryElement.textContent =
                categoryName;



            /* =========================================
               BREADCRUMB
            ========================================== */

            breadcrumbName.textContent =
                product.name;


            breadcrumbCategory.textContent =
                categoryName;


            breadcrumbCategory.href =
                `shop.html?category=${encodeURIComponent(product.category)}`;



            /* =========================================
               STOCK
            ========================================== */

            const stock =
                stockAmount();


            if (
                stock > 0
            ) {

                stockElement.textContent =
                    "In Stock";


                stockElement.classList.add(
                    "in-stock"
                );


                stockElement.classList.remove(
                    "out-of-stock"
                );


                addButton.disabled =
                    false;


                addButton.textContent =
                    "Add to Cart";

            }

            else {

                stockElement.textContent =
                    "Out of Stock";


                stockElement.classList.add(
                    "out-of-stock"
                );


                stockElement.classList.remove(
                    "in-stock"
                );


                addButton.disabled =
                    true;


                addButton.textContent =
                    "Out of Stock";


                increaseButton.disabled =
                    true;

            }



            /* =========================================
               GALLERY
            ========================================== */

            renderThumbnails();

            showImage(0);



            /* =========================================
               QUANTITY
            ========================================== */

            quantity = 1;

            renderQuantity();



            /* =========================================
               BADGES
            ========================================== */

            renderBadges();



            /* =========================================
               RELATED
            ========================================== */

            renderRelatedProducts();

        }



        /* =====================================================
           KEYBOARD GALLERY
        ====================================================== */

        document.addEventListener(
            "keydown",
            event => {

                if (!product) {

                    return;

                }


                if (
                    event.key ===
                    "ArrowLeft"
                ) {

                    showImage(
                        currentImageIndex - 1
                    );

                }


                if (
                    event.key ===
                    "ArrowRight"
                ) {

                    showImage(
                        currentImageIndex + 1
                    );

                }

            }
        );



        /* =====================================================
           START
        ====================================================== */

        renderProduct();


    }
);