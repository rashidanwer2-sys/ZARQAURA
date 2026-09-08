/* =========================================================
   ZARQAURA
   PRODUCT DETAIL PAGE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        const root =
            document.querySelector(
                "[data-product]"
            );


        if (!root) {

            return;

        }



        /* =================================================
           FIND PRODUCT
        ================================================= */

        const params =
            new URLSearchParams(
                window.location.search
            );


        const productId =
            params.get("id");


        const product =
            window.PRODUCTS.find(
                item =>
                    item.id === productId &&
                    item.active
            );



        /* =================================================
           PRODUCT NOT FOUND
        ================================================= */

        if (!product) {

            root.innerHTML = `

                <div
                    class="panel"
                >

                    <h2>
                        Product Not Found
                    </h2>

                    <p>
                        This product may no longer
                        be available.
                    </p>

                    <a
                        href="shop.html"
                        class="btn"
                    >

                        Back to Shop

                    </a>

                </div>

            `;


            return;

        }



        /* =================================================
           GET FOUR PRODUCT IMAGES
        ================================================= */

        const images =
            ZARQAURA.getProductImages(
                product
            );


        let activeImageIndex =
            0;



        /* =================================================
           PAGE STRUCTURE
        ================================================= */

        root.innerHTML = `

            <div
                class="product-layout"
            >


                <!-- =====================================
                     PRODUCT GALLERY
                ====================================== -->

                <section
                    class="product-gallery"
                >


                    <div
                        class="product-main-image"
                    >


                        <button
                            class="product-gallery-arrow product-gallery-prev"
                            type="button"
                            aria-label="Previous image"
                        >

                            ‹

                        </button>


                        <img
                            data-main-product-image
                            src="${images[0]}"
                            alt="${product.name}"
                        >


                        <button
                            class="product-gallery-arrow product-gallery-next"
                            type="button"
                            aria-label="Next image"
                        >

                            ›

                        </button>


                        <div
                            class="product-image-counter"
                        >

                            <span
                                data-current-image
                            >
                                1
                            </span>

                            /

                            ${images.length}

                        </div>


                    </div>



                    <div
                        class="product-thumbnails"
                        data-product-thumbnails
                    >

                        ${images
                            .map(
                                (
                                    image,
                                    index
                                ) => `

                                    <button
                                        type="button"
                                        class="
                                            product-thumbnail
                                            ${
                                                index === 0
                                                    ? "active"
                                                    : ""
                                            }
                                        "
                                        data-image-index="${index}"
                                    >

                                        <img
                                            src="${image}"
                                            alt="${product.name} image ${index + 1}"
                                            loading="lazy"
                                        >

                                    </button>

                                `
                            )
                            .join("")}

                    </div>


                </section>



                <!-- =====================================
                     PRODUCT INFORMATION
                ====================================== -->

                <section
                    class="product-info"
                >


                    <p
                        class="zq-eyebrow"
                    >

                        ${product.category}

                    </p>


                    <h1>

                        ${product.name}

                    </h1>


                    <div
                        class="price product-page-price"
                    >

                        ${ZARQAURA.money(
                            product.price
                        )}

                    </div>


                    <p
                        class="product-description"
                    >

                        ${product.description}

                    </p>



                    <div
                        class="product-meta"
                    >


                        <div>

                            <span>
                                SKU
                            </span>

                            <strong>

                                ${product.id}

                            </strong>

                        </div>


                        <div>

                            <span>
                                Category
                            </span>

                            <strong>

                                ${formatCategory(
                                    product.category
                                )}

                            </strong>

                        </div>


                        ${
                            product.subCategory

                                ? `

                                    <div>

                                        <span>
                                            Style
                                        </span>

                                        <strong>

                                            ${formatCategory(
                                                product.subCategory
                                            )}

                                        </strong>

                                    </div>

                                `

                                : ""
                        }


                    </div>



                    <div
                        class="product-stock"
                    >

                        ${
                            product.stock > 0

                                ? `

                                    <span
                                        class="stock-dot in-stock"
                                    ></span>

                                    ${product.stock}
                                    available

                                `

                                : `

                                    <span
                                        class="stock-dot out-stock"
                                    ></span>

                                    Out of Stock

                                `
                        }

                    </div>



                    <div
                        class="notice"
                    >

                        ${SITE_CONFIG.shippingText}

                        •

                        ${SITE_CONFIG.deliveryText}

                    </div>



                    <div
                        class="product-actions"
                    >


                        <button
                            class="btn product-add-cart"
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


                        <a
                            href="cart.html"
                            class="btn secondary"
                        >

                            View Cart

                        </a>


                    </div>



                    <div
                        class="product-highlights"
                    >


                        <div>

                            <span>
                                ✦
                            </span>

                            <div>

                                <strong>
                                    Anti-Tarnish
                                </strong>

                                <small>
                                    Designed for
                                    long-lasting shine
                                </small>

                            </div>

                        </div>



                        <div>

                            <span>
                                ♡
                            </span>

                            <div>

                                <strong>
                                    Everyday Wear
                                </strong>

                                <small>
                                    Comfortable styling
                                    for daily use
                                </small>

                            </div>

                        </div>



                        <div>

                            <span>
                                ◌
                            </span>

                            <div>

                                <strong>
                                    Free Shipping
                                </strong>

                                <small>
                                    Across India
                                </small>

                            </div>

                        </div>


                    </div>


                </section>


            </div>

        `;



        /* =================================================
           ELEMENTS
        ================================================= */

        const mainImage =
            root.querySelector(
                "[data-main-product-image]"
            );


        const currentImage =
            root.querySelector(
                "[data-current-image]"
            );


        const thumbnails =
            root.querySelectorAll(
                ".product-thumbnail"
            );


        const previousButton =
            root.querySelector(
                ".product-gallery-prev"
            );


        const nextButton =
            root.querySelector(
                ".product-gallery-next"
            );



        /* =================================================
           CHANGE IMAGE
        ================================================= */

        function showImage(index) {

            if (index < 0) {

                index =
                    images.length - 1;

            }


            if (
                index >=
                images.length
            ) {

                index =
                    0;

            }


            activeImageIndex =
                index;


            mainImage.src =
                images[
                    activeImageIndex
                ];


            currentImage.textContent =
                activeImageIndex + 1;


            thumbnails.forEach(
                (
                    thumbnail,
                    thumbnailIndex
                ) => {

                    thumbnail.classList.toggle(
                        "active",
                        thumbnailIndex ===
                        activeImageIndex
                    );

                }
            );

        }



        /* =================================================
           THUMBNAIL CLICK
        ================================================= */

        thumbnails.forEach(
            thumbnail => {

                thumbnail.addEventListener(
                    "click",
                    () => {

                        showImage(
                            Number(
                                thumbnail.dataset.imageIndex
                            )
                        );

                    }
                );

            }
        );



        /* =================================================
           PREVIOUS / NEXT
        ================================================= */

        previousButton.addEventListener(
            "click",
            () => {

                showImage(
                    activeImageIndex - 1
                );

            }
        );


        nextButton.addEventListener(
            "click",
            () => {

                showImage(
                    activeImageIndex + 1
                );

            }
        );



        /* =================================================
           MOBILE SWIPE
        ================================================= */

        let touchStartX =
            0;


        let touchEndX =
            0;


        mainImage.addEventListener(
            "touchstart",
            event => {

                touchStartX =
                    event.changedTouches[0]
                        .screenX;

            },
            {
                passive:
                    true
            }
        );


        mainImage.addEventListener(
            "touchend",
            event => {

                touchEndX =
                    event.changedTouches[0]
                        .screenX;


                handleSwipe();

            },
            {
                passive:
                    true
            }
        );


        function handleSwipe() {

            const difference =
                touchStartX -
                touchEndX;


            if (
                Math.abs(
                    difference
                ) < 45
            ) {

                return;

            }


            if (
                difference > 0
            ) {

                showImage(
                    activeImageIndex + 1
                );

            }

            else {

                showImage(
                    activeImageIndex - 1
                );

            }

        }



        /* =================================================
           FORMAT CATEGORY
        ================================================= */

        function formatCategory(value) {

            if (!value) {

                return "";

            }


            return (
                value
                    .charAt(0)
                    .toUpperCase() +
                value.slice(1)
            );

        }


    }
);