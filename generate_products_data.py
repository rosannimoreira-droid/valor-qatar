import os
import json
import urllib.parse

categories_def = {
    '01_Chocolates_and_Pralines': {
        'id': 'chocolates',
        'name_en': 'Chocolates & Pralines',
        'name_ar': 'الشوكولاتة الفاخرة',
        'badge': 'Signature Cacao',
        'default_desc_en': 'Handcrafted luxury chocolates, artisanal Belgian pralines, wafer cigars, and decadent truffles presented in Valor\'s signature luxury boxes.',
        'default_desc_ar': 'شوكولاتة فاخرة مصنوعة بحرفية عالية، برالين بلجيكي، سجائر الويفر الهشة، وترافل فاخر في علب فالور الأيقونية.'
    },
    '02_Fresh_Flowers_and_Bouquets': {
        'id': 'flowers',
        'name_en': 'Fresh Floral Artistry',
        'name_ar': 'الزهور والباقات الطبيعية',
        'badge': 'Fresh Blooms',
        'default_desc_en': 'Bespoke hand-tied bouquets and vase arrangements crafted with premium imported Dutch Naomi roses, spray blooms, and exotic stems.',
        'default_desc_ar': 'باقات يد فاخرة وتنسيقات فازات زجاجية منتقاة بعناية من أجود ورود النعومي الهولندية والزهور النادرة.'
    },
    '03_Flowers_and_Chocolate_Combos': {
        'id': 'combos',
        'name_en': 'Flower & Chocolate Combos',
        'name_ar': 'تنسيقات الورد والشوكولاتة المدمجة',
        'badge': 'Best Seller',
        'default_desc_en': 'Architectural stepped stands and arched acrylic displays pairing fresh luxury roses with integrated confectionery drawers.',
        'default_desc_ar': 'تنسيقات معمارية مدرجة وصناديق أكريليك تجمع بين الورود الطبيعية الطازجة وأدراج الشوكولاتة الفاخرة.'
    },
    '04_Dates_and_Arabic_Sweets': {
        'id': 'dates_sweets',
        'name_en': 'Dates & Traditional Sweets',
        'name_ar': 'التمور المحشوة والحلويات الشرقية',
        'badge': 'Heritage Taste',
        'default_desc_en': 'Gourmet stuffed Medjool dates, golden traditional ma\'amoul, crispy baklava assortments, and delicate French sablés.',
        'default_desc_ar': 'تمور مجهول ملكية محشوة بالمكسرات المحمصة، معمول تمر فاخر، بقلاوة مقرمشة، وبسكويت السابليه الفرنسي.'
    },
    '05_Savory_and_Appetizers': {
        'id': 'savory',
        'name_en': 'Savory & Appetizers',
        'name_ar': 'الموالح والمقبلات الفاخرة',
        'badge': 'Majlis Favorite',
        'default_desc_en': 'Signature Warak Enab (vine leaves) pyramid towers, mini stuffed croissants, brioche sliders, and gourmet majlis canapés.',
        'default_desc_ar': 'أبراج ورق عنب ملكية مع الليمون والنعناع، ميني كرواسون محشو، بريوش سلايدرز، ومقبلات الضيافة الراقية للمجالس.'
    },
    '06_Custom_Cakes_and_Desserts': {
        'id': 'cakes',
        'name_en': 'Custom Celebration Cakes',
        'name_ar': 'كيك المناسبات والاحتفالات',
        'badge': 'Chef Creation',
        'default_desc_en': 'Artisan celebration cakes for graduations, themed milestone birthdays, fruit drip cakes, and fine dessert tartlets.',
        'default_desc_ar': 'كيك احتفالي فاخر بتصاميم التخرج، أعياد الميلاد المبتكرة، كيك الفواكه المقرمشة، وتارت الحلويات الفاخر.'
    },
    '07_Seasonal_and_Occasions': {
        'id': 'occasions',
        'name_en': 'Seasonal & Occasions',
        'name_ar': 'تشكيلات المناسبات الخاصة',
        'badge': 'Special Edition',
        'default_desc_en': 'Limited collections for Qatar National Day (18 Dec), Ramadan & Eid Mubarak, Hajj Mabrur, Newborn celebrations, and Summer Coolers.',
        'default_desc_ar': 'تشكيلات حصرية لليوم الوطني القطري (18 ديسمبر)، رمضان والعيد، الحج، استقبال المواليد، وبوكسات الصيف المنعشة.'
    },
    '08_Hospitality_Stands_and_Towers': {
        'id': 'towers',
        'name_en': 'Hospitality Stands & Towers',
        'name_ar': 'صواني وأبراج الضيافة الملكية',
        'badge': 'Grand Banquet',
        'default_desc_en': 'Monumental confectionery cone towers mounted on branded Valor pedestals, and multi-tier rotating banquet majlis stands.',
        'default_desc_ar': 'أهرامات حلويات وشوكولاتة ضخمة على قواعد فالور الأيقونية، وصواني تقديم متعددة الأدوار لمجالس الضيافة الكبرى.'
    },
    '09_Brand_and_Media': {
        'id': 'media',
        'name_en': 'Brand Heritage & Showroom',
        'name_ar': 'عالم فالور وتراث العلامة',
        'badge': 'Behind The Craft',
        'default_desc_en': 'Exclusive views of our master chocolatiers at work, our showroom hospitality, and bespoke event styling across Doha.',
        'default_desc_ar': 'نظرة حصرية على إبداعات شيف الشوكولاتة في ورش العمل، تجربة الضيافة في صالة العرض، وتنسيق الفعاليات الفاخرة بالدوحة.'
    }
}

# Special mappings for notable items with specific titles and tags
notable_items = {
    # Arabian Horse Boxes
    '617562485_17919031252877853_8604719080775988582_n.jpg': {
        'name_en': 'Arabian Thoroughbred Royal Sablés Box',
        'name_ar': 'صندوق الخيل العربي الملكي لبسكويت السابليه',
        'badge': 'Heritage Signature',
        'featured': True,
        'occasion': 'wedding_majlis',
        'desc_en': 'Slate-blue rigid box emblazoned with Arabian stallion artwork, filled with colorful pistachio, berry, and dark chocolate French sablés.',
        'desc_ar': 'صندوق فاخر باللون الأزرق الملكي يحمل لوحة الخيل العربي الأصيل، محشو بتشكيلة سابليه فرنسي بالفستق والتوت والشوكولاتة.'
    },
    '618962718_17934124976752559_3437149023775248598_n.jpg': {
        'name_en': 'Arabian Stallion Wafer Cigar Collection',
        'name_ar': 'صندوق الخيل العربي - سجائر الويفر الفاخرة',
        'badge': 'Best Seller',
        'featured': True,
        'occasion': 'luxury_gift',
        'desc_en': 'Signature equestrian box layered with crisp chocolate-dipped wafer rolls and pralines.',
        'desc_ar': 'صندوق الخيل العربي الشهير مع طبقات من سجائر الويفر المقرمشة المغطاة بالشوكولاتة الفاخرة.'
    },
    '620514668_18014417099684179_1896489376694691460_n.jpg': {
        'name_en': 'Arabian Horse Artisan Bonbon Vault',
        'name_ar': 'صندوق الخيل العربي للشوكولاتة والبرالين البلجيكي',
        'badge': 'Confectionery Masterpiece',
        'featured': True,
        'occasion': 'wedding_majlis',
        'desc_en': 'Dual-layer equestrian presentation box housing handcrafted bonbons with hazelnut, salted caramel, and pistachio fillings.',
        'desc_ar': 'صندوق الخيل الملكي ذو الطبقتين محشو بكرات الشوكولاتة والبرالين بنكهات البندق، الكراميل المملح، والفستق.'
    },
    # Warak Enab Towers
    '486375675_18072216851085652_1807756184562479589_n.jpg': {
        'name_en': 'Imperial Warak Enab Pyramid Tower',
        'name_ar': 'هرم ورق العنب الملكي الفاخر',
        'badge': 'Majlis Centerpiece',
        'featured': True,
        'occasion': 'wedding_majlis',
        'desc_en': 'Tower of tender vine leaves stuffed with seasoned aromatic rice, topped with pomegranate jewels, fresh mint, and lemon.',
        'desc_ar': 'برج هرمي مذهل من أوراق العنب الطازجة المحشوة بالأرز المتبل، متوج بدبس الرمان وحبات الرمان والليمون الطازج.'
    },
    # Combos
    '703676210_18114350830848346_1676090427846348751_n.jpg': {
        'name_en': 'Royal Stepped Stand - Naomi Roses & Chocolate Vault',
        'name_ar': 'منصة الضيافة المدرجة - ورود النعومي وصندوق الشوكولاتة',
        'badge': 'Signature Combo',
        'featured': True,
        'occasion': 'wedding_majlis',
        'desc_en': 'White stepped architectural stand pairing fresh imported red roses with a covered acrylic luxury chocolate tray with gold Arabic calligraphy.',
        'desc_ar': 'منصة راقية من مستويين تجمع بين فازة الورد الأحمر الهولندي وصينية شوكولاتة أكريليك مذهبة بعبارة خير ختام.'
    },
    '520262495_18082754756532454_6584282361669862719_n.jpg': {
        'name_en': 'Noir Luxury Stand - "Alhamdullilah" Red Rose & Praline Drawer',
        'name_ar': 'منصة نوار الملكية - الحمد لله على السلامة بالورد والشوكولاتة',
        'badge': 'Celebration Gift',
        'featured': True,
        'occasion': 'luxury_gift',
        'desc_en': 'Lustrous black acrylic stand crowned with Dutch crimson roses and an illuminated drawer of assorted truffles.',
        'desc_ar': 'منصة سوداء ملكية مزينة بزهور الورد الأحمر الطبيعي مع درج شوكولاتة مدمج وخط عربي ذهبي.'
    },
    # Flowers
    '621909096_18082205354463760_1883165260324589302_n.jpg': {
        'name_en': 'The Grand Imperial 100 Red Roses Bouquet',
        'name_ar': 'باقة الـ 100 وردة حمراء الملكية',
        'badge': 'Grand Statement',
        'featured': True,
        'occasion': 'luxury_gift',
        'desc_en': 'Monumental hand-tied bouquet of 100 premium Dutch Naomi red roses dressed in matte black luxury wrapping.',
        'desc_ar': 'باقة استثنائية من 100 وردة حمراء هولندية فاخرة مغلفة بأناقة بالورق الأسود المات الفاخر.'
    },
    '622391130_18069672275563832_8459591869893722700_n.jpg': {
        'name_en': 'Heart of Crimson & Snow Rose Bouquet',
        'name_ar': 'باقة قلب الورد الأحمر والأبيض الفاخرة',
        'badge': 'Romantic Masterpiece',
        'featured': True,
        'occasion': 'luxury_gift',
        'desc_en': 'Signature royal bouquet with red roses sculpted into a heart embraced by pure white Ecuadorian blooms.',
        'desc_ar': 'باقة ملكية بتنسيق فريد يتوسطه قلب من الورد الأحمر محاط بالورد الأبيض النقي بغلاف أزرق ملكي.'
    },
    # Occasions
    '625026040_18078082988607756_1594966627068565251_n.jpg': {
        'name_en': 'Qatar National Day Maroon & White Cone Tower',
        'name_ar': 'هرم اليوم الوطني القطري - الأدعم والأبيض',
        'badge': 'Qatar 18 Dec',
        'featured': True,
        'occasion': 'national_day',
        'desc_en': 'Signature patriotic cone tree in Qatar maroon and pure white topped with the national flag on a Valor pedestal.',
        'desc_ar': 'هرم شوكولاتة وحلويات بألوان العلم القطري العنابي والأبيض متوج بالراية الوطنية وقاعدة فالور الملكية.'
    },
    '478332624_18068350180848346_3785530466858521824_n.jpg': {
        'name_en': 'Ramadan Kareem Hexagonal Calligraphy Box',
        'name_ar': 'صندوق رمضان كريم السداسي الفاخر',
        'badge': 'Ramadan Special',
        'featured': True,
        'occasion': 'ramadan_eid',
        'desc_en': 'Hexagonal white gift box with gold calligraphy, filled with gourmet stuffed dates, ma\'amoul, and artisan truffles.',
        'desc_ar': 'صندوق سداسي فاخر بخط عربي مذهب "مبارك عليكم الشهر" محشو بالتمور المحشية والمعمول والترافل.'
    },
    '757212430_18120679564848346_445573617528363314_n.jpg': {
        'name_en': 'Summer Oasis Beach Cooler Box',
        'name_ar': 'بوكس "هلا بالصيف" المنعش للبحر والمسابح',
        'badge': 'Summer Gifting',
        'featured': True,
        'occasion': 'summer',
        'desc_en': 'Insulated thermal cooler packed with whole fresh drinking coconuts, tropical garnishes, and custom beach umbrellas.',
        'desc_ar': 'صندوق حافظ للبرودة بشعار "هلا بالصيف" مع جوز الهند الطبيعي والمشروبات الاستوائية المنعشة.'
    },
    # Cakes
    '622528760_18117374227606255_6952600027679598375_n.jpg': {
        'name_en': 'Class of 2024 Graduation Mortarboard Cake',
        'name_ar': 'كيك التخرج الملكي - دفعة 2024',
        'badge': 'Graduation Edition',
        'featured': True,
        'occasion': 'graduation',
        'desc_en': 'Tiered ivory celebration cake decorated with handcrafted mortarboard cap, gold diploma, and celebratory script.',
        'desc_ar': 'كيك تخرج راقٍ بقبعة التخرج الذهبية والشهادة مع خطوط مذهبة احتفالاً بخريجي 2024.'
    },
    '551870407_18088828945624795_5076127161559891040_n.jpg': {
        'name_en': 'Crown of Berries Red Mirror Glaze Cake',
        'name_ar': 'كيك الغلاساج الأحمر مع باقة ورود النعومي',
        'badge': 'Patisserie Haute',
        'featured': True,
        'occasion': 'luxury_gift',
        'desc_en': 'Mirror-glazed red berry cake served on a gold pedestal, accompanied by fresh Dutch crimson roses.',
        'desc_ar': 'كيك التوت اللامع ذو الغلاساج الأحمر على قاعدة ذهبية محاط بالورود الحمراء الطبيعية.'
    },
    # Towers
    '503579602_2299681947087095_7082903525139049405_n.jpg': {
        'name_en': 'Grand Monumental Sweets Cone Tower',
        'name_ar': 'البرج الهرمي الملكي الأيقوني للحلويات والشوكولاتة',
        'badge': 'Majlis Monument',
        'featured': True,
        'occasion': 'wedding_majlis',
        'desc_en': 'Over 80cm tall cone tower stacked with golden sweets and wrapped chocolates on an architectural Valor pedestal.',
        'desc_ar': 'برج هرمي بارتفاع يتجاوز 80 سم من أصناف الشوكولاتة والحلويات الذهبية على منصة فالور البيضاء.'
    }
}

items = []
item_counter = 1

for folder_name, cat_meta in categories_def.items():
    if not os.path.exists(folder_name):
        continue
    files = sorted([f for f in os.listdir(folder_name) if os.path.isfile(os.path.join(folder_name, f))])
    
    for idx, f in enumerate(files):
        item_id = f"VALOR-{cat_meta['id'].upper()[:4]}-{item_counter:03d}"
        item_counter += 1
        
        # Check if notable
        special = notable_items.get(f, {})
        
        rel_path = f"{folder_name}/{f}"
        
        # Occasion detection based on file characteristics or index
        occasion = special.get('occasion')
        if not occasion:
            if 'national' in f.lower() or 'qatar' in f.lower() or cat_meta['id'] == 'occasions' and idx in [0, 1, 2, 3]:
                occasion = 'national_day'
            elif cat_meta['id'] == 'occasions' and idx in [4, 5, 6, 7, 8, 9, 10]:
                occasion = 'ramadan_eid'
            elif 'grad' in f.lower() or cat_meta['id'] == 'cakes' and idx in [0, 1, 2, 3]:
                occasion = 'graduation'
            elif 'baby' in f.lower() or 'boy' in f.lower() or 'girl' in f.lower():
                occasion = 'newborn'
            elif cat_meta['id'] in ['savory', 'towers', 'combos']:
                occasion = 'wedding_majlis'
            else:
                occasion = 'luxury_gift'

        name_en = special.get('name_en', f"{cat_meta['name_en']} — Selection #{idx+1:02d}")
        name_ar = special.get('name_ar', f"{cat_meta['name_ar']} — تشكيلة #{idx+1:02d}")
        desc_en = special.get('desc_en', cat_meta['default_desc_en'])
        desc_ar = special.get('desc_ar', cat_meta['default_desc_ar'])
        badge = special.get('badge', cat_meta['badge'])
        featured = special.get('featured', idx < 2) # first couple of items in each category are featured
        
        items.append({
            'id': item_id,
            'name_en': name_en,
            'name_ar': name_ar,
            'category': cat_meta['id'],
            'category_name_en': cat_meta['name_en'],
            'category_name_ar': cat_meta['name_ar'],
            'occasion': occasion,
            'image': rel_path,
            'filename': f,
            'badge': badge,
            'featured': featured,
            'desc_en': desc_en,
            'desc_ar': desc_ar,
            'topper_available': cat_meta['id'] in ['combos', 'towers', 'cakes', 'occasions', 'chocolates'],
            'tags': [cat_meta['id'], occasion]
        })

print(f"Generated metadata for {len(items)} items across {len(categories_def)} categories.")

# Write to products.js
js_content = "/* Auto-generated Valor Qatar Product Showcase Data */\n"
js_content += "const VALOR_CATALOG = " + json.dumps(items, ensure_ascii=False, indent=2) + ";\n"

with open("products.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print("Saved products.js successfully.")
