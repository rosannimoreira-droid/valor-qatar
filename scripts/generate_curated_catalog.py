"""
One-time deterministic migration script to consolidate the 470 raw media files
into structured, deduplicated, Zod-compatible product records under src/content/products/
and editorial media records under src/data/editorial-media.json.

Strict Governance:
- Zero fabricated prices: all products use pricingMode = "price_on_request", basePriceQar = null.
- Zero invented ingredients, weights, or delivery SLAs.
- Non-product media (09_Brand_and_Media, CSR school photos, buffet setups) excluded from shoppable SKUs.
"""

import json
import os
import re
from collections import defaultdict
from PIL import Image

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRODUCTS_DIR = os.path.join(WORKSPACE, "src", "content", "products")
DATA_DIR = os.path.join(WORKSPACE, "src", "data")

CATEGORY_MAP = {
    "01_Chocolates_and_Pralines": "chocolates",
    "02_Fresh_Flowers_and_Bouquets": "flowers",
    "03_Flowers_and_Chocolate_Combos": "combos",
    "04_Dates_and_Arabic_Sweets": "dates-sweets",
    "05_Savory_and_Appetizers": "savoury",
    "06_Custom_Cakes_and_Desserts": "cakes-desserts",
    "07_Seasonal_and_Occasions": "seasonal",
    "08_Hospitality_Stands_and_Towers": "stands-towers",
}

EDITORIAL_FILES = {
    "09_Brand_and_Media/485191282_18071882308848346_8532904679515769008_n.jpg",
    "09_Brand_and_Media/631805606_18104307574848346_9039825672876290415_n.jpg",
    "09_Brand_and_Media/703474178_18114027616848346_6945262215300819656_n.jpg",
    "09_Brand_and_Media/751819132_18120391231848346_2090616621603804434_n.jpg",
    "09_Brand_and_Media/755246511_18120797095848346_1315519174895668044_n.jpg",
    "09_Brand_and_Media/760965565_18121500493848346_2049141357939601382_n.jpg",
    "09_Brand_and_Media/839044877_18128272177848346_5878633905031903509_n.jpg",
    "07_Seasonal_and_Occasions/830834248_18127582777848346_961135351986346785_n.jpg",
    "07_Seasonal_and_Occasions/833958119_18127584319848346_4272471265445364400_n.jpg",
    "08_Hospitality_Stands_and_Towers/481699946_1179380843894490_2662892902120654989_n.jpg",
    "08_Hospitality_Stands_and_Towers/481863025_18069530902848346_554094587584567320_n.jpg",
}

# Verified occasion prefixes (matched by numeric ID prefix) from visual contact sheet review
OCCASION_BY_PREFIX = {
    # Newborn
    "523307794": ["newborn", "majlis-weddings"],
    "523358911": ["newborn", "majlis-weddings"],
    "523779188": ["newborn", "majlis-weddings"],
    "524154037": ["newborn", "majlis-weddings"],
    "622960789": ["newborn", "majlis-weddings"],
    "625003986": ["newborn", "everyday-gifting"],
    "626316937": ["newborn", "everyday-gifting"],
    "627674627": ["newborn", "everyday-gifting"],
    "637804256": ["newborn", "majlis-weddings"],
    "654415978": ["newborn", "everyday-gifting"],
    # Qatar National Day
    "590389285": ["qatar-national-day"],
    "621653609": ["qatar-national-day"],
    "625026040": ["qatar-national-day"],
    "625142370": ["qatar-national-day"],
    "625240882": ["qatar-national-day"],
    "649238491": ["qatar-national-day"],
    "652085423": ["qatar-national-day"],
    "655202092": ["qatar-national-day"],
    "656273546": ["qatar-national-day"],
    "656860137": ["qatar-national-day"],
    "657341574": ["qatar-national-day"],
    "587385024": ["qatar-national-day", "everyday-gifting"],
    "588438684": ["qatar-national-day", "everyday-gifting"],
    "588598628": ["qatar-national-day", "everyday-gifting"],
    # Ramadan & Eid
    "478332624": ["ramadan-eid", "majlis-weddings"],
    "479258511": ["ramadan-eid", "majlis-weddings"],
    "479418421": ["ramadan-eid", "majlis-weddings"],
    "481214519": ["ramadan-eid", "majlis-weddings"],
    "481452884": ["ramadan-eid", "majlis-weddings"],
    "481452887": ["ramadan-eid", "majlis-weddings"],
    "481591321": ["ramadan-eid", "majlis-weddings"],
    "482156490": ["ramadan-eid", "majlis-weddings"],
    "632704965": ["ramadan-eid"],
    "640421392": ["ramadan-eid"],
    "640431558": ["ramadan-eid"],
    "641222596": ["ramadan-eid"],
    "641425032": ["ramadan-eid"],
    "641773276": ["ramadan-eid"],
    "641848654": ["ramadan-eid"],
    "650737260": ["ramadan-eid"],
    # Hajj & Umrah
    "624374211": ["hajj-umrah", "majlis-weddings"],
    "625700727": ["hajj-umrah", "majlis-weddings"],
    # Summer Coolers
    "730891041": ["summer", "everyday-gifting"],
    "742215492": ["summer", "everyday-gifting"],
    "757212430": ["summer", "everyday-gifting"],
    # Graduation
    "622409474": ["graduation"],
    "622528760": ["graduation"],
    "622585230": ["graduation"],
    "622640224": ["graduation"],
    "624997622": ["graduation"],
    "625939861": ["graduation"],
    "627656908": ["graduation"],
    "642978927": ["graduation"],
    "652769834": ["graduation"],
    "829867991": ["graduation", "everyday-gifting"],
}

# Verified curated parent overrides for flagship hero & notable items
CURATED_PREFIXES = {
    "703676210": {
        "name_en": "Porcelain Stepped Stand — Red Roses & Acrylic Tray",
        "name_ar": "منصة ضيافة مدرجة — ورد أحمر وصينية أكريليك",
        "short_en": "Two-tier white hospitality stand pairing fresh crimson roses with a covered chocolate tray.",
        "short_ar": "منصة تقديم بيضاء من مستويين تجمع بين الورد الأحمر الطبيعي وصينية شوكولاتة مغطاة.",
        "packaging": "porcelain-white",
        "featured": True,
        "sortWeight": 1,
    },
    "560484380": {
        "name_en": "Terracotta Signature Box — Rolled Wafer Cigars",
        "name_ar": "صندوق التراكوتا المميز — سجائر الويفر بالشوكولاتة",
        "short_en": "Valor terracotta lattice box filled with coated chocolate wafer rolls.",
        "short_ar": "صندوق فالور بلون التراكوتا المزخرف محشو بأصابع الويفر المغطاة بالشوكولاتة.",
        "packaging": "terracotta",
        "featured": True,
        "sortWeight": 2,
    },
    "766074381": {
        "name_en": "Taupe Satin-Ribbon Box — Assorted Sweets & Petits Fours",
        "name_ar": "صندوق التوب بشريطة الساتان — تشكيلة حلويات مختارة",
        "short_en": "Warm taupe keepsake box finished with an ivory satin ribbon and assorted pastries.",
        "short_ar": "صندوق فاخر بلون التوب مزين بشريطة ساتان عاجية وتشكيلة حلويات.",
        "packaging": "taupe-ribbon",
        "featured": True,
        "sortWeight": 3,
    },
    "617562485": {
        "name_en": "Arabian Horse Heritage Box — Assorted Sablés",
        "name_ar": "صندوق الخيل العربي التراثي — تشكيلة السابليه",
        "short_en": "Slate-blue collector box featuring Arabian horse artwork and colourful French sablés.",
        "short_ar": "صندوق الخيل العربي الأزرق الملكي محشو بتشكيلة بسكويت السابليه الملون.",
        "packaging": "arabian-horse",
        "featured": True,
        "sortWeight": 4,
    },
    "621909096": {
        "name_en": "Grand Crimson Rose Hand Bouquet",
        "name_ar": "باقة الورد الأحمر الملكية الكبيرة",
        "short_en": "Generous hand-tied bouquet of crimson roses in matte charcoal architectural wrap.",
        "short_ar": "باقة يد كبيرة من الورد الأحمر الطبيعي بتغليف أسود غير لامع أنيق.",
        "packaging": "floral-wrap",
        "featured": True,
        "sortWeight": 5,
    },
    "486375675": {
        "name_en": "Imperial Warak Enab Pyramid Tower",
        "name_ar": "برج ورق العنب الملكي على قاعدة فالور",
        "short_en": "Sculpted vine-leaf pyramid garnished with herbs and served on a porcelain pedestal.",
        "short_ar": "هرم ورق عنب منسق ومزين بالأعشاب الطازجة على قاعدة فالور الخزفية.",
        "packaging": "porcelain-white",
        "featured": True,
        "sortWeight": 6,
    },
    "478332624": {
        "name_en": "Ramadan Calligraphy Hexagonal Hospitality Box",
        "name_ar": "صندوق الضيافة السداسي لشهر رمضان",
        "short_en": "Compartmentalized white and gold box with Ramadan calligraphy, stuffed dates and sweets.",
        "short_ar": "صندوق سداسي مقسّم باللون الأبيض والذهبي بعبارة رمضان مع التمور والحلويات.",
        "packaging": "porcelain-white",
        "featured": True,
        "sortWeight": 7,
    },
    "625026040": {
        "name_en": "Qatar National Day Maroon & White Cone Tower",
        "name_ar": "برج اليوم الوطني القطري — الأدعم والأبيض",
        "short_en": "Maroon and white cone presentation crowned with the Qatari flag on a Valor pedestal.",
        "short_ar": "هرم تقديم بألوان العلم القطري العنابي والأبيض متوج بالراية الوطنية على قاعدة فالور.",
        "packaging": "seasonal-box",
        "featured": True,
        "sortWeight": 8,
    },
    "520262495": {
        "name_en": "Matte Black Floral Stand with Chocolate Drawer",
        "name_ar": "منصة الورد السوداء مع درج الشوكولاتة",
        "short_en": "Black floral stand paired with a clear acrylic confectionery drawer and Arabic calligraphy.",
        "short_ar": "منصة سوداء تجمع بين الورد الأحمر الطبيعي ودرج شوكولاتة أكريليك مع خط عربي مذهب.",
        "packaging": "matte-black",
        "featured": True,
        "sortWeight": 9,
    },
    "622528760": {
        "name_en": "Graduation Mortarboard Celebration Cake",
        "name_ar": "كيك قبعة التخرج الاحتفالي",
        "short_en": "Two-tone white and gold celebration cake topped with a sculpted graduation cap.",
        "short_ar": "كيك احتفالي أبيض وذهبي متوج بمجسم قبعة التخرج.",
        "packaging": "porcelain-white",
        "featured": True,
        "sortWeight": 10,
    },
    "757212430": {
        "name_en": "Hala Bel Saif Branded Beach Cooler",
        "name_ar": "صندوق هلا بالصيف المبرد مع جوز الهند",
        "short_en": "Valor insulated summer cooler box styled with whole coconuts for coastal gatherings.",
        "short_ar": "صندوق فالور المبرد للصيف منسق مع جوز الهند الطازج للتجمعات البحرية.",
        "packaging": "seasonal-box",
        "featured": True,
        "sortWeight": 11,
    },
    "523307794": {
        "name_en": "Newborn Welcome Acrylic Display — Blue Edition",
        "name_ar": "تنسيق استقبال المولود بالأكريليك — الإصدار السماوي",
        "short_en": "Round arrangement in a clear acrylic case with butterfly accents and Arabic greeting.",
        "short_ar": "تنسيق دائري داخل صندوق أكريليك شفاف بتفاصيل الفراشات وعبارة ألف مبروك المولود.",
        "packaging": "acrylic",
        "featured": True,
        "sortWeight": 12,
    },
}

CATEGORY_DESCRIPTORS = {
    "chocolates": (
        "Artisanal Chocolate Presentation",
        "تشكيلة شوكولاتة فاخرة",
        "Handcrafted chocolate assortment prepared for gifting and hospitality. Confirm exact piece count and availability via concierge.",
        "تشكيلة شوكولاتة مختارة معدة للضيافة والإهداء. يمكن تأكيد التفاصيل والتوفر مباشرة عبر الكونسيرج.",
        "arabian-horse",
        ["everyday-gifting", "majlis-weddings"],
    ),
    "flowers": (
        "Fresh Floral Arrangement",
        "تنسيق زهور طبيعية",
        "Freshly arranged seasonal blooms styled in boutique wrapping or glass vessels. Flower shades confirmed upon enquiry.",
        "تنسيق زهور طبيعية مختارة بتغليف أنيق أو فازات زجاجية، مع تأكيد الألوان والتوفر عبر الكونسيرج.",
        "floral-wrap",
        ["everyday-gifting"],
    ),
    "combos": (
        "Flower & Confectionery Ensemble",
        "تنسيق ورد وشوكولاتة",
        "Coordinated floral and confectionery pairing engineered for hospital visits, housewarmings and formal gifting.",
        "تنسيق يجمع بين الورود الطبيعية والحلويات الفاخرة لزيارات التهنئة والمناسبات الخاصة.",
        "acrylic",
        ["majlis-weddings", "everyday-gifting"],
    ),
    "dates-sweets": (
        "Dates & Traditional Sweets Box",
        "تشكيلة التمور والحلويات الشرقية",
        "Curated presentation of dates, traditional Arabic sweets or French sablés arranged for majlis hosting.",
        "تشكيلة منتقاة من التمور والحلويات الشرقية أو بسكويت السابليه لضيافة المجالس.",
        "porcelain-white",
        ["majlis-weddings", "ramadan-eid"],
    ),
    "savoury": (
        "Savoury & Warak Enab Platter",
        "تشكيلة الموالح وورق العنب",
        "Savoury hospitality arrangement prepared for receptions and family gatherings. Preparation lead time confirmed on enquiry.",
        "تقديم موالح وورق عنب معدّ للاستقبالات والمجالس العائلية، مع تأكيد مدة التجهيز عند الطلب.",
        "porcelain-white",
        ["majlis-weddings"],
    ),
    "cakes-desserts": (
        "Celebration Cake & Patisserie",
        "كيك مناسبات وحلويات فاخرة",
        "Custom celebration cake or patisserie tray crafted to order. Confirm flavour preferences and lead time with concierge.",
        "كيك مناسبات أو تارت حلويات يُجهز حسب الطلب، مع تأكيد النكهات وموعد التسليم عبر الكونسيرج.",
        "porcelain-white",
        ["everyday-gifting"],
    ),
    "stands-towers": (
        "Majlis Hospitality Stand or Tower",
        "منصة أو برج ضيافة للمجالس",
        "Elevated pedestal cone tower or multi-tier hospitality stand built as a reception centerpiece.",
        "برج تقديم هرمي أو منصة ضيافة متعددة الأدوار مصممة لتصدر طاولات الاستقبال والمجالس.",
        "porcelain-white",
        ["majlis-weddings"],
    ),
    "seasonal": (
        "Seasonal Occasion Edition",
        "إصدار المناسبات الموسمية",
        "Limited seasonal presentation created for Qatari holidays and family milestones.",
        "تشكيلة موسمية مخصصة للأعياد الوطنية والدينية والمناسبات العائلية في قطر.",
        "seasonal-box",
        ["ramadan-eid"],
    ),
}

def dhash(image, hash_size=8):
    resized = image.convert("L").resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
    pixels = list(resized.getdata())
    bits = []
    for row in range(hash_size):
        start = row * (hash_size + 1)
        for col in range(hash_size):
            bits.append(1 if pixels[start + col] > pixels[start + col + 1] else 0)
    val = 0
    for b in bits:
        val = (val << 1) | b
    return val

def hamming(h1, h2):
    return bin(h1 ^ h2).count("1")

def sanitize_key(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

def main():
    os.makedirs(PRODUCTS_DIR, exist_ok=True)
    os.makedirs(DATA_DIR, exist_ok=True)

    # Clear old generated product JSONs if re-running cleanly
    for existing in os.listdir(PRODUCTS_DIR):
        if existing.endswith(".json"):
            os.remove(os.path.join(PRODUCTS_DIR, existing))

    all_images = []
    editorial_items = []

    for folder, cat_id in sorted(CATEGORY_MAP.items()):
        fpath = os.path.join(WORKSPACE, folder)
        for fn in sorted(os.listdir(fpath)):
            full = os.path.join(fpath, fn)
            if not os.path.isfile(full):
                continue
            rel = f"{folder}/{fn}"
            with Image.open(full) as im:
                w, h = im.size
                dh = dhash(im)
            prefix = fn.split("_", 1)[0]
            rec = {
                "rel": rel,
                "folder": folder,
                "cat_id": cat_id,
                "filename": fn,
                "prefix": prefix,
                "width": w,
                "height": h,
                "dhash": dh,
            }
            if rel in EDITORIAL_FILES:
                editorial_items.append(rec)
            else:
                all_images.append(rec)

    # Also process 09_Brand_and_Media
    b_path = os.path.join(WORKSPACE, "09_Brand_and_Media")
    for fn in sorted(os.listdir(b_path)):
        full = os.path.join(b_path, fn)
        if not os.path.isfile(full):
            continue
        with Image.open(full) as im:
            w, h = im.size
        editorial_items.append({
            "rel": f"09_Brand_and_Media/{fn}",
            "folder": "09_Brand_and_Media",
            "cat_id": "editorial",
            "filename": fn,
            "prefix": fn.split("_", 1)[0],
            "width": w,
            "height": h,
        })

    # Cluster near-duplicate & alternate-angle product shots (dHash <= 6 within same category)
    by_cat = defaultdict(list)
    for rec in all_images:
        by_cat[rec["cat_id"]].append(rec)

    products = []
    cat_counters = defaultdict(int)

    for cat_id in CATEGORY_MAP.values():
        recs = by_cat[cat_id]
        n = len(recs)
        visited = [False] * n
        clusters = []
        for i in range(n):
            if visited[i]:
                continue
            group = [recs[i]]
            visited[i] = True
            queue = [i]
            while queue:
                cur = queue.pop()
                for j in range(n):
                    if not visited[j] and hamming(recs[cur]["dhash"], recs[j]["dhash"]) <= 6:
                        visited[j] = True
                        group.append(recs[j])
                        queue.append(j)
            clusters.append(group)

        for group in clusters:
            cat_counters[cat_id] += 1
            num = cat_counters[cat_id]
            # Prefer a curated item as primary if present in the cluster
            group.sort(key=lambda r: (0 if r["prefix"] in CURATED_PREFIXES else 1, -r["width"] * r["height"], r["filename"]))
            primary = group[0]
            curated = CURATED_PREFIXES.get(primary["prefix"])

            desc_en_base, desc_ar_base, long_en, long_ar, default_pkg, default_occs = CATEGORY_DESCRIPTORS[cat_id]

            sku = f"VLR-{cat_id[:3].upper()}-{num:03d}"
            pid = f"valor-{cat_id}-{num:03d}"

            if curated:
                name_en = curated["name_en"]
                name_ar = curated["name_ar"]
                short_en = curated["short_en"]
                short_ar = curated["short_ar"]
                pkg = curated["packaging"]
                featured = curated["featured"]
                sort_weight = curated["sortWeight"]
                slug_en = sanitize_key(name_en) + f"-{num:03d}"
            else:
                name_en = f"Valor {desc_en_base} ({sku})"
                name_ar = f"{desc_ar_base} من فالور ({sku})"
                short_en = long_en
                short_ar = long_ar
                pkg = default_pkg
                featured = False
                sort_weight = 100 + num
                slug_en = sanitize_key(f"{cat_id}-{num:03d}-{primary['prefix']}")

            occasions = set(default_occs)
            for item in group:
                if item["prefix"] in OCCASION_BY_PREFIX:
                    occasions.update(OCCASION_BY_PREFIX[item["prefix"]])

            images_arr = []
            for img_idx, item in enumerate(group):
                role = "primary" if img_idx == 0 else ("angle" if img_idx == 1 else "detail")
                media_key = sanitize_key(f"{sku}-{img_idx+1:02d}-{item['prefix']}")
                images_arr.append({
                    "id": f"{sku}-IMG-{img_idx+1:02d}",
                    "masterPath": item["rel"],
                    "mediaKey": media_key,
                    "role": role,
                    "alt": {
                        "en": f"{name_en} — view {img_idx+1}",
                        "ar": f"{name_ar} — زاوية {img_idx+1}",
                    },
                    "width": item["width"],
                    "height": item["height"],
                })

            product_doc = {
                "id": pid,
                "sku": sku,
                "slug": {
                    "en": slug_en,
                    "ar": slug_en,
                },
                "name": {
                    "en": name_en,
                    "ar": name_ar,
                },
                "shortDescription": {
                    "en": short_en,
                    "ar": short_ar,
                },
                "description": {
                    "en": long_en,
                    "ar": long_ar,
                },
                "primaryCategory": cat_id,
                "collections": [pkg],
                "occasions": sorted(occasions),
                "images": images_arr,
                "pricingMode": "price_on_request",
                "basePriceQar": None,
                "variants": [],
                "customizations": [
                    {
                        "id": "acrylic-topper",
                        "type": "acrylic_topper",
                        "label": {
                            "en": "Acrylic Calligraphy Topper",
                            "ar": "عبارة أكريليك بالخط العربي",
                        },
                        "allowsCustomText": True,
                    }
                ],
                "availability": "seasonal" if cat_id == "seasonal" else "made_to_order",
                "leadTimeHours": None,
                "attributes": {
                    "packagingLine": pkg,
                },
                "featured": featured,
                "sortWeight": sort_weight,
                "seo": {
                    "title": {
                        "en": f"{name_en} | Valor Qatar",
                        "ar": f"{name_ar} | فالور قطر",
                    },
                    "description": {
                        "en": short_en,
                        "ar": short_ar,
                    },
                },
                "whatsapp": {
                    "enabled": True,
                    "enquiryContext": {
                        "en": name_en,
                        "ar": name_ar,
                    },
                },
                "publicationStatus": "published",
                "verificationStatus": "unverified",
            }

            out_file = os.path.join(PRODUCTS_DIR, f"{pid}.json")
            with open(out_file, "w", encoding="utf-8") as fp:
                json.dump(product_doc, fp, ensure_ascii=False, indent=2)
            products.append(product_doc)

    # Save editorial media manifest
    editorial_manifest = []
    for idx, ed in enumerate(editorial_items):
        media_key = sanitize_key(f"editorial-{idx+1:02d}-{ed['prefix']}")
        editorial_manifest.append({
            "id": f"VLR-EDIT-{idx+1:02d}",
            "masterPath": ed["rel"],
            "mediaKey": media_key,
            "width": ed["width"],
            "height": ed["height"],
        })

    with open(os.path.join(DATA_DIR, "editorial-media.json"), "w", encoding="utf-8") as fp:
        json.dump(editorial_manifest, fp, ensure_ascii=False, indent=2)

    print(f"Consolidated {len(all_images)} shoppable images into {len(products)} parent product records.")
    print(f"Separated {len(editorial_manifest)} non-product editorial images into src/data/editorial-media.json.")
    for cat_id, cnt in sorted(cat_counters.items()):
        print(f"  {cat_id}: {cnt} products")

if __name__ == "__main__":
    main()
