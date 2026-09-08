/* =========================================================
   ZARQAURA PRODUCT DATABASE

   SKU FORMAT
   BR0001 = Bracelet
   CH0001 = Chain
   RG0001 = Ring
   ER0001 = Earring
   MG0001 = Mangalsutra

   IMPORTANT:
   Every product folder should contain:
   1.jpg
   2.jpg
   3.jpg
   4.jpg

   You DO NOT need to add image paths here.
========================================================= */

window.PRODUCTS = [

    /* =====================================================
       BRACELETS
    ===================================================== */

    {
        id: "BR0001",

        name: "Classic Chain Bracelet",

        category: "bracelets",

        subCategory: "chain",

        price: 699,

        description:
            "A modern anti-tarnish bracelet designed for effortless everyday styling.",

        stock: 5,

        active: true,

        featured: true,

        newArrival: true,

        bestseller: false
    },


    /* =====================================================
       CHAINS
    ===================================================== */

    {
        id: "CH0001",

        name: "Everyday Minimal Chain",

        category: "chains",

        subCategory: "minimal",

        price: 799,

        description:
            "A versatile anti-tarnish chain created for minimal everyday looks.",

        stock: 6,

        active: true,

        featured: true,

        newArrival: true,

        bestseller: false
    },


    /* =====================================================
       RINGS
    ===================================================== */

    {
        id: "RG0001",

        name: "Minimal Luxe Ring",

        category: "rings",

        subCategory: "adjustable",

        price: 599,

        description:
            "An elegant adjustable anti-tarnish ring designed to complement your everyday style.",

        stock: 8,

        active: true,

        featured: true,

        newArrival: true,

        bestseller: true
    },


    /* =====================================================
       EARRINGS
    ===================================================== */

    {
        id: "ER0001",

        name: "Everyday Gold Earrings",

        category: "earrings",

        subCategory: "studs",

        price: 699,

        description:
            "Lightweight anti-tarnish earrings designed for comfortable everyday elegance.",

        stock: 7,

        active: true,

        featured: true,

        newArrival: false,

        bestseller: true
    },


    /* =====================================================
       MANGALSUTRAS
    ===================================================== */

    {
        id: "MG0001",

        name: "Modern Everyday Mangalsutra",

        category: "mangalsutras",

        subCategory: "minimal",

        price: 999,

        description:
            "A contemporary mangalsutra designed to blend traditional meaning with modern styling.",

        stock: 4,

        active: true,

        featured: false,

        newArrival: true,

        bestseller: false
    }

];