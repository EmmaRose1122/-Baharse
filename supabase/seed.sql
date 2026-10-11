-- ==============================================================================
-- SEED DATA FOR IMPORTED GOODS STORE (PAKISTAN)
-- 5 Categories, 20 Authentic Sample Products (4 per category), Default Settings
-- ==============================================================================

-- 1. INSERT DEFAULT SITE SETTINGS
INSERT INTO public.site_settings (
    store_name,
    contact_email,
    address,
    delivery_charges,
    free_delivery_above,
    announcement_text,
    jazzcash_title,
    jazzcash_number,
    easypaisa_title,
    easypaisa_number,
    bank_name,
    bank_account_title,
    bank_account_number,
    bank_iban,
    bank_raast_id,
    social_facebook,
    social_instagram,
    social_tiktok
) VALUES (
    'BaharSe Foreign Imports',
    'orders@baharse.pk',
    'Suite 14, Commercial Plaza, Liberty Market, Gulberg III, Lahore, Pakistan',
    250.00,
    5000.00,
    '✈️ 100% Brand-New Handpicked Foreign Imports • Advance Payment via JazzCash, EasyPaisa & Bank Transfer • Nationwide Express Shipping',
    'Muhammad Mateen',
    '03001234567',
    'Muhammad Mateen',
    '03451234567',
    'Meezan Bank Limited',
    'BaharSe Imports Private',
    '02010108923412',
    'PK45MEZN0002010108923412',
    '03001234567',
    'https://facebook.com/baharse.pk',
    'https://instagram.com/baharse.pk',
    'https://tiktok.com/@baharse.pk'
) ON CONFLICT DO NOTHING;

-- 2. INSERT 5 CATEGORIES
INSERT INTO public.categories (id, name, slug, image_url, description)
VALUES 
    (
        'c1000000-0000-0000-0000-000000000001',
        'Kitchen Spices (Masalay)',
        'kitchen-spices',
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
        'Handpicked, aromatic royal saffron, exotic cardamoms, and rare authentic spices imported directly from Dubai souks, Iran, and Sri Lanka.'
    ),
    (
        'c2000000-0000-0000-0000-000000000002',
        'Perfumes & Attars',
        'perfumes',
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
        '100% original French designer fragrances, luxurious Arabian oud, and long-lasting Dubai Eau de Parfums in original factory seals.'
    ),
    (
        'c3000000-0000-0000-0000-000000000003',
        'Medicines & Health Supplements',
        'medicines',
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        'Over-the-counter wellness supplements, original UK & USA vitamins, joint health formulas, and imported pain relief balms.'
    ),
    (
        'c4000000-0000-0000-0000-000000000004',
        'Ladies Suits & Luxury Pret',
        'ladies-suits',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        'Premium Turkish embroidered silk suits, imported Dubai abayas, and Kashmiri handcrafted shawls in exquisite cuts.'
    ),
    (
        'c5000000-0000-0000-0000-000000000005',
        'Gents Pants & Trousers',
        'gents-pants',
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
        'Authentic imported stretch chinos, formal European dress trousers, and high-density Japanese weave cargo pants.'
    )
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name,
    image_url = EXCLUDED.image_url,
    description = EXCLUDED.description;

-- 3. INSERT SAMPLE PRODUCTS (4 Per Category = 20 Total Products)

-- CATEGORY 1: KITCHEN SPICES (MASALAY)
INSERT INTO public.products (
    id, name, slug, description, price, old_price, category_id, images, origin_country, sizes, stock_quantity, is_featured, is_active, is_medicine
) VALUES
(
    'p1000000-0000-0000-0000-000000000001',
    'Pure Royal Super Negin Saffron (5g Sealed Tin)',
    'pure-royal-super-negin-saffron-5g',
    'Grade 1 Super Negin Saffron brought fresh from the Grand Deira Spice Souk in Dubai. Long crimson threads with intense natural aroma and rich coloring power. Perfect for royal biryanis, saffron tea (zafran chai), and traditional desserts. Packed in a sealed airtight metal canister with inspection certificate.',
    6450.00,
    7500.00,
    'c1000000-0000-0000-0000-000000000001',
    ARRAY[
        '/images/saffron-luxury.jpg',
        'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
    ],
    'Dubai (UAE)',
    ARRAY['5g Tin', '10g Tin'],
    18,
    true,
    true,
    false
),
(
    'p1000000-0000-0000-0000-000000000002',
    'Jumbo Green Cardamom Pods 8mm (250g Jar)',
    'jumbo-green-cardamom-pods-250g',
    'Select harvest extra-large (8mm+) whole green cardamom pods imported from Guatemala / Sri Lanka via UAE trade hubs. Bursting with fresh essential oils and fragrant sweet notes. No artificial polish or food coloring added.',
    3200.00,
    3800.00,
    'c1000000-0000-0000-0000-000000000001',
    ARRAY[
        'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
    ],
    'Sri Lanka',
    ARRAY['250g Jar', '500g Jar'],
    25,
    true,
    true,
    false
),
(
    'p1000000-0000-0000-0000-000000000003',
    'Turkish Ottoman Spice Blend (Baharat 200g)',
    'turkish-ottoman-spice-blend-baharat-200g',
    'Authentic Turkish spice mix procured from the Spice Bazaar (Misir Carsisi) in Istanbul. A warm, aromatic blend of sweet paprika, cumin, coriander, cinnamon, clove, and ground sumac. Ideal for lamb chops, Turkish kofta kebabs, and oven roasted chicken.',
    1950.00,
    2400.00,
    'c1000000-0000-0000-0000-000000000001',
    ARRAY[
        'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
    ],
    'Turkey',
    ARRAY['200g Pack'],
    30,
    false,
    true,
    false
),
(
    'p1000000-0000-0000-0000-000000000004',
    'Ceylon Organic True Cinnamon Quills (100g Sticks)',
    'ceylon-organic-true-cinnamon-quills-100g',
    'True Ceylon Cinnamon (Cinnamomum verum) sticks imported from Colombo. Characterized by paper-thin soft layered scrolls with low coumarin content, delicate sweet citrus fragrance, and subtle woody taste. Highly recommended for daily health infusion tea.',
    2150.00,
    2600.00,
    'c1000000-0000-0000-0000-000000000001',
    ARRAY[
        'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
    ],
    'Sri Lanka',
    ARRAY['100g', '250g'],
    14,
    false,
    true,
    false
),

-- CATEGORY 2: PERFUMES
(
    'p2000000-0000-0000-0000-000000000001',
    'Lattafa Khamrah Eau De Parfum (100ml Original)',
    'lattafa-khamrah-eau-de-parfum-100ml',
    'Viral Middle Eastern luxury fragrance imported directly from Dubai, United Arab Emirates. Opens with warm cinnamon, nutmeg, and bergamot, leading to dates, praline, and tuberose on a base of creamy vanilla, tonka bean, and benzoin. 10+ hours projection in a heavy crystal decanter bottle.',
    8950.00,
    11500.00,
    'c2000000-0000-0000-0000-000000000002',
    ARRAY[
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80'
    ],
    'Dubai (UAE)',
    ARRAY['100ml EDP'],
    12,
    true,
    true,
    false
),
(
    'p2000000-0000-0000-0000-000000000002',
    'Club De Nuit Intense Man Pure Parfum (150ml Armaf)',
    'club-de-nuit-intense-man-pure-parfum-150ml',
    'The celebrated woody spicy masterpiece by Armaf France/UAE. Smoky birch, zesty blackcurrant, pineapple, and Italian lemon dry down into deep ambergris, patchouli, and musk. 100% factory sealed batch directly bought from authorized GCC distributor.',
    12500.00,
    15000.00,
    'c2000000-0000-0000-0000-000000000002',
    ARRAY[
        'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80'
    ],
    'France / UAE',
    ARRAY['150ml Parfum'],
    8,
    true,
    true,
    false
),
(
    'p2000000-0000-0000-0000-000000000003',
    'Maison Alhambra Woody Oud EDP (80ml)',
    'maison-alhambra-woody-oud-edp-80ml',
    'An ultra-refined niche scent crafted with Cambodian agarwood, Brazilian rosewood, cardamom, and Sichuan pepper. Smells effortlessly royal and sophisticated, tailored for weddings, evening gatherings, and cold weather.',
    6200.00,
    7500.00,
    'c2000000-0000-0000-0000-000000000002',
    ARRAY[
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    'Dubai (UAE)',
    ARRAY['80ml'],
    16,
    false,
    true,
    false
),
(
    'p2000000-0000-0000-0000-000000000004',
    'Swiss Arabian Shaghaf Oud Azraq (75ml)',
    'swiss-arabian-shaghaf-oud-azraq-75ml',
    'A fiery, indulgent oriental fragrance from the prestigious Swiss Arabian perfumery house in Sharjah. Top notes of golden honey and crisp oud, spiced with cinnamon and Madagascar vanilla bourbon. Unmistakable silage that turns heads.',
    10800.00,
    13000.00,
    'c2000000-0000-0000-0000-000000000002',
    ARRAY[
        'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
    ],
    'Switzerland / UAE',
    ARRAY['75ml EDP'],
    9,
    false,
    true,
    false
),

-- CATEGORY 3: MEDICINES & HEALTH PRODUCTS (is_medicine = true)
(
    'p3000000-0000-0000-0000-000000000001',
    'Kirkland Signature Glucosamine with MSM 1500mg (375 Tablets)',
    'kirkland-signature-glucosamine-msm-1500mg',
    'Authentic USA Costco retail import. Promotes joint flexibility, cartilage cushioning, and mobility comfort. Formulated with Glucosamine HCl 1500mg and MSM 1500mg. Verified original batch with holographic lot stamp. Notice: Dietary supplement for adults.',
    7800.00,
    9200.00,
    'c3000000-0000-0000-0000-000000000003',
    ARRAY[
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80'
    ],
    'USA',
    ARRAY['375 Tablets'],
    15,
    true,
    true,
    true
),
(
    'p3000000-0000-0000-0000-000000000002',
    'Seven Seas JointCare Complete Max Omega-3 (60 Capsules)',
    'seven-seas-jointcare-complete-max-omega3',
    'Imported from boots UK pharmacy. Combines high-strength concentrated fish oil with Glucosamine, Chondroitin, and Vitamin C for normal cartilage collagen formation. Original UK blister pack packaging.',
    5900.00,
    6800.00,
    'c3000000-0000-0000-0000-000000000003',
    ARRAY[
        'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80'
    ],
    'United Kingdom',
    ARRAY['60 Capsules (Dual Pack)'],
    20,
    false,
    true,
    true
),
(
    'p3000000-0000-0000-0000-000000000003',
    'Tiger Balm Red Extra Strength Herbal Ointment (30g Sealed Tin)',
    'tiger-balm-red-extra-strength-30g',
    'Original Haw Par formula procured in Bangkok, Thailand. The classic warm herbal ointment featuring natural camphor, clove oil, cajuput oil, and menthol. Rapid soothing comfort for muscle stiffness, backaches, and joint discomfort after strenuous work.',
    1450.00,
    1800.00,
    'c3000000-0000-0000-0000-000000000003',
    ARRAY[
        'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
    ],
    'Thailand / Singapore',
    ARRAY['30g Jar'],
    40,
    true,
    true,
    true
),
(
    'p3000000-0000-0000-0000-000000000004',
    'Nature Made Multi for Her with Iron & Calcium (300 Tablets)',
    'nature-made-multi-for-her-with-iron',
    'USP verified comprehensive multivitamin imported from California, USA. Contains 23 vital nutrients including Vitamin D3 1000 IU, Folic Acid, Calcium, and Iron to support bone health, immune function, and daily vitality.',
    6500.00,
    7800.00,
    'c3000000-0000-0000-0000-000000000003',
    ARRAY[
        'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=800&q=80'
    ],
    'USA',
    ARRAY['300 Tablets'],
    11,
    false,
    true,
    true
),

-- CATEGORY 4: LADIES SUITS & LUXURY PRET
(
    'p4000000-0000-0000-0000-000000000001',
    'Turkish Royal Embroidered Silk Georgette 3-Piece Suit',
    'turkish-royal-embroidered-silk-georgette-3pc',
    'Exclusive boutique import from Nisantasi, Istanbul. Features exquisite tonal threadwork and subtle gold tilla embellishments along the neckline and hem. Includes pure soft Turkish georgette shirt, matching raw silk trouser, and full jacquard woven dupatta.',
    14500.00,
    18000.00,
    'c4000000-0000-0000-0000-000000000004',
    ARRAY[
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    'Turkey',
    ARRAY['Small (S)', 'Medium (M)', 'Large (L)', 'Unstitched Fabric'],
    7,
    true,
    true,
    false
),
(
    'p4000000-0000-0000-0000-000000000002',
    'Dubai Luxury Nida Fabric Open Abaya with Hijab (Navy Blue)',
    'dubai-luxury-nida-fabric-open-abaya-navy',
    'Hand-stitched luxury front-open abaya crafted from ultra-breathable Premium Korean Nida fabric, imported directly from Dubai. Detailed with delicate lace cuff sleeves and hidden magnetic snap buttons. Includes complimentary matching heavy chiffon scarf.',
    11800.00,
    14500.00,
    'c4000000-0000-0000-0000-000000000004',
    ARRAY[
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
    ],
    'Dubai (UAE)',
    ARRAY['52 Size', '54 Size', '56 Size', '58 Size'],
    10,
    false,
    true,
    false
),
(
    'p4000000-0000-0000-0000-000000000003',
    'Handwoven Kashmiri Pashmina Shawl with Sozni Border',
    'handwoven-kashmiri-pashmina-shawl-sozni',
    'Authentic feather-soft wool pashmina shawl with traditional needlework (Sozni embroidery) borders. Procured directly from master craftsmen. Warm, lightweight, and timeless heirloom piece for festive winter gatherings in Pakistan.',
    16800.00,
    21000.00,
    'c4000000-0000-0000-0000-000000000004',
    ARRAY[
        'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'
    ],
    'Kashmir / UAE Import',
    ARRAY['Standard Shawl (100x200 cm)'],
    5,
    true,
    true,
    false
),
(
    'p4000000-0000-0000-0000-000000000004',
    'Emerald Cutwork Velvet Kurta & Cigarette Pant 2-Piece',
    'emerald-cutwork-velvet-kurta-pant-2pc',
    'Luxurious imported micro-velvet fabric with delicate laser-cut organza details along the sleeves and daman. Paired with tailored matching trousers. Ideal for winter wedding soirées, engagement functions, and formal dinners.',
    13200.00,
    16500.00,
    'c4000000-0000-0000-0000-000000000004',
    ARRAY[
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'
    ],
    'Turkey',
    ARRAY['Small (S)', 'Medium (M)', 'Large (L)'],
    8,
    false,
    true,
    false
),

-- CATEGORY 5: GENTS PANTS & TROUSERS
(
    'p5000000-0000-0000-0000-000000000001',
    'Imported Premium 4-Way Stretch Chino Pant (Khaki / Tan)',
    'imported-premium-4way-stretch-chino-khaki',
    'Tailored slim-tapered chinos made with high-density European cotton blend and 4% Lycra stretch. Extremely breathable, wrinkle-resistant, and maintains crisp shape throughout long work days. Imported directly from retail outlets in Thailand & UAE.',
    4250.00,
    5500.00,
    'c5000000-0000-0000-0000-000000000005',
    ARRAY[
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80'
    ],
    'Thailand / UAE',
    ARRAY['30 Waist', '32 Waist', '34 Waist', '36 Waist', '38 Waist'],
    22,
    true,
    true,
    false
),
(
    'p5000000-0000-0000-0000-000000000002',
    'European Formal Poly-Viscose Dress Trouser (Charcoal Grey)',
    'european-formal-poly-viscose-dress-trouser-charcoal',
    'Classic flat-front formal dress trousers imported from Turkey. Features comfort waistband extension, French fly closure, and non-creasing luxury fabric drape. Ready for business meetings, weddings, and formal office wear.',
    4850.00,
    6200.00,
    'c5000000-0000-0000-0000-000000000005',
    ARRAY[
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80'
    ],
    'Turkey',
    ARRAY['30 Waist', '32 Waist', '34 Waist', '36 Waist'],
    16,
    false,
    true,
    false
),
(
    'p5000000-0000-0000-0000-000000000003',
    'Tactical Heavy Cotton Ripstop Cargo Pants (Olive Green)',
    'tactical-heavy-cotton-ripstop-cargo-pants-olive',
    'Rugged multi-pocket cargo pants imported from Southeast Asian trade outlets. Built with water-repellent ripstop weave, reinforced knee stitching, deep utility cargo pockets, and adjustable ankle cinch straps. Outstanding durability for travel.',
    4950.00,
    6500.00,
    'c5000000-0000-0000-0000-000000000005',
    ARRAY[
        'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800&q=80'
    ],
    'Thailand',
    ARRAY['30 Waist', '32 Waist', '34 Waist', '36 Waist'],
    14,
    true,
    true,
    false
),
(
    'p5000000-0000-0000-0000-000000000004',
    'Imported Smart Jogger Pant with Zipper Pockets (Jet Black)',
    'imported-smart-jogger-pant-zipper-pockets-black',
    'Ultra-comfortable urban jogger trousers designed with tech-fleece fabric, elasticated waistband with metal-tipped drawstrings, and waterproof zip side pockets. Ideal for airport travel, casual outings, and evening comfort.',
    3850.00,
    4900.00,
    'c5000000-0000-0000-0000-000000000005',
    ARRAY[
        'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80'
    ],
    'Dubai (UAE)',
    ARRAY['Small (30-31)', 'Medium (32-33)', 'Large (34-35)', 'XL (36-38)'],
    28,
    false,
    true,
    false
)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    old_price = EXCLUDED.old_price,
    images = EXCLUDED.images,
    origin_country = EXCLUDED.origin_country,
    sizes = EXCLUDED.sizes,
    stock_quantity = EXCLUDED.stock_quantity,
    is_featured = EXCLUDED.is_featured,
    is_active = EXCLUDED.is_active,
    is_medicine = EXCLUDED.is_medicine;
