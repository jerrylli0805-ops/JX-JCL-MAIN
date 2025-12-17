// 配置 Tailwind CSS
tailwind.config = { theme: { extend: { colors: { 'starlux-dark': '#0d1a26', 'starlux-gold': '#d9a74a' } } } }

// --- 核心資料結構 ---
const TITLES = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.'];
const MODES = { ORDER_MODE: 'ORDER MODE', SERVICE_MODE: 'SERVICE MODE' };
const TAGS = {
    'sitc': { icon: 'user', color: 'text-slate-400', label: 'SITC' },
    'titc': { icon: 'mountain', color: 'text-amber-400', label: 'TITC' },
    'aitc': { icon: 'compass', color: 'text-sky-400', label: 'AITC' },
    'ritc': { icon: 'CROWN', color: 'text-amber-400', label: 'RITC' },
   
   
    'vip': { icon: 'crown', color: 'text-yellow-400', label: 'VIP' },
    'birthday': { icon: 'cake', color: 'text-pink-400', label: 'Birthday' },
    'allergic': { icon: 'shield-alert', color: 'text-red-400', label: 'Allergy' },
    'help': { icon: 'hand', color: 'text-blue-400', label: 'Needs Assistance' }
};

    
// [NEW] ICAO SPML Codes
const ICAO_SPML_CODES = {
    'BBML': 'Baby Meal (BBML)',
    'CHML': 'Child Meal (CHML)',
    'VGML': 'Vegetarian Vegan Meal (VGML)',
    'VJML': 'Vegetarian Jain Meal (VJML)',
    'VOML': 'Vegetarian Oriental Meal (VOML)',
    'VLML': 'Vegetarian Lacto-Ovo Meal (VLML)',
    'RVML': 'Raw Vegetarian Meal (RVML)',
    'AVML': 'Vegetarian Hindu Meal (AVML)',
    'KSML': 'Kosher Meal (KSML)',
    'MOML': 'Muslim Meal (MOML)',
    'HNML': 'Hindu Non-Vegetarian Meal (HNML)',
    'DBML': 'Diabetic Meal (DBML)',
    'LCML': 'Low-Calorie Meal (LCML)',
    'LFML': 'Low-Fat Meal (LFML)',
    'GFML': 'Gluten-Free Meal (GFML)',
    'LSML': 'Low-Sodium Meal (LSML)',
    'NLML': 'Non-Lactose Meal (NLML)',
    'SFML': 'Seafood Meal (SFML)',
    'FPML': 'Fruit Platter Meal (FPML)',
    'KSML': 'Kosher Meal (KSML)',
    'MOML': 'Muslim Meal (MOML)',
    'HNML': 'Hindu Non-Vegetarian Meal (HNML)',
    'OTHER': 'Other (Please Specify)'
};

const MENUS = {
    // --- SS: Super Short (One Tray) ---
    'TPE-HKG': {
        meal_1: [
            { code: 'MPK1', name: 'Spiced Roast Pork Shoulder', chinese: '香料烤豬肩義式寬麵', dessert: 'ONE TRAY SERVICE' },
            { code: 'MFI1', name: 'Seared Halibut', chinese: '炙烤比目魚松露洋芋', dessert: 'ONE TRAY SERVICE' },
            { code: 'MSE1', name: 'STARLUX Edition', chinese: '星宇精選佳餚', dessert: 'ONE TRAY SERVICE' },
        ],
    }, // 這裡原本多了一個 }，已移除，並補上逗號

    // SS 航線沒有 appetizers，也沒有 meal_2
    'TPE-SHI': {
        meal_1: [
            { code: 'MFI1', name: 'Seared Halibut w/ Truffle Potatoes', chinese: '燻鮭魚法式三明治 ', dessert: 'ONE TRAY SERVICE' },
        ],
    }, // 這裡原本多了一個 }，已移除，並補上逗號

    'HKG-TPE': {
        meal_1: [
            { code: 'MSF1', name: 'Pan-Seared Scallop, Dried Scallop Egg White Fried Rice', chinese: '嫩煎干貝、瑤柱蛋白炒飯', dessert: 'ONE TRAY SERVICE' },
            { code: 'MCK1', name: 'Pan Fried Chicken, Truffle Cream Linguine', chinese: '香煎雞腿、奶油松露醬義大利寬麵', dessert: 'ONE TRAY SERVICE' },
            { code: 'MSE1', name: 'STARLUX Edition', chinese: '星宇精選佳餚', dessert: 'ONE TRAY SERVICE' },
        ],
    }, // 這裡原本多了一個 }，已移除，並補上逗號

    'TPE-OKA': {
        meal_1: [
            { code: 'MPK1', name: 'Spiced Roast Pork Shoulder', chinese: '香料烤豬肩義式寬麵', dessert: 'ONE TRAY SERVICE' },
            { code: 'MFI1', name: 'Seared Halibut w/ Truffle Potatoes', chinese: '炙烤比目魚松露洋芋', dessert: 'ONE TRAY SERVICE' },
            { code: 'MSE1', name: 'STARLUX Edition', chinese: '星宇精選佳餚', dessert: 'ONE TRAY SERVICE' },
        ],
    },

    // --- S: Short (Full Course, No Choice of App) ---
    'TPE-NRT': {
        meal_1: [
            { code: 'MHT1', name: 'Online Exclusive-Hutong Japanese Wagyu Rump Cap Steak', chinese: '胡同日本和牛臀肉上蓋牛排', dessert: 'HT-dessert' },
            { code: 'MPK1', name: 'Spiced Roast Pork Shoulder', chinese: '香料烤豬肩義式寬麵', dessert: 'INT dessert' },
            { code: 'MFI1', name: 'Seared Halibut w/ Truffle Potatoes', chinese: '炙烤比目魚松露洋芋', dessert: 'INT dessert' },
            { code: 'MBF1', name: 'Wafu Style Braised Beef Strips', chinese: '和風大跟燉牛肉條', dessert: 'ASIAN dessert' },
        ],
    },

    // --- M: Medium (Appetizer Choice) ---
    'TPE-SIN': {
        meal_1: [
            { code: 'MCK1', name: 'INT-Herb Roasted Pork Shoulder', chinese: '香料烤豬肩排', dessert: 'INT dessert' },
            { code: 'MSF1', name: 'INT-Grilled Halibut', chinese: '炙烤比目魚', dessert: 'INT dessert' },
            { code: 'MCF1', name: 'AISA-Abalone Congee', chinese: '鮑魚剝皮辣椒雞粥', dessert: 'AS dessert' },
            { code: 'MHT1', name: 'Online Exclusive-HUTONG Beef and chicken', chinese: '胡同燒烤牛小排雞腿排雙拼飯', dessert: 'HT dessert' },
        ],
        // [關鍵設定] M 航線加入前菜選項
        appetizers: [
            { code: 'SWS1', name: 'Cream of Mushroom Soup', chinese: '松露蘑菇濃湯' },
            { code: 'SCK1', name: 'Smoked Salmon Caesar Salad', chinese: '煙燻鮭魚凱薩沙拉' },
        ]
    },

    'TPE-CTS':{
        meal_1: [
            { code: 'MCK1', name: 'INT-Herb Roasted Pork Shoulder', chinese: '香料烤豬肩排', dessert: 'INT dessert' },
            { code: 'MSF1', name: 'INT-Grilled Halibut', chinese: '炙烤比目魚', dessert: 'INT dessert' },
            { code: 'MCF1', name: 'AISA-Abalone Congee', chinese: '鮑魚剝皮辣椒雞粥', dessert: 'AS dessert' },
            { code: 'MHT1', name: 'Online Exclusive-HUTONG Beef and chicken', chinese: '胡同燒烤牛小排雞腿排雙拼飯', dessert: 'HT dessert' },
        ],
        // [關鍵設定] M 航線加入前菜選項
        appetizers: [
            { code: 'SWS1', name: 'Cream of Mushroom Soup', chinese: '松露蘑菇濃湯' },
            { code: 'SCK1', name: 'Smoked Salmon Caesar Salad', chinese: '煙燻鮭魚凱薩沙拉' },
        ]
    },
    // --- L: Long (Appetizer Choice + 2nd Meal) ---
    'TPE-LAX': {
        meal_1: [
            { code: 'MBF1', name: 'Star Gourmet-Braised Short Rib, Cauliflower, Hibiscus, Lovage-ST', chinese: '慢燉牛小排·白花椰·洛神花·山當歸', dessert: 'Dessert' },
            { code: 'MFI1', name: 'Pan Seared Halibut, Fettuccine Pasta, Daikon Creamy Butter Sauce', chinese: '嫩煎比目魚,義式寬扁麵·奶油蘿蔔醬', dessert: 'Dessert' },
            { code: 'MCK1', name: 'Roasted Chicken Thigh, Mushroom Pearl Barley Rice, Garlic Butter Sauce', chinese: '爐烤雞腿排·香菇薏米飯·蒜香奶油醬', dessert: 'Dessert' },
            { code: 'MVG1', name: 'Sesame-Flavoured Lions Mane Mushroom Steak with Seasnal Vegetables', chinese: '麻香猴頭菇彩蔬鈺膳', dessert: 'Dessert' },
            { code: 'MLB1', name: 'Online Exclusive-Grilled Lobster with Truffle butter, Linguine', chinese: '松露奶油烤龍蝦.義大利寬扁麵', dessert: 'Dessert' },
            { code: 'MHT1', name: 'Online Exclusive-Hutong Japanese Wagyu Rump Cap Steak, Herb Poasted Potatos', chinese: '胡同日本和牛臀肉上蓋牛排，爐烤香料洋芋', dessert: 'Dessert' },

        ],
    
        // [關鍵設定] L 航線有第二餐
        meal_2: [ 
            { code: 'MCG2', name: 'Plain Congee with Pork Belly Roll with Capsicum, Stir Fried Mushroom with Broccoli, Pan Fried Chives Egg with Shrimp ', chinese: '清粥小菜', dessert: 'Fruit' },
            { code: 'MPE2', name: 'Cinnamon Brioche French Toast, Fresh Fruits, Mascarpone Cream Cheese, Maple Syrup', chinese: '法式肉桂布里歐吐司·新鮮水果馬斯卡彭鮮奶油楓糖漿', dessert: 'Fruit' },
            { code: 'MPK2', name: 'Quiche Lorraine, Frankfurter Sausage, Roasted Vegetables', chinese: '洛林鄉村鹹派·法蘭克福香腸·爐烤時蔬', dessert: 'Fruit' },
            { code: 'MSP2', name: 'Pan Seared Shrimp, Capsicum and Tomato Squid Ink Spagetti', chinese: '嫩煎鮮蝦·彩椒番茄墨魚義大利麵', dessert: 'Fruit' },
        ],  
        // [關鍵設定] L 航線也有前菜選項
        appetizers: [
            { code: 'MCG1', name: 'Star Gourmet-Nicoise Salad, Milkfish, Banyuls Vinaigrette', chinese: '尼斯沙拉·虱目魚,紅酒油醋汁' },
            { code: 'MCF1', name: 'Star Gourmet-Fruity Garden Waltz Salad + Creamy White Asparagus Soup, Garlic Crouton', chinese: '果漾繽紛圓舞曲' },
            { code: 'MFS1', name: 'Fruity Garden Waltz Salad', chinese: '果漾繽紛圓舞曲' },
            { code: 'MAS1', name: 'Creamy White Asparagus Soup, Garlic Crouton', chinese: '白蘆筍濃湯·蒜香麵包丁' },
        ]
    }
};
const AIRCRAFT_CONFIGS = {
    'A321neo': { 
        name: 'Airbus A321neo',
        gridCols: 'grid-template-columns: repeat(2, 1fr) 80px repeat(2, 1fr);', // 2+走道+2 (共5欄)
        rows: ['2', '3'],
        seatLetters: ['A', 'C', 'H', 'K'],
        // [新增] 指定座位所在的欄位
        colMap: { 'A': 1, 'C': 2, 'H': 4, 'K': 5 }
    },
    'A330-900neo': {
        name: 'Airbus A330-900neo',
        gridCols: 'grid-template-columns: 1fr 50px 1fr 1fr 50px 1fr;', // 1+走道+2+走道+1 (共6欄)
        rows: ['2','3','4','5','6','7','8'],
        seatLetters: ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'K'],
        // [新增] 即使 A330 座位交錯，我們將它們對應到視覺上的同一欄
        colMap: { 
            'A': 1, 'C': 1,  // 左窗
            'D': 3, 'E': 3,  // 中左
            'F': 4, 'G': 4,  // 中右
            'H': 6, 'K': 6   // 右窗
        }
    },
    'A350-900': { 
        name: 'Airbus A350-900',
        gridCols: 'grid-template-columns: 1fr 50px 1fr 1fr 50px 1fr;', // 1+走道+2+走道+1 (共6欄)
        rows: ['2','3','4','5','6','7', '8'],
        seatLetters: ['A', 'D', 'G', 'K'],
        // [新增] 指定座位所在的欄位
        colMap: { 'A': 1, 'D': 3, 'G': 4, 'K': 6 }
    },
    'A350-1000': {
        name: 'Airbus A350-1000',
        gridCols: 'grid-template-columns: 1fr 50px 1fr 1fr 50px 1fr;',
        rows: ['2','3','4','5','6','7','8', '9', '10', '11'],
        seatLetters: ['A', 'D', 'G', 'K'],
        // [新增] 指定座位所在的欄位
        colMap: { 'A': 1, 'D': 3, 'G': 4, 'K': 6 }
    }
};

const ROUTES = [
    // --- SS (Super Short) 超短程 ---
    // 包含 HKG, MFM, FUK (如您所述，這些是 SS)
    // 這些航線通常是 One Tray Service，沒有前菜選擇
    { id: 'TPE-HKG', name: 'Taipei - HKG/MFM/CRK/MNL (SS)', type: 'SS' },
    { id: 'TPE-OKA', name: 'Taipei - OKA/FUK/KMJ (SS)', type: 'SS' },
    { id: 'TPE-SHI', name: 'Taipei - SHI (USS)', type: 'SS' },
    

    // --- S (Short) 短程 ---
    // 包含 NRT, KIX, SDJ (共用 TPE-NRT 菜單)
    // 這些航線有完整的熱餐，但通常沒有 Soup/Salad 二選一
    { id: 'TPE-NRT', name: 'Taipei - NRT/KIX/SDJ/NGO/UKB (S)', type: 'S' },

    // --- M (Medium) 中程 ---
    // 包含 SIN, KUL, CGK
    // [新功能] 這些航線會有 Soup/Salad 的選擇
    { id: 'TPE-SIN', name: 'Taipei - SIN/KUL/CGK (M)', type: 'M' },
    { id: 'TPE-CTS', name: 'Taipei - CTS/HKD (M)', type: 'M' },
    // --- L (Long) 長程 ---
    // [新功能] 這些航線有 Soup/Salad + 第二餐
    { id: 'TPE-LAX', name: 'Taipei - LAX/SFO/SEA/ONT (L)', type: 'L' },
    { id: 'HKG-TPE', name: 'Hong Kong - Taipei (SS)', type: 'SS' },
];

// [MODIFIED] Replaced with user's new BEVERAGE_CATEGORIES
const BEVERAGE_CATEGORIES = {
    'WATER': [
        { full: 'Water', short: 'Water', type: 'ice' },
        { full: 'Sparkling Water', short: 'Spark.', type: 'ice' },
    ],
    'Specialty Cocktails': [
        { full: 'Sci-Fi Cosmos', short: 'Sci-Fi' },
        { full: 'Star Mojito', short: 'Mojito' },
        { full: 'Citrus Mist', short: 'C.Mist' },
        { full: 'Bi Luo Chun Galaxy', short: 'Galaxy' },
    ],
     'Cocktails': [
        { full: 'Screwdriver', short: 'Screwdriver' },
        { full: 'Gin Tonic', short: 'Gin Tonic' },
        { full: 'Martini', short: 'Martini' },
        { full: 'Whiskey Coke', short: 'Whiskey Coke' },
    ],
    'Mocktails (Non-alcoholic)': [
        { full: 'Apple Sparkling', short: 'Apple Sparkling', type:'Juice' },
        { full: 'Peach Sparkling', short: 'Peach Sparkling', type:'Juice' },
        { full: 'Orange Fizz', short: 'Orange Fizz', type:'Juice' },
        { full: 'Green Tea Special', short: 'Green Tea Special', type:'Juice' },
        { full: 'Virgin Mary', short: 'V.Mary' },
    ],
    'Champagne & White Wine': [
        { full: 'Laurent-Perrier La Cuvée', short: 'Champ.' },
        { full: 'Masi Masianco Pinot Grigio (Italy W.W.)', short: 'P.Grigio (Italy W.W.)' },
        { full: 'Albert Bichot Chablis 1er Cru (French W.W. )', short: 'Chablis (French W.W.)' },
    ],
    'Red Wine & Port': [
        { full: 'CHATEAU CROIZET-BAGES 2018(French R.W.)', short: 'F.R.Wine' },
        { full: 'Penfolds Koonunga Hill Shiraz Cabernet (Australian R.W.)', short: 'AUS.R.Wine' },
        { full: 'Dow\'s Fine Tawny Port', short: 'Port' },
    ],
    'Whisky': [
        { full: 'Talisker Storm Single Malt', short: 'Talisker', type: 'whisky' },
        { full: 'Kavalan Classic Single Malt', short: 'Kavalan', type: 'whisky' },
        { full: 'Jack Daniel\'s No.7', short: 'Jack D.', type: 'whisky' },
        { full: 'Mars Maltage "COSMO" Blend Malt Japanese Whisky', short: 'Mars Maltage "COSMO"', type: 'whisky' },
    ],
    'Spirits & Liqueurs': [
        { full: 'Rémy Martin X.O.', short: 'XO' , type: 'whisky'},
        { full: 'Baileys Irish Cream', short: 'Baileys' , type: 'whisky'},
        { full: 'Choya Top Grade Umeshu', short: 'Umeshu', type:'ice' , type: 'whisky'},
        { full: 'Bacardi Rum', short: 'Rum' , type: 'whisky'},
        { full: 'Grey Goose Vodka', short: 'Vodka', type: 'whisky' },
        { full: 'Hendrick\'s Gin', short: 'Gin' , type: 'whisky'},
    ],
    'Beer': [
        { full: 'Mikkeller IPA', short: 'Mikkeller', type: 'juice' },
        { full: 'Taiwan Gold Medal Beer', short: 'TW Beer', type: 'juice' },
        { full: 'Heineken Lager', short: 'Heineken', type: 'juice' },
        { full: 'Asahi Super Dry', short: 'Asahi', type: 'juice' },
    ],
    'Soda & Soft Dr.': [
        { full: 'Coke-Cola', short: 'Coke', type: 'soda_ice' },
        { full: 'Coke-Cola Zero', short: 'Coke Zero', type: 'soda_ice' }, 
        { full: 'Sprite', short: 'Sprite', type: 'soda_ice' },
        { full: 'Ginger Ale', short: 'Ginger Ale', type: 'soda_ice' },
        { full: 'Soda Water', short: 'Soda', type: 'soda_ice' },
        { full: 'Tonic Water', short: 'Tonic', type: 'soda_ice' },
        { full: 'Iced Green Tea', short: 'GT.', type: 'soda_ice' }, 
        { full: 'Calpis Water', short: 'Calpis', type: 'soda_ice' },
    ],
    'Juices & Milks': [
        { full: 'Apple Juice', short: 'AJ', type: 'juice' },
        { full: 'Orange Juice', short: 'OJ', type: 'juice' },
        { full: 'Peach Juice', short: 'PJ', type: 'juice' },
        { full: 'Tomato Juice', short: 'TJ', type: 'juice' },
        { full: 'Carrot Juice (VDS)', short: 'VDS', type: 'juice' },
        { full: 'Cold Brew Juice', short: 'Cold Brew Juice', type: 'Juice' },
        { full: 'Whole Milk', short: 'Milk', type: 'temp' },
        { full: 'Low Fat Milk', short: 'LF-Milk', type: 'temp' }, 
        { full: 'Oat Milk', short: 'Oat Milk', type: 'temp' },
    ],
    'Coffee, Teas & Others': [
        { full: 'Espresso', short: 'Espresso'},
        { full: 'Black Coffee', short: 'Black Coffee', type: 'temp' }, 
        { full: 'Latte', short: 'Latte', type: 'temp' }, 
        { full: 'Cappuccino', short: 'Cappuccino', type: 'temp' },
        { full: 'Decaffeinated Coffee', short: 'Decaff. Coffee', },
        { full: 'Baileys Coffee Latte', short: 'Baileys Latte', type: 'temp' },
        { full: 'Bi Luo Chun Tea', short: 'BLC Tea', type: 'temp' },
        { full: 'Dong Ding Oolong Tea', short: 'Oolong', type: 'temp' },
        { full: 'Sun Moon Assam Black Tea', short: 'Sun Moon Assam', type: 'temp' },
        { full: 'English Breakfast Tea', short: 'Breakfast', type: 'temp' },
        { full: 'Earl Grey Tea', short: 'Earl Grey', type: 'temp' },
        { full: 'Sleepy Tea', short: 'Sleepy Tea', type: 'temp' },
        { full: 'Apple & Elderflower Tea', short: 'Apple Eldr', type: 'temp' },
        { full: 'Hot Chocolate', short: 'Hot Coco' },
    ],
    'STARLUX Limited': [
        { full: 'Boba Tea Latte', short: 'Boba', type: 'soda_ice' },
        { full: 'Hojicha Latte', short: 'Hojicha', type: 'soda_ice' }, 
        { full: 'Hot Red Bean Water', short: 'Red Bean Water',},
    ],
};

// [新增] Galley View 按鈕事件
    const galleyBtn = document.getElementById('galley-view-btn');
    const closeGalleyBtn = document.getElementById('close-galley-btn');
    
    if(galleyBtn) {
        galleyBtn.addEventListener('click', renderGalleyDashboard);
    }
    if(closeGalleyBtn) {
        closeGalleyBtn.addEventListener('click', () => {
            document.getElementById('galley-modal').classList.add('hidden');
            document.getElementById('galley-modal').classList.remove('flex');
        });
    }

const ALL_BEVERAGES = Object.values(BEVERAGE_CATEGORIES).flat();

// [MODIFIED] Added beverages_2
const createInitialOrder = (id) => ({
    id: id, lastName: '', title: 'Mr.', status: 'PENDING', 
    isPreSelect: false, 
    isAppetizerPreSelect: false,
    isMeal2PreSelect: false,

    appetizerChoice: '', 
    appetizerServed: false, appetizerSkipped: false,
    
    // [新增] 第一餐額外步驟：湯品
    soupServed: false, soupSkipped: false,

    // 1st Meal
    mealCode: '', mealName: 'N/A', isSPML: false,
    mealServed: false, mealSkipped: false,
    dessertServed: false, dessertSkipped: false,
    
    // 2nd Meal
    mealCode_2: '', mealName_2: 'N/A', isSPML_2: false,
    mealServed_2: false, mealSkipped_2: false,
    
    // [新增] 第二餐額外步驟：優格 與 水果
    yogurtServed: false, yogurtSkipped: false,
    fruitServed: false, fruitSkipped: false,
    
    beverages: [],
    beverages_2: [], 
    
    delayUntil: 0, delayDuration: 0,
    serviceClosed: false,
    remark: '',
    tags: [],
    notificationShown: false,
});

let orders = [];
let mealInventory_1 = {}, mealInventory_2 = {}, flightNumber = '', currentSeatId = null, currentMode = MODES.ORDER_MODE;
let isEditingInventory = false;
let countdownInterval = null, serviceTarget = null, currentServiceItemIndex = null;
let activeMeals_1 = [], activeMeals_2 = [], activeAircraftConfig = {};
let appetizerInventory = {}; // 新增前菜庫存變數
let currentRoute = '', audioCtx;
let currentAircraftType = '';
let currentServicePhase = 'MEAL_1'; // 'MEAL_1' or 'MEAL_2'
let currentAisleView = 'ALL'; // [NEW] State for aisle view: 'ALL', 'L_SIDE', 'R_SIDE'
let beverageSummaryDoneState = {}; // [NEW] 紀錄飲料備餐完成狀態


// --- DOM 元素快取 ---
const appElements = {
    serviceModeActions: document.getElementById('service-mode-actions'),
    btnAddBeverage: document.getElementById('btn-add-beverage'),
    seatLayoutContainer: document.getElementById('seat-layout-container'), 
    seatLayout: document.getElementById('seat-layout'), 
    summarySection: document.getElementById('summary-section'),
    orderModal: document.getElementById('order-modal'), closeModalBtn: document.getElementById('close-modal-btn'),
    submitOrderBtn: document.getElementById('submit-order-btn'), modalSeatIdDisplay: document.getElementById('modal-seat-id'),
    mealOptionsContainer: document.getElementById('meal-options-container'),
    beverageOptionsContainer: document.getElementById('beverage-options-container'),
    summaryList: document.getElementById('summary-list'), emptySummaryMessage: document.getElementById('empty-summary-message'),
    inventoryModal: document.getElementById('inventory-modal'), inventoryInputsContainer: document.getElementById('inventory-inputs-container'),
    saveInventoryBtn: document.getElementById('save-inventory-btn'), 
    editInventoryBtn: document.getElementById('edit-inventory-btn'),
    inventoryModalTitle: document.getElementById('inventory-modal-title'), 
    flightNumberInput: document.getElementById('flight-number-input'),
    aircraftSelect: document.getElementById('aircraft-select'),
    routeSelect: document.getElementById('route-select'),
    aircraftDisplay: document.getElementById('aircraft-display'),
    aircraftTypeDisplay: document.getElementById('aircraft-type-display'),
    displayFlightNo: document.getElementById('display-flight-no'), displayMode: document.getElementById('display-mode'),
    modeToggleBtn: document.getElementById('mode-toggle-btn'), controlPanel: document.getElementById('control-panel'),
    lastNameInput: document.getElementById('last-name-input'), titleSelect: document.getElementById('title-select'),
    remarkInput: document.getElementById('remark-input'),
    remarkTagsContainer: document.getElementById('remark-tags-container'),
    serviceStatusRadios: document.querySelectorAll('input[name="service-status"]'), mealBeverageSelection: document.getElementById('meal-beverage-selection'),
    delayTimeInputContainer: document.getElementById('delay-time-input-container'), delayTimeSelect: document.getElementById('delay-time-select'),
    currentTimeDisplay: document.getElementById('current-time-display'), serviceActionModal: document.getElementById('service-action-modal'),
    messageDisplay: document.getElementById('message-display'), endFlightBtn: document.getElementById('end-flight-btn'),
    saveFlightBtn: document.getElementById('save-flight-btn'),
    loadFlightInput: document.getElementById('load-flight-input'),
    passengerInfoSection: document.getElementById('passenger-info-section'), serviceStatusSection: document.getElementById('service-status-section'),
    mealOptionsWrapper: document.getElementById('meal-options-wrapper'), 
    delayActionModal: document.getElementById('delay-action-modal'),
    delayModalSeatId: document.getElementById('delay-modal-seat-id'),
    dndActionModal: document.getElementById('dnd-action-modal'),
    dndModalSeatId: document.getElementById('dnd-modal-seat-id'),
    dessertDisplay: document.getElementById('dessert-display'), dessertType: document.getElementById('dessert-type'),
    closeServiceContainer: document.getElementById('close-service-container'),
    closeServiceBtn: document.getElementById('close-service-btn'),
    spmlSection: document.getElementById('spml-section'),
    spmlCheckbox: document.getElementById('spml-checkbox'),
    spmlInputContainer: document.getElementById('spml-input-container'),
    spmlSelect: document.getElementById('spml-select'),
    spmlInputOther: document.getElementById('spml-input-other'),
    swapSeatsModal: document.getElementById('swap-seats-modal'),
    openSwapModalBtn: document.getElementById('open-swap-modal-btn'),
    cancelSwapBtn: document.getElementById('cancel-swap-btn'),
    confirmSwapBtn: document.getElementById('confirm-swap-btn'),
    swapSeat1: document.getElementById('swap-seat-1'),
    swapSeat2: document.getElementById('swap-seat-2'),
    dueServiceAlertModal: document.getElementById('due-service-alert-modal'),
    dueServiceAlertMessage: document.getElementById('due-service-alert-message'),
    dismissDueServiceAlertBtn: document.getElementById('dismiss-due-service-alert-btn'),
    phaseToggleBtn: document.getElementById('phase-toggle-btn'),
    orderPhaseTabs: document.getElementById('order-phase-tabs'),
    orderTab1: document.getElementById('order-tab-1'),
    orderTab2: document.getElementById('order-tab-2'),
    orderTabContent1: document.getElementById('order-tab-content-1'),
    orderTabContent2: document.getElementById('order-tab-content-2'),
    spmlSection2: document.getElementById('spml-section-2'),
    spmlCheckbox2: document.getElementById('spml-checkbox-2'),
    spmlInputContainer2: document.getElementById('spml-input-container-2'),
    spmlSelect2: document.getElementById('spml-select-2'),
    spmlInputOther2: document.getElementById('spml-input-other-2'),
    mealOptionsWrapper2: document.getElementById('meal-options-wrapper-2'),
    mealOptionsContainer2: document.getElementById('meal-options-container-2'),
    beverageOptionsWrapper: document.getElementById('beverage-options-wrapper'),
    beverageOptionsWrapper2: document.getElementById('beverage-options-wrapper-2'),
    beverageOptionsContainer2: document.getElementById('beverage-options-container-2'),
    // [NEW] Aisle view buttons
    aisleViewControls: document.getElementById('aisle-view-controls'),
    viewLBtn: document.getElementById('view-l-btn'),
    viewAllBtn: document.getElementById('view-all-btn'),
    viewRBtn: document.getElementById('view-r-btn'),
    sideFilter: document.getElementById('side-filter'), // 新增這一行
};

// --- 輔助函數 ---
const showMessage = (text, isError = false) => {
    appElements.messageDisplay.textContent = text;
    appElements.messageDisplay.classList.remove('hidden', isError ? 'bg-green-600' : 'bg-red-600');
    appElements.messageDisplay.classList.add(isError ? 'bg-red-600' : 'bg-green-600');
    setTimeout(() => appElements.messageDisplay.classList.add('hidden'), 3000);
};
const getOrder = seatId => orders.find(order => order.id === seatId);
const getMeal1 = code => activeMeals_1.find(m => m.code === code);
const getMeal2 = code => activeMeals_2.find(m => m.code === code);
const getBeverageShort = full => (ALL_BEVERAGES.find(b => b.full === full) || {short: full}).short;

function playNotificationSound() {
    if (!audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
}

function showDueServiceAlert(seatId) {
    appElements.dueServiceAlertMessage.textContent = `Service for seat ${seatId} is now due.`;
    appElements.dueServiceAlertModal.classList.replace('hidden', 'flex');
    lucide.createIcons();
}

// --- 模式切換與倒數計時 ---
function toggleServiceMode() {
    if (currentMode === MODES.ORDER_MODE) {
        currentMode = MODES.SERVICE_MODE;
        currentServicePhase = 'MEAL_1'; // Always reset to Meal 1 when entering service mode
        appElements.modeToggleBtn.textContent = 'Switch to ORDER MODE';
        appElements.displayMode.textContent = 'SERVICE MODE (Meal 1)';
        appElements.displayMode.classList.replace('text-green-400', 'text-red-400');
        appElements.endFlightBtn.classList.remove('hidden');
        
        // Show phase toggle button only if 2nd meal exists
        if (activeMeals_2.length > 0) {
            appElements.phaseToggleBtn.classList.remove('hidden');
            appElements.phaseToggleBtn.textContent = 'Switch to MEAL 2 SERVICE';
        }

        orders.forEach(order => {
            if (order.status === 'DELAYED' && order.delayDuration > 0 && order.delayUntil === 0) {
                order.delayUntil = Date.now() + (order.delayDuration * 60000);
            }
        });
        startCountdown();
        showMessage('Switched to SERVICE MODE (Meal 1)', false);
    } else {
        currentMode = MODES.ORDER_MODE;
        appElements.modeToggleBtn.textContent = 'Switch to SERVICE MODE';
        appElements.displayMode.textContent = MODES.ORDER_MODE;
        appElements.displayMode.classList.replace('text-red-400', 'text-green-400');
        appElements.endFlightBtn.classList.add('hidden');
        appElements.phaseToggleBtn.classList.add('hidden'); // Hide phase button
        stopCountdown();
        showMessage('Switched to ORDER MODE', false);
    }
    renderSeatLayout();
}

// [新增] Render Galley Dashboard
function renderGalleyDashboard() {
    const countsM1 = {};
    const countsM2 = {};
    const countsApp = {};
    const countsSPML = {};
    let totalPax = 0;

    // 1. 統計數據
    orders.forEach(o => {
        // 只計算有效訂單
        if (['ORDERED', 'DELAYED', 'DND'].includes(o.status)) {
            totalPax++;

            // Meal 1
            if (o.isSPML) {
                const spmlCode = o.mealCode || 'SPML';
                countsSPML[spmlCode] = (countsSPML[spmlCode] || 0) + 1;
            } else if (o.mealCode && o.mealCode !== 'NO MEAL') {
                countsM1[o.mealCode] = (countsM1[o.mealCode] || 0) + 1;
            }

            // Meal 2 (如果有)
            if (activeMeals_2.length > 0) {
                if (o.isSPML_2) {
                    // SPML 2 通常跟 SPML 1 一樣，這裡簡化處理，如果不一樣可以另外統計
                } else if (o.mealCode_2 && o.mealCode_2 !== 'NO MEAL') {
                    countsM2[o.mealCode_2] = (countsM2[o.mealCode_2] || 0) + 1;
                }
            }

            // Appetizer (M/L/UL)
            if (o.appetizerChoice && o.appetizerChoice !== 'Standard') {
                countsApp[o.appetizerChoice] = (countsApp[o.appetizerChoice] || 0) + 1;
            }
        }
    });

    document.getElementById('galley-total-pax').textContent = totalPax;

    // Helper: 產生大字卡片
    const createCard = (code, count, colorClass, label = '') => {
        return `
            <div class="bg-gray-800 border border-gray-700 rounded-2xl p-4 flex flex-col items-center justify-center shadow-lg relative overflow-hidden group">
                <div class="absolute top-0 left-0 w-2 h-full ${colorClass}"></div>
                <span class="text-5xl font-black text-white mb-2 tracking-tighter group-hover:scale-110 transition-transform">${count}</span>
                <span class="text-lg font-bold text-gray-400">${code}</span>
                <span class="text-xs text-gray-500 truncate max-w-full text-center">${label}</span>
            </div>
        `;
    };

    // 2. 渲染 Meal 1
    const gridM1 = document.getElementById('galley-grid-m1');
    gridM1.innerHTML = '';
    activeMeals_1.forEach(m => {
        const count = countsM1[m.code] || 0;
        if (count > 0) gridM1.innerHTML += createCard(m.code, count, 'bg-amber-500', m.name);
    });

    // 3. 渲染 Meal 2 (如果有)
    const sectionM2 = document.getElementById('galley-section-m2');
    if (activeMeals_2.length > 0) {
        sectionM2.classList.remove('hidden');
        const gridM2 = document.getElementById('galley-grid-m2');
        gridM2.innerHTML = '';
        activeMeals_2.forEach(m => {
            const count = countsM2[m.code] || 0;
            if (count > 0) gridM2.innerHTML += createCard(m.code, count, 'bg-blue-500', m.name);
        });
    } else {
        sectionM2.classList.add('hidden');
    }

    // 4. 渲染 Appetizer (如果有)
    const sectionApp = document.getElementById('galley-section-app');
    const gridApp = document.getElementById('galley-grid-app');
    gridApp.innerHTML = '';
    
    // 檢查是否有前菜數據
    if (Object.keys(countsApp).length > 0) {
        sectionApp.classList.remove('hidden');
        for (const [code, count] of Object.entries(countsApp)) {
            // 嘗試找中文或全名
            const appData = (MENUS[currentRoute]?.appetizers || []).find(a => a.code === code);
            const name = appData ? appData.name : '';
            gridApp.innerHTML += createCard(code, count, 'bg-green-500', name);
        }
    } else {
        // 如果是 L/UL 都是 Standard 就不顯示，或是 M 航線沒人選
        sectionApp.classList.add('hidden'); 
    }

    // 5. 渲染 SPML
    const gridSPML = document.getElementById('galley-grid-spml');
    gridSPML.innerHTML = '';
    if (Object.keys(countsSPML).length > 0) {
        for (const [code, count] of Object.entries(countsSPML)) {
            gridSPML.innerHTML += createCard(code, count, 'bg-purple-500', 'Special Meal');
        }
    } else {
        gridSPML.innerHTML = `<div class="col-span-2 text-gray-600 text-center py-4 italic">No Special Meals</div>`;
    }

    // 開啟視窗
    document.getElementById('galley-modal').classList.remove('hidden');
    document.getElementById('galley-modal').classList.add('flex');
}

function toggleServicePhase() {
    if (currentServicePhase === 'MEAL_1') {
        currentServicePhase = 'MEAL_2';
        appElements.phaseToggleBtn.textContent = 'Switch to MEAL 1 SERVICE';
        appElements.displayMode.textContent = 'SERVICE MODE (Meal 2)';
        showMessage('Switched to Meal 2 Service Phase', false);
    } else {
        currentServicePhase = 'MEAL_1';
        appElements.phaseToggleBtn.textContent = 'Switch to MEAL 2 SERVICE';
        appElements.displayMode.textContent = 'SERVICE MODE (Meal 1)';
        showMessage('Switched to Meal 1 Service Phase', false);
    }
    renderSeatLayout();
}

function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(renderSeatLayout, 1000);
};
function stopCountdown() {
    if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
};

// --- [NEW] Aisle View Control Function ---
// [修正版] setAisleView - 確保會更新隱藏的 input 值
function setAisleView(view) {
    currentAisleView = view;
    
    // --- [關鍵修正] 強制更新 HTML 中的隱藏欄位，讓 renderSeatLayout 讀取到最新狀態 ---
    if (appElements.sideFilter) {
        appElements.sideFilter.value = view; 
    }
    
    // Add/remove class to body to trigger CSS font size changes
    document.body.classList.toggle('aisle-view-active', view !== 'ALL');
    
    // Update button active states (請注意這裡我把判斷條件簡化為 L, R, ALL)
    if (appElements.viewLBtn) appElements.viewLBtn.classList.toggle('active', view === 'L');
    if (appElements.viewAllBtn) appElements.viewAllBtn.classList.toggle('active', view === 'ALL');
    if (appElements.viewRBtn) appElements.viewRBtn.classList.toggle('active', view === 'R');
    
    // Re-render the layout
    renderSeatLayout();
}

// --- 渲染函數 ---
// [MODIFIED] renderSeatLayout (Core logic for aisle filtering)
// [完整更新版] renderSeatLayout
// [完整修正版] renderSeatLayout - 修復 A330 左右側顯示問題
// [完整修正版 v2] renderSeatLayout - 包含 Grid 座標動態校正
// [最終修正版 v3] renderSeatLayout - 完美支援 R-Side/L-Side 雙欄顯示
// [最終修正版 v4] renderSeatLayout - 修復飲料按鈕無效問題 (drink_1/drink_2)
// [最終修正版 v5] renderSeatLayout - 修復甜點 (Dessert) 顯示與按鈕
// [最終修正版 v7] renderSeatLayout - 完美支援 SPML 甜點邏輯 (非 SS 航線顯示按鈕)
function renderSeatLayout() {
    const filter = appElements.sideFilter ? appElements.sideFilter.value : 'ALL';
    
    appElements.seatLayout.innerHTML = '';
    if (!activeAircraftConfig || !activeAircraftConfig.rows) return;

    const routeInfo = ROUTES.find(r => r.id === currentRoute);
    const isMRoute = routeInfo && routeInfo.type === 'M';
    const isLongHaul = routeInfo && ['L', 'UL'].includes(routeInfo.type);
    // [新增] 判斷是否為 SS 航線
    const isSSRoute = routeInfo && routeInfo.type === 'SS';

    activeAircraftConfig.rows.forEach(row => {
        const rowContainer = document.createElement('div');
        rowContainer.className = 'grid gap-6 w-full mb-4';

        if (filter === 'ALL') {
            rowContainer.style.cssText = activeAircraftConfig.gridCols;
        } else {
            rowContainer.style.cssText = 'grid-template-columns: 1fr 1fr;';
        }

        activeAircraftConfig.seatLetters.forEach(letter => {
            if (filter === 'L' && !['A', 'C', 'D', 'E'].includes(letter)) return;
            if (filter === 'R' && !['F', 'G', 'H', 'K'].includes(letter)) return;

            const seatId = `${row}${letter}`;
            const order = getOrder(seatId);
            if (!order) return;

            let bgClass = 'bg-gray-700 border-gray-600 hover:bg-gray-600';
            if (order.serviceClosed) bgClass = 'bg-gray-800 opacity-60 border-gray-700';
            else if (order.status === 'ORDERED') bgClass = 'bg-green-700/80 border-green-500';
            else if (order.status === 'DND') bgClass = 'bg-red-700/80 border-red-500';
            else if (order.status === 'DELAYED') bgClass = 'bg-blue-700/80 border-blue-500';

            const seatCard = document.createElement('div');
            seatCard.className = `seat-card p-4 rounded-xl text-center shadow-lg border transition-all ${bgClass} flex flex-col gap-3`;
            seatCard.style.fontFamily = '"Microsoft JhengHei", "微軟正黑體", sans-serif';

            if (filter === 'ALL') {
                if (activeAircraftConfig.colMap && activeAircraftConfig.colMap[letter]) {
                    seatCard.style.gridColumn = activeAircraftConfig.colMap[letter];
                }
            } else {
                let targetCol = 1; 
                if (filter === 'L') { if (['D', 'E'].includes(letter)) targetCol = 2; } 
                else if (filter === 'R') { if (['H', 'K'].includes(letter)) targetCol = 2; }
                seatCard.style.gridColumn = targetCol;
            }

            const header = document.createElement('div');
            header.className = 'flex justify-between items-start';
            header.innerHTML = `<p class="text-3xl font-extrabold text-amber-300">${seatId}</p>`;
            
            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'flex gap-1 flex-wrap justify-end';
            if (order.tags) {
                order.tags.forEach(tagId => {
                    const tag = TAGS[tagId];
                    if (tag) tagsDiv.innerHTML += `<i data-lucide="${tag.icon}" class="w-5 h-5 ${tag.color}"></i>`;
                });
            }
            header.appendChild(tagsDiv);
            seatCard.appendChild(header);

            const nameEl = document.createElement('p');
            nameEl.className = 'text-lg font-bold text-white border-b border-white/10 pb-2 mb-1';
            nameEl.textContent = `${order.title || ''} ${order.lastName || 'VACANT'}`;
            seatCard.appendChild(nameEl);

            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'flex flex-col gap-2';

            if (order.status === 'ORDERED' && !order.serviceClosed) {
                if (currentServicePhase === 'MEAL_1') {
                    // Starter
                    const showStarter = isLongHaul || (isMRoute && order.appetizerChoice);
                    if (showStarter && !order.appetizerServed && !order.appetizerSkipped) {
                        const btn = document.createElement('div');
                        btn.className = 'service-item-btn';
                        btn.innerHTML = `<span>Starter: ${order.appetizerChoice || 'Standard'}</span>`;
                        btn.onclick = e => { e.stopPropagation(); handleServiceClick(e, seatId, 'appetizer'); };
                        itemsContainer.appendChild(btn);
                    }
                    // Soup
                    if (isLongHaul && !order.soupServed && !order.soupSkipped) {
                        const btn = document.createElement('div');
                        btn.className = 'service-item-btn';
                        btn.innerHTML = `<span>Soup</span>`;
                        btn.onclick = e => { e.stopPropagation(); handleServiceClick(e, seatId, 'soup'); };
                        itemsContainer.appendChild(btn);
                    }
                    // Main
                    if (order.mealCode && !order.mealServed && !order.mealSkipped) {
                        const btn = document.createElement('div');
                        btn.className = 'service-item-btn';
                        btn.innerHTML = `<span>Main: ${order.mealCode}</span>`;
                        btn.onclick = e => { e.stopPropagation(); handleServiceClick(e, seatId, 'meal_1'); };
                        itemsContainer.appendChild(btn);
                    }

                    // --- [關鍵修正] 甜點按鈕邏輯 ---
                    let showDessertBtn = false;
                    let dessertName = 'Dessert';

                    if (order.isSPML) {
                        // 如果是 SPML，只要不是 SS 航線，都要顯示甜點按鈕
                        if (!isSSRoute) {
                            showDessertBtn = true;
                            dessertName = 'Dessert'; // SPML 通用名稱
                        }
                    } else {
                        // 如果是一般餐，檢查菜單設定
                        const mData = getMeal1(order.mealCode);
                        if (mData && mData.dessert && mData.dessert !== 'ONE TRAY SERVICE') {
                            showDessertBtn = true;
                            dessertName = mData.dessert;
                        }
                    }

                    if (showDessertBtn && !order.dessertServed && !order.dessertSkipped) {
                        const btn = document.createElement('div');
                        btn.className = 'service-item-btn';
                        btn.innerHTML = `<span>${dessertName}</span>`;
                        btn.onclick = e => { e.stopPropagation(); handleServiceClick(e, seatId, 'dessert'); };
                        itemsContainer.appendChild(btn);
                    }
                    // ---------------------------------

                } else {
                    if (order.mealCode_2 && !order.mealServed_2 && !order.mealSkipped_2) {
                        const btn = document.createElement('div');
                        btn.className = 'service-item-btn';
                        btn.innerHTML = `<span>M2: ${order.mealCode_2}</span>`;
                        btn.onclick = e => { e.stopPropagation(); handleServiceClick(e, seatId, 'meal_2'); };
                        itemsContainer.appendChild(btn);
                    }
                }

                // Beverages
                const currentBevs = (currentServicePhase === 'MEAL_1') ? order.beverages : order.beverages_2;
                if (currentBevs && currentBevs.length > 0) {
                    currentBevs.forEach((bev, idx) => {
                        if (!bev.served && !bev.skipped) {
                            const btn = document.createElement('div');
                            btn.className = 'service-item-btn flex items-center justify-center gap-1';
                            const styleText = bev.style ? ` (${bev.style})` : '';
                            btn.innerHTML = `<i data-lucide="coffee" class="w-3 h-3"></i> ${bev.name}${styleText}`;
                            
                            const targetType = (currentServicePhase === 'MEAL_1') ? 'drink_1' : 'drink_2';
                            btn.onclick = e => { 
                                e.stopPropagation(); 
                                handleServiceClick(e, seatId, targetType, idx);
                            };
                            itemsContainer.appendChild(btn);
                        }
                    });
                }
            }
            seatCard.appendChild(itemsContainer);

            // Summary
            const summaryDiv = document.createElement('div');
            summaryDiv.className = 'text-sm text-left opacity-80 flex flex-col gap-1 mt-2 border-t border-white/5 pt-2';
            
            const currentBevs = (currentServicePhase === 'MEAL_1') ? order.beverages : order.beverages_2;
            if (currentBevs) {
                currentBevs.forEach(bev => {
                    if (bev.served || bev.skipped) {
                        const styleText = bev.style ? ` <span class="text-[10px] opacity-70">[${bev.style}]</span>` : '';
                        summaryDiv.innerHTML += `
                            <div class="line-through text-gray-400 italic">
                                ✓ ${bev.name}${styleText}
                            </div>`;
                    }
                });
            }

            if (order.appetizerServed) summaryDiv.innerHTML += `<div class="text-gray-400 text-xs">✓ Starter Done</div>`;
            if (order.soupServed) summaryDiv.innerHTML += `<div class="text-gray-400 text-xs">✓ Soup Done</div>`;
            if (order.mealServed) summaryDiv.innerHTML += `<div class="text-gray-400 text-xs font-bold">✓ Main: ${order.mealCode}</div>`;

            // --- [關鍵修正] 甜點 Summary ---
            if (order.dessertServed) {
                let dName = 'Dessert';
                if (!order.isSPML) {
                    const mData = getMeal1(order.mealCode);
                    if (mData) dName = mData.dessert;
                }
                summaryDiv.innerHTML += `<div class="text-gray-400 text-xs">✓ ${dName}</div>`;
            }
            // -----------------------------

            seatCard.appendChild(summaryDiv);
            seatCard.onclick = () => openOrderModal(seatId);
            
            rowContainer.appendChild(seatCard);
        });
        
        if (rowContainer.children.length > 0) {
            appElements.seatLayout.appendChild(rowContainer);
        }
    });

    lucide.createIcons();
    renderOrderSummaryAggregate();
}

// [FIXED] renderOrderSummaryAggregate - Splits beverages by Meal 1 and Meal 2
function renderOrderSummaryAggregate() {
    appElements.summaryList.innerHTML = '';
    const bevCounts = {};

    orders.forEach(o => {
        if (['ORDERED', 'DELAYED', 'DND'].includes(o.status)) {
            // 根據目前階段統計飲料
            const currentBevs = (currentServicePhase === 'MEAL_1') ? o.beverages : o.beverages_2;
            if (currentBevs) {
                currentBevs.forEach(b => {
                    if (!b.served && !b.skipped) { // 只統計還沒送出的
                        const key = b.name + (b.style ? ` (${b.style})` : '');
                        bevCounts[key] = (bevCounts[key] || 0) + 1;
                    }
                });
            }
        }
    });

    // 產生 HTML
    let bevHtml = `<div class="mt-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
        <h4 class="text-blue-400 font-bold mb-2">🥤 BEVERAGE TOTALS</h4>
        <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">`;
    
    const entries = Object.entries(bevCounts);
    if (entries.length === 0) bevHtml += `<p class="text-gray-400">No pending drinks.</p>`;
    else {
        entries.forEach(([name, count]) => {
            bevHtml += `<div class="flex justify-between border-b border-slate-600/50">
                          <span>${name}</span><span class="font-bold text-white">${count}</span>
                        </div>`;
        });
    }
    bevHtml += `</div></div>`;
    
    // 將此 bevHtml 插入到 summaryList 內容的最後
    appElements.summaryList.innerHTML += bevHtml;
}

// [NEW] Renders a service summary in the modal
   // [完整修正版] renderServiceSummary: 包含 Soup/Yogurt/Fruit 以及 飲料追蹤
function renderServiceSummary(order) {
    let html = '<div class="space-y-3 p-4 bg-gray-50 rounded-lg text-sm">';
    html += `<h4 class="text-lg font-semibold text-gray-800">Service Summary for ${order.id}</h4>`;
    
    // Helper: 產生狀態標籤
    const getStatusHtml = (served, skipped) => {
        const status = served ? 'Served' : (skipped ? 'Skipped' : 'Pending');
        const color = served ? 'text-green-600 font-bold' : (skipped ? 'text-yellow-600' : 'text-gray-500');
        const icon = served ? '✓' : (skipped ? '⊘' : '○');
        return `<span class="${color}">${icon} ${status}</span>`;
    };

    // --- 1st Meal Flow ---
    if (order.mealCode) {
        html += `<h5 class="font-bold text-amber-600 border-b pb-1 mt-3">1st Meal Service</h5>`;
        
        // 1. Starter
        if (order.appetizerChoice) {
            html += `<div class="flex justify-between py-1 border-b border-gray-100">
                        <span><strong>Starter:</strong> ${order.appetizerChoice}</span>
                        ${getStatusHtml(order.appetizerServed, order.appetizerSkipped)}
                     </div>`;
        }
        
        // 2. Soup (長班新增)
        html += `<div class="flex justify-between py-1 border-b border-gray-100">
                    <span><strong>Soup:</strong> Standard</span>
                    ${getStatusHtml(order.soupServed, order.soupSkipped)}
                 </div>`;

        // 3. Main
        html += `<div class="flex justify-between py-1 border-b border-gray-100">
                    <span><strong>Main:</strong> ${order.mealCode}</span>
                    ${getStatusHtml(order.mealServed, order.mealSkipped)}
                 </div>`;
        
        // 4. Beverages (第一餐飲料) - [補回]
        if (order.beverages && order.beverages.length > 0) {
            html += `<div class="py-1 border-b border-gray-100 bg-gray-50/50">
                        <span class="block font-semibold text-gray-600 mb-1">Bev 1:</span>
                        <ul class="pl-2 space-y-1">`;
            order.beverages.forEach(b => {
                html += `<li class="flex justify-between text-xs">
                            <span>${b.name} ${b.style ? `(${b.style})` : ''}</span>
                            ${getStatusHtml(b.served, b.skipped)}
                         </li>`;
            });
            html += `</ul></div>`;
        }

        // 5. Dessert
        const meal1 = getMeal1(order.mealCode);
        const isOneTray = (meal1 && meal1.dessert === 'ONE TRAY SERVICE'); // SS 航線通常沒有 Summary 但以防萬一
        if (!isOneTray) {
            html += `<div class="flex justify-between py-1 border-b border-gray-100">
                        <span><strong>Dessert:</strong> ${meal1 ? meal1.dessert : 'Dessert'}</span>
                        ${getStatusHtml(order.dessertServed, order.dessertSkipped)}
                     </div>`;
        }
    }

    // --- 2nd Meal Flow ---
    if (order.mealCode_2) {
        html += `<h5 class="font-bold text-blue-600 border-b pb-1 mt-4">2nd Meal Service</h5>`;
        
        // 判斷是否為粥 (Congee)
        const m2Code = order.mealCode_2;
        const isCongee = m2Code.includes('CON') || m2Code.includes('MCF') || (order.mealName_2 && order.mealName_2.toUpperCase().includes('CONGEE'));

        // 1. Yogurt (非粥品才顯示)
        if (!isCongee) {
            html += `<div class="flex justify-between py-1 border-b border-gray-100">
                        <span><strong>Yogurt:</strong> Standard</span>
                        ${getStatusHtml(order.yogurtServed, order.yogurtSkipped)}
                     </div>`;
        }

        // 2. Main (Meal 2)
        html += `<div class="flex justify-between py-1 border-b border-gray-100">
                    <span><strong>Main:</strong> ${order.mealCode_2}</span>
                    ${getStatusHtml(order.mealServed_2, order.mealSkipped_2)}
                 </div>`;

        // 3. Beverages (第二餐飲料) - [補回]
        if (order.beverages_2 && order.beverages_2.length > 0) {
            html += `<div class="py-1 border-b border-gray-100 bg-gray-50/50">
                        <span class="block font-semibold text-gray-600 mb-1">Bev 2:</span>
                        <ul class="pl-2 space-y-1">`;
            order.beverages_2.forEach(b => {
                html += `<li class="flex justify-between text-xs">
                            <span>${b.name} ${b.style ? `(${b.style})` : ''}</span>
                            ${getStatusHtml(b.served, b.skipped)}
                         </li>`;
            });
            html += `</ul></div>`;
        }

        // 4. Fruit (所有第二餐都有)
        html += `<div class="flex justify-between py-1 border-b border-gray-100">
                    <span><strong>Fruit:</strong> Standard</span>
                    ${getStatusHtml(order.fruitServed, order.fruitSkipped)}
                 </div>`;
    }
    
    html += '</div>';
    return html;
}

// --- Inventory and Modal Logic (Setup, Open, Close, Submit) ---
function setupInitialSelectors() {
    appElements.aircraftSelect.innerHTML = Object.keys(AIRCRAFT_CONFIGS).map(key => `<option value="${key}">${AIRCRAFT_CONFIGS[key].name}</option>`).join('');
    appElements.routeSelect.innerHTML = ROUTES.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
    
    // [NEW] Populate SPML dropdowns
    const spmlOptions = Object.keys(ICAO_SPML_CODES).map(code => `<option value="${code}">${ICAO_SPML_CODES[code]}</option>`).join('');
    appElements.spmlSelect.innerHTML = spmlOptions;
    appElements.spmlSelect2.innerHTML = spmlOptions;
}

// [MODIFIED] 根據航線類別 (SS, S, M, L, UL) 自動判斷欄位
// [修正版] setupInventoryInputs
function setupInventoryInputs() {
    const selectedRouteId = appElements.routeSelect.value;
    const routeInfo = ROUTES.find(r => r.id === selectedRouteId);
    
    // 取得該航線對應的菜單設定
    const routeMenus = MENUS[selectedRouteId] || { meal_1: [], meal_2: [], appetizers: [] };
    
    activeMeals_1 = routeMenus.meal_1 || [];
    activeMeals_2 = routeMenus.meal_2 || [];
    const activeAppetizers = routeMenus.appetizers || [];
    
    // 判斷功能需求：M/L/UL 航線需要前菜，L/UL 航線需要第二餐
    const needsAppetizer = routeInfo && ['M', 'L', 'UL'].includes(routeInfo.type);
    const needsSecondMeal = routeInfo && ['L', 'UL'].includes(routeInfo.type);

    // 清空主要容器
    appElements.inventoryInputsContainer.innerHTML = '';
    
    // --- 1. 前菜 (Appetizers / Soup / Salad) 庫存區塊 ---
    if (needsAppetizer && activeAppetizers.length > 0) {
        appElements.inventoryInputsContainer.innerHTML += `
            <h4 class="font-bold text-amber-600 mb-2 border-b-2 border-amber-100 pb-1 flex items-center gap-2">
                <i data-lucide="utensils" class="w-4 h-4"></i> Appetizers (Soup/Salad)
            </h4>`;
        
        activeAppetizers.forEach(appetizer => {
            const existingQty = (isEditingInventory && appetizerInventory) ? (appetizerInventory[appetizer.code] || 0) : 0;
            
            const div = document.createElement('div');
            div.className = 'flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg mb-2 shadow-sm';
            div.innerHTML = `
                <div class="flex-1 pr-4">
                    <div class="font-bold text-gray-800 text-sm mb-0.5">${appetizer.code}</div>
                    <div class="text-xs text-gray-500">${appetizer.name}</div>
                    <div class="text-[10px] text-gray-400 italic">${appetizer.chinese || ''}</div>
                </div>
                <input type="number" id="qty-appetizer-${appetizer.code}" 
                       class="w-16 py-1.5 px-2 border-2 border-gray-200 rounded-lg text-center font-bold text-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50" 
                       min="0" value="${existingQty}">
            `;
            appElements.inventoryInputsContainer.appendChild(div);
        });
    }

    // --- 2. 第一餐 (1st Meal) 庫存區塊 ---
    if (activeMeals_1.length > 0) {
        appElements.inventoryInputsContainer.innerHTML += `
            <h4 class="font-bold text-gray-600 mb-2 border-b-2 border-gray-100 pb-1 mt-6 flex items-center gap-2">
                <i data-lucide="flame" class="w-4 h-4"></i> 1st Meal Inventory
            </h4>`;
            
        activeMeals_1.forEach(meal => {
            const existingQty = (isEditingInventory && mealInventory_1) ? (mealInventory_1[meal.code] || 0) : 0;
            
            const div = document.createElement('div');
            div.className = 'flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg mb-2 shadow-sm';
            div.innerHTML = `
                <div class="flex-1 pr-4">
                    <div class="font-bold text-gray-800 text-sm mb-0.5">${meal.code}</div>
                    <div class="text-xs text-gray-500">${meal.name}</div>
                    <div class="text-[10px] text-gray-400 italic">${meal.chinese || ''}</div>
                </div>
                <input type="number" id="qty-1-${meal.code}" 
                       class="w-16 py-1.5 px-2 border-2 border-gray-200 rounded-lg text-center font-bold text-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50" 
                       min="0" value="${existingQty}">
            `;
            appElements.inventoryInputsContainer.appendChild(div);
        });
    }

    // --- 3. 第二餐 (2nd Meal) 庫存區塊 ---
    const container2 = document.getElementById('inventory-inputs-container-2');
    if (container2) {
        const showSecondMeal = needsSecondMeal && activeMeals_2.length > 0;
        container2.innerHTML = '';
        container2.classList.toggle('hidden', !showSecondMeal);
        
        if (showSecondMeal) {
            container2.innerHTML += `
                <h4 class="font-bold text-blue-600 mb-2 border-b-2 border-blue-100 pb-1 mt-6 flex items-center gap-2">
                    <i data-lucide="moon" class="w-4 h-4"></i> 2nd Meal Inventory
                </h4>`;
            
            activeMeals_2.forEach(meal => {
                const existingQty = (isEditingInventory && mealInventory_2) ? (mealInventory_2[meal.code] || 0) : 0;

                const div = document.createElement('div');
                div.className = 'flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg mb-2 shadow-sm';
                div.innerHTML = `
                    <div class="flex-1 pr-4">
                        <div class="font-bold text-gray-800 text-sm mb-0.5">${meal.code}</div>
                        <div class="text-xs text-gray-500">${meal.name}</div>
                        <div class="text-[10px] text-gray-400 italic">${meal.chinese || ''}</div>
                    </div>
                    <input type="number" id="qty-2-${meal.code}" 
                           class="w-16 py-1.5 px-2 border-2 border-gray-200 rounded-lg text-center font-bold text-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50" 
                           min="0" value="${existingQty}">
                `;
                container2.appendChild(div);
            });
        }
    }
    
    // 重新觸發 Lucide Icon 渲染
    lucide.createIcons();
    
    // 同步更新右側的「預選餐點」區域
    renderPreSelectInputs(); 
}
// [修正版] renderPreSelectInputs: 支援 M 航線前菜、L/UL 航線第二餐
function renderPreSelectInputs() {
    const grid = document.getElementById('preselect-grid');
    grid.innerHTML = '';
    
    const aircraftType = appElements.aircraftSelect.value;
    const config = AIRCRAFT_CONFIGS[aircraftType];
    const routeId = appElements.routeSelect.value;
    
    // 取得各類餐點資料
    const meals1 = MENUS[routeId]?.meal_1 || [];
    const meals2 = MENUS[routeId]?.meal_2 || []; 
    const appetizers = MENUS[routeId]?.appetizers || [];
    
    // 判斷航線特性
    const routeInfo = ROUTES.find(r => r.id === routeId);
    const isMRoute = routeInfo && routeInfo.type === 'M';
    const isLongHaul = routeInfo && ['L', 'UL'].includes(routeInfo.type);

    if (!config || !meals1.length) return;

    // 產生座位清單 (略過排除邏輯...)
    const seatIds = [];
    config.rows.forEach(row => {
        config.seatLetters.forEach(letter => {
            // [此處保留您的機型過濾邏輯]
            seatIds.push(`${row}${letter}`);
        });
    });

    seatIds.forEach(seatId => {
        const div = document.createElement('div');
        div.className = 'bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3 transition-all duration-300';
        div.id = `preselect-card-${seatId}`;
        
        // 建立一般餐選項
        let meal1Options = `<option value="">-- No Meal --</option>`;
        meals1.forEach(m => { meal1Options += `<option value="${m.code}">${m.code}</option>`; });

        // 建立 SPML 選項
        let spmlOptions = `<option value="">-- Select SPML --</option>`;
        Object.keys(ICAO_SPML_CODES).forEach(code => {
            spmlOptions += `<option value="${code}">${ICAO_SPML_CODES[code]}</option>`;
        });

        // 建立第二餐選項 (長程線專用)
        let meal2SectionHTML = '';
        if (isLongHaul && meals2.length > 0) {
            let meal2Options = `<option value="">-- No Meal 2 --</option>`;
            meals2.forEach(m => { meal2Options += `<option value="${m.code}">${m.code}</option>`; });
            meal2SectionHTML = `
                <div id="m2-container-${seatId}" class="pt-2 border-t border-dashed border-gray-100">
                    <label class="text-[10px] text-blue-600 font-bold uppercase block mb-1">2nd Meal Choice</label>
                    <select id="preselect-m2-${seatId}" class="w-full text-[12px] p-1.5 border border-blue-200 rounded bg-blue-50/30 outline-none">
                        ${meal2Options}
                    </select>
                </div>
            `;
        }

        // 建立前菜選項 (M 航線專用)
        let appSectionHTML = '';
        if (isMRoute && appetizers.length > 0) {
            let appOptions = `<option value="">-- No App. --</option>`;
            appetizers.forEach(a => { appOptions += `<option value="${a.code}">${a.code}</option>`; });
            appSectionHTML = `
                <div id="app-container-${seatId}" class="pt-2 border-t border-dashed border-gray-100">
                    <label class="text-[10px] text-amber-600 font-bold uppercase block mb-1">Pre-Select Appetizer</label>
                    <select id="preselect-app-${seatId}" class="w-full text-[12px] p-1.5 border border-amber-100 rounded bg-amber-50/30 outline-none">
                        ${appOptions}
                    </select>
                </div>
            `;
        }

        div.innerHTML = `
            <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-black px-2 py-0.5 rounded bg-amber-100 text-amber-800">${seatId}</span>
                <span class="text-[10px] text-gray-400 font-bold uppercase">Online Record</span>
            </div>
            <input type="text" id="preselect-name-${seatId}" class="w-full text-xs p-2 border border-gray-200 rounded uppercase font-medium" placeholder="LAST NAME">

            <div class="space-y-3">
                <div id="normal-meal-container-${seatId}">
                    <label class="text-[10px] text-gray-400 font-bold uppercase block mb-1">1st Meal Choice</label>
                    <select id="preselect-${seatId}" class="w-full text-[12px] p-1.5 border border-gray-300 rounded bg-gray-50 outline-none">
                        ${meal1Options}
                    </select>
                </div>
                
                ${meal2SectionHTML}
                ${appSectionHTML}

                <div id="spml-container-${seatId}" class="hidden">
                    <div class="flex justify-between items-center mb-1">
                        <label class="text-[10px] text-purple-600 font-bold uppercase block">Special Meal (SPML)</label>
                        <button type="button" onclick="toggleSPMLMode('${seatId}', false)" class="text-[9px] text-blue-500 underline">Back to Normal</button>
                    </div>
                    <select id="preselect-spml-${seatId}" class="w-full text-[12px] p-1.5 border border-purple-200 rounded bg-purple-50 text-purple-700 outline-none">
                        ${spmlOptions}
                    </select>
                </div>

                <button type="button" id="btn-spml-toggle-${seatId}" onclick="toggleSPMLMode('${seatId}', true)" 
                        class="w-full py-1.5 border border-purple-200 text-purple-600 text-[11px] font-bold rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-1">
                    <i data-lucide="star" class="w-3 h-3"></i> Switch to SPML
                </button>
            </div>
        `;
        grid.appendChild(div);
    });
    lucide.createIcons();
}

// 控制 SPML 切換的邏輯
window.toggleSPMLMode = function(seatId, isSPML) {
    const normalSelect = document.getElementById(`preselect-${seatId}`);
    const normalContainer = document.getElementById(`normal-meal-container-${seatId}`);
    const spmlContainer = document.getElementById(`spml-container-${seatId}`);
    const spmlSelect = document.getElementById(`preselect-spml-${seatId}`);
    const toggleBtn = document.getElementById(`btn-spml-toggle-${seatId}`);
    
    // 可選容器
    const m2Container = document.getElementById(`m2-container-${seatId}`);
    const appContainer = document.getElementById(`app-container-${seatId}`);
    const card = document.getElementById(`preselect-card-${seatId}`);

    if (isSPML) {
        normalSelect.value = ""; normalSelect.disabled = true;
        normalContainer.classList.add('opacity-40');
        spmlContainer.classList.remove('hidden');
        toggleBtn.classList.add('hidden');
        if (m2Container) m2Container.classList.add('hidden');
        if (appContainer) appContainer.classList.add('hidden');
        card.classList.add('ring-1', 'ring-purple-200', 'bg-purple-50/20');
    } else {
        spmlSelect.value = ""; normalSelect.disabled = false;
        normalContainer.classList.remove('opacity-40');
        spmlContainer.classList.add('hidden');
        toggleBtn.classList.remove('hidden');
        if (m2Container) m2Container.classList.remove('hidden');
        if (appContainer) appContainer.classList.remove('hidden');
        card.classList.remove('ring-1', 'ring-purple-200', 'bg-purple-50/20');
    }
};
// [MODIFIED] handleSaveInventory
function handleSaveInventory() {
    flightNumber = appElements.flightNumberInput.value.trim().toUpperCase();
    currentAircraftType = appElements.aircraftSelect.value;
    currentRoute = appElements.routeSelect.value;

    if (!flightNumber) { showMessage('Flight Number is required.', true); return; }
    
    activeAircraftConfig = AIRCRAFT_CONFIGS[currentAircraftType];
    const routeMenus = MENUS[currentRoute] || { meal_1: [], meal_2: [] };
    activeMeals_1 = routeMenus.meal_1 || [];
    activeMeals_2 = routeMenus.meal_2 || [];
    
    appElements.aircraftTypeDisplay.textContent = `Business Class Meal & Beverage Selection (${activeAircraftConfig.name})`;

    if (activeAircraftConfig.seatLetters.length > 2) {
        appElements.aisleViewControls.classList.remove('hidden');
    } else {
        appElements.aisleViewControls.classList.add('hidden');
    }
    setAisleView('ALL');

    let seatIds = [];
    activeAircraftConfig.rows.forEach(row => {
        activeAircraftConfig.seatLetters.forEach(letter => {
             if (currentAircraftType === 'A350-900' && row === '8' && (letter === 'A' || letter === 'K')) return;
             if (currentAircraftType === 'A330-900neo') {
                const isEven = parseInt(row) % 2 === 0;
                if (isEven && !['A','E','F','K'].includes(letter)) return;
                if (!isEven && !['C','D','G','H'].includes(letter)) return;
             }
             seatIds.push(`${row}${letter}`);
        });
    });

    // 初始化訂單
    orders = seatIds.map(createInitialOrder);

    // 處理預選資料讀取
    orders.forEach(order => {
        const nameEl = document.getElementById(`preselect-name-${order.id}`);
        const mainMealEl = document.getElementById(`preselect-${order.id}`);
        const spmlEl = document.getElementById(`preselect-spml-${order.id}`);
        const appSelectEl = document.getElementById(`preselect-app-${order.id}`);
        const m2SelectEl = document.getElementById(`preselect-m2-${order.id}`);
        // 1. 儲存姓名
        if (nameEl && nameEl.value.trim()) {
            order.lastName = nameEl.value.trim().toUpperCase();
            order.status = 'ORDERED';
        }

        // 2. 儲存餐點 (SPML 優先)
        if (spmlEl && spmlEl.value) {
            order.status = 'ORDERED';
            order.isSPML = true;
            order.mealCode = spmlEl.value;
            order.mealName = 'Special Meal';
            
            // 長程線連動
            if (activeMeals_2.length > 0) {
                order.isSPML_2 = true;
                order.mealCode_2 = spmlEl.value;
                order.mealName_2 = 'Special Meal';
            }
        } else if (mainMealEl && mainMealEl.value) {
            order.status = 'ORDERED';
            order.mealCode = mainMealEl.value;
            const mealData = activeMeals_1.find(m => m.code === mainMealEl.value);
            order.mealName = mealData ? mealData.name : 'N/A';
        }

        // 3. 儲存預選前菜 (M 航線)
        if (appSelectEl && appSelectEl.value) {
            order.appetizerChoice = appSelectEl.value;
            order.isAppetizerPreSelect = true;
            if (order.status === 'PENDING') order.status = 'ORDERED';
        }
        if (m2SelectEl && m2SelectEl.value && !order.isSPML) {
            order.mealCode_2 = m2SelectEl.value;
            const mealData = activeMeals_2.find(m => m.code === m2SelectEl.value);
            order.mealName_2 = mealData ? mealData.name : 'N/A';
            order.isMeal2PreSelect = true; // 標記為預選
    if (order.status === 'PENDING') order.status = 'ORDERED';
}
    });

    // 處理庫存讀取
    let allValid = true;
    mealInventory_1 = {};
    activeMeals_1.forEach(meal => {
        const input = document.getElementById(`qty-1-${meal.code}`);
        const value = parseInt(input.value, 10);
        if (isNaN(value) || value < 0) allValid = false;
        mealInventory_1[meal.code] = value;
    });
    
    mealInventory_2 = {};
    activeMeals_2.forEach(meal => {
        const input = document.getElementById(`qty-2-${meal.code}`);
        const value = parseInt(input.value, 10);
        if (isNaN(value) || value < 0) allValid = false;
        mealInventory_2[meal.code] = value;
    });

    // 儲存前菜庫存
    appetizerInventory = {};
    const routeMenusApp = MENUS[currentRoute] || { appetizers: [] };
    const activeAppetizers = routeMenusApp.appetizers || [];
    activeAppetizers.forEach(app => {
        const input = document.getElementById(`qty-appetizer-${app.code}`);
        if (input) {
            const value = parseInt(input.value, 10);
            if (isNaN(value) || value < 0) allValid = false;
            appetizerInventory[app.code] = value;
        }
    });

    if (allValid) {
        appElements.displayFlightNo.textContent = flightNumber;
        appElements.inventoryModal.classList.replace('flex', 'hidden');
        if (appElements.editInventoryBtn) appElements.editInventoryBtn.classList.remove('hidden');
        ['seatLayoutContainer', 'summarySection', 'controlPanel'].forEach(el => appElements[el].classList.remove('hidden'));
        if (!audioCtx) {
            try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
        }
        renderSeatLayout();
        showMessage('Setup Confirmed! System ready.', false);
    } else { 
        showMessage("Invalid quantities. Check numbers.", true); 
    }
}

function toggleMealBeverageVisibility() {
    const selectedStatus = document.querySelector('input[name="service-status"]:checked').value;
    const isMealStatus = selectedStatus === 'ORDERED' || selectedStatus === 'DELAYED' || selectedStatus === 'DND';
    appElements.mealBeverageSelection.classList.toggle('hidden', !isMealStatus);
    appElements.delayTimeInputContainer.classList.toggle('hidden', selectedStatus !== 'DELAYED');
}

function setupMealOptions(container, mealList, inventory, radioName, currentMealCode, orderStatus) {
    container.innerHTML = '';
    mealList.forEach(meal => {
        const totalOrdered = orders.filter(o => 
            // 如果是第一餐：檢查 mealCode 且 不是第一餐預選 (!o.isPreSelect)
            (radioName === 'meal_1' && o.mealCode === meal.code && (o.status === 'ORDERED' || o.status === 'DELAYED') && !o.isSPML && !o.isPreSelect) ||
            
            // [修正] 如果是第二餐：檢查 mealCode_2 且 不是第二餐預選 (!o.isMeal2PreSelect)
            (radioName === 'meal_2' && o.mealCode_2 === meal.code && (o.status === 'ORDERED' || o.status === 'DELAYED') && !o.isSPML_2 && !o.isMeal2PreSelect)
        ).length;
        
        const remaining = (inventory[meal.code] || 0) - totalOrdered;
        const isCurrentlySelected = meal.code === currentMealCode;
        const isDisabled = remaining <= 0 && !isCurrentlySelected;
        const label = document.createElement('label');
        label.className = `flex items-center p-3 border rounded-lg transition cursor-pointer shadow-sm ${isDisabled ? 'disabled-option bg-gray-100' : 'hover:bg-gray-50'}`;
        label.innerHTML = `
            <input type="radio" name="${radioName}" value="${meal.code}" class="form-radio h-5 w-5 text-amber-500" ${isDisabled ? 'disabled' : ''}>
            <span class="ml-3 font-medium ${isDisabled ? 'text-gray-500' : 'text-gray-800'}">
                ${meal.code} - ${meal.name} (Qty: <span class="font-bold ${remaining <= 0 && !isCurrentlySelected ? 'text-red-500' : 'text-green-600'}">${remaining}</span>)
                <span class="text-xs text-gray-500 block">(${meal.chinese})</span>
            </span>`;
        container.appendChild(label);
    });

    const noMealLabel = document.createElement('label');
    noMealLabel.className = 'flex items-center p-3 border rounded-lg transition cursor-pointer shadow-sm hover:bg-gray-50';
    noMealLabel.innerHTML = `
        <input type="radio" name="${radioName}" value="NO MEAL" class="form-radio h-5 w-5 text-gray-500">
        <span class="ml-3 font-medium text-gray-800">NO MEAL (不需主餐)</span>
    `;
    container.appendChild(noMealLabel);
    if (currentMealCode === 'NO MEAL') {
        noMealLabel.querySelector('input').checked = true;
    }
    const existingRadio = container.querySelector(`input[name="${radioName}"][value="${currentMealCode}"]`);
    if (existingRadio) {
        existingRadio.checked = true;
    }
}

// [MODIFIED] setupBeverageOptions
function setupBeverageOptions(container, selectedBeverages = [], checkboxName = 'beverage') {
    container.innerHTML = '';
    
    // 定義兩大分類
    const groups = {
        nonAlcoholic: ['WATER', 'Mocktails (Non-alcoholic)', 'Soda & Soft Dr.', 'Juices & Milks', 'Coffee, Teas & Others', 'STARLUX Limited'],
        alcoholic: ['Specialty Cocktails', 'Cocktails', 'Champagne & White Wine', 'Red Wine & Port', 'Whisky', 'Spirits & Liqueurs', 'Beer']
    };

    // 建立大容器
    const mainDiv = document.createElement('div');
    mainDiv.className = 'bev-main-container';

    // 渲染函數：處理單一分類群組
    const renderGroup = (title, categoryList, icon) => {
        const groupWrapper = document.createElement('div');
        groupWrapper.innerHTML = `<div class="bev-group-title"><i data-lucide="${icon}"></i> ${title}</div>`;
        
        categoryList.forEach(category => {
            if (!BEVERAGE_CATEGORIES[category]) return;

            const groupDiv = document.createElement('div');
            groupDiv.className = 'bev-category-group';

            const trigger = document.createElement('button');
            trigger.className = 'bev-category-trigger';
            const selectedCount = BEVERAGE_CATEGORIES[category].filter(bev => 
                selectedBeverages.some(sb => sb.name === bev.full)
            ).length;
            
            trigger.innerHTML = `
                <span class="flex items-center gap-2 text-sm font-bold">
                    ${category} 
                    ${selectedCount > 0 ? `<span class="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full">${selectedCount}</span>` : ''}
                </span>
                <i data-lucide="chevron-down" class="w-4 h-4"></i>
            `;

            const panel = document.createElement('div');
            panel.className = 'bev-content-panel';
            const itemsGrid = document.createElement('div');
            itemsGrid.className = 'grid grid-cols-1 gap-2 p-1'; // 改為單欄以適應並列後的寬度

            BEVERAGE_CATEGORIES[category].forEach(bev => {
                const existing = selectedBeverages.find(b => b.name === bev.full);
                const isChecked = !!existing;
                const card = document.createElement('div');
                card.className = `beverage-item-card ${isChecked ? 'ring-1 ring-amber-500 bg-amber-50' : 'bg-white'}`;
                card.innerHTML = `
                    <label class="flex items-center cursor-pointer select-none p-1">
                        <input type="checkbox" name="${checkboxName}" value="${bev.full}" 
                               class="form-checkbox text-amber-600 rounded" ${isChecked ? 'checked' : ''}>
                        <div class="ml-3">
                            <span class="font-bold block text-gray-800">${bev.full}</span>
                        </div>
                    </label>
                `;
                // ... (保留原本的 styleSelect 邏輯) ...
                itemsGrid.appendChild(card);
            });

            panel.appendChild(itemsGrid);
            groupDiv.appendChild(trigger);
            groupDiv.appendChild(panel);
            
            trigger.onclick = (e) => {
                e.preventDefault();
                const isOpen = panel.classList.contains('open');
                panel.classList.toggle('open', !isOpen);
                trigger.classList.toggle('active', !isOpen);
                trigger.querySelector('[data-lucide="chevron-down"]').style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
            };

            groupWrapper.appendChild(groupDiv);
        });
        return groupWrapper;
    };

    // 分別加入非酒精與酒精區域
    mainDiv.appendChild(renderGroup('Soft Drinks & Coffee', groups.nonAlcoholic, 'coffee'));
    mainDiv.appendChild(renderGroup('Wine & Cocktails', groups.alcoholic, 'wine'));

    container.appendChild(mainDiv);
    lucide.createIcons();
}

// [MODIFIED] openOrderModal
// [最終修正版 v8] openOrderModal - 修正 Close Service 邏輯 (包含 SPML 甜點檢查)
function openOrderModal(seatId) {
    currentSeatId = seatId;
    const order = getOrder(seatId);
    appElements.modalSeatIdDisplay.textContent = seatId;
    appElements.orderModal.classList.replace('hidden', 'flex');
    appElements.orderModal.querySelector('.bg-white').scrollTop = 0;
    
    const show = (el, visible) => el.classList.toggle('hidden', !visible);
    
    // 取得航線資訊
    const routeInfo = ROUTES.find(r => r.id === currentRoute);
    const isSSRoute = routeInfo && routeInfo.type === 'SS';
    const isLongHaul = activeMeals_2.length > 0;

    appElements.orderTabContent1.innerHTML = '';
    appElements.orderTabContent2.innerHTML = '';
    
    // (Restoring elements...)
    appElements.orderTabContent1.appendChild(appElements.spmlSection);
    appElements.orderTabContent1.appendChild(appElements.mealOptionsWrapper);
    appElements.orderTabContent1.appendChild(appElements.dessertDisplay);
    appElements.orderTabContent1.appendChild(appElements.beverageOptionsWrapper);
    appElements.orderTabContent2.appendChild(appElements.spmlSection2);
    appElements.orderTabContent2.appendChild(appElements.mealOptionsWrapper2);
    appElements.orderTabContent2.appendChild(appElements.beverageOptionsWrapper2);

    const isFullOrderMode = currentMode === MODES.ORDER_MODE || order.status === 'DND' || order.status === 'PENDING';
    
    // --- [邏輯修正] 檢查服務是否完成 ---
    const isMeal1Done = order.mealServed || order.mealSkipped;
    const allBeveragesDone = order.beverages.filter(b => !b.served && !b.skipped).length === 0;
    
    const isMeal2Done = order.mealServed_2 || order.mealSkipped_2 || !isLongHaul;
    const allBeveragesDone_2 = (order.beverages_2 || []).filter(b => !b.served && !b.skipped).length === 0;
    
    // 判定是否應該有甜點按鈕
    let hasSeparateDessertButton = false;
    if (order.isSPML) {
        // SPML: 非 SS 航線就有按鈕
        hasSeparateDessertButton = !isSSRoute;
    } else {
        // 一般餐: 檢查菜單設定
        const m = getMeal1(order.mealCode);
        hasSeparateDessertButton = m && m.dessert && m.dessert !== 'ONE TRAY SERVICE';
    }
    
    // 如果應該有按鈕，就檢查是否已完成
    const isDessertDone = (order.dessertServed || order.dessertSkipped) || !hasSeparateDessertButton;
    
    const isServiceComplete = isMeal1Done && isMeal2Done && allBeveragesDone && allBeveragesDone_2 && isDessertDone && order.status !== 'PENDING';
    // ------------------------------------
    
    show(appElements.passengerInfoSection, isFullOrderMode);
    show(appElements.serviceStatusSection, isFullOrderMode);
    show(appElements.closeServiceContainer, !isFullOrderMode && isServiceComplete && !order.serviceClosed);
    show(appElements.mealBeverageSelection, true);

    if (!isFullOrderMode && isServiceComplete) {
        show(appElements.orderPhaseTabs, false);
        show(appElements.orderTabContent1, true);
        appElements.orderTabContent1.innerHTML = renderServiceSummary(order);
        show(appElements.orderTabContent2, false);
        show(appElements.submitOrderBtn, false);

    } else if (!isFullOrderMode && !isServiceComplete) {
        show(appElements.orderPhaseTabs, false);
        show(appElements.orderTabContent1, true);
        show(appElements.orderTabContent2, false);
        appElements.orderTabContent1.innerHTML = renderServiceSummary(order);
        show(appElements.submitOrderBtn, false);
        show(appElements.serviceModeActions, true);
        appElements.serviceModeActions.classList.replace('hidden', 'grid');

    } else {
        // (Order Mode setup - 保持原本程式碼)
        show(appElements.orderPhaseTabs, isLongHaul);
        appElements.orderTab1.classList.add('active');
        appElements.orderTab2.classList.remove('active');
        show(appElements.orderTabContent1, true);
        show(appElements.orderTabContent2, false);

        appElements.remarkInput.value = order.remark || '';
        
        appElements.spmlCheckbox.checked = order.isSPML;
        show(appElements.spmlInputContainer, order.isSPML);
        show(appElements.mealOptionsWrapper, !order.isSPML);
        if(order.isSPML) {
            const spmlCode = order.mealCode;
            if(ICAO_SPML_CODES[spmlCode]) {
                appElements.spmlSelect.value = spmlCode;
                show(appElements.spmlInputOther, false);
            } else {
                appElements.spmlSelect.value = 'OTHER';
                appElements.spmlInputOther.value = spmlCode;
                show(appElements.spmlInputOther, true);
            }
        } else {
            appElements.spmlSelect.value = 'AVML'; 
            show(appElements.spmlInputOther, false);
        }

        appElements.spmlCheckbox2.checked = order.isSPML_2;
        show(appElements.spmlInputContainer2, order.isSPML_2);
        show(appElements.mealOptionsWrapper2, !order.isSPML_2);
        if(order.isSPML_2) {
            const spmlCode2 = order.mealCode_2;
            if(ICAO_SPML_CODES[spmlCode2]) {
                appElements.spmlSelect2.value = spmlCode2;
                show(appElements.spmlInputOther2, false);
            } else {
                appElements.spmlSelect2.value = 'OTHER';
                appElements.spmlInputOther2.value = spmlCode2;
                show(appElements.spmlInputOther2, true);
            }
        } else {
            appElements.spmlSelect2.value = 'AVML'; 
            show(appElements.spmlInputOther2, false);
        }
        
        syncSPML(order.isSPML);

        const statusRadio = document.querySelector(`input[name="service-status"][value="${order.status}"]`);
        if (statusRadio) statusRadio.checked = true;
        toggleMealBeverageVisibility();
        appElements.titleSelect.innerHTML = TITLES.map(t => `<option value="${t}">${t}</option>`).join('');
        appElements.titleSelect.value = order.title;
        appElements.lastNameInput.value = order.lastName;
        appElements.delayTimeSelect.value = order.delayDuration || '30';
        
        setupMealOptions(appElements.mealOptionsContainer, activeMeals_1, mealInventory_1, 'meal_1', order.mealCode, order.status);
        setupBeverageOptions(appElements.beverageOptionsContainer, order.beverages, 'beverage_1');

        // Appetizer Logic
        const activeAppetizers = MENUS[currentRoute]?.appetizers || [];
        let appContainer = document.getElementById('appetizer-options-container');
        if (!appContainer) { 
            appContainer = document.createElement('div');
            appContainer.id = 'appetizer-options-container';
            appContainer.className = 'mt-4 border-t pt-4 mb-4 hidden';
            appElements.mealOptionsWrapper.appendChild(appContainer);
        }

        const isMRoute = routeInfo && routeInfo.type === 'M';
        if (isMRoute && activeAppetizers.length > 0 && !order.isSPML) {
            appContainer.classList.remove('hidden');
            appContainer.innerHTML = `<label class="block text-lg font-semibold text-gray-700 mb-2">Appetizer (前菜)</label>`;
            const listContainer = document.createElement('div');
            listContainer.className = 'space-y-3';
            
            activeAppetizers.forEach(app => {
                const totalOrdered = orders.filter(o => o.appetizerChoice === app.code && !o.isAppetizerPreSelect).length;
                const remaining = (appetizerInventory[app.code] || 0) - totalOrdered;
                const isSelected = order.appetizerChoice === app.code;
                const isDisabled = remaining <= 0 && !isSelected;

                const label = document.createElement('label');
                label.className = `flex items-center p-3 border rounded-lg transition cursor-pointer shadow-sm ${isDisabled ? 'disabled-option bg-gray-100' : 'hover:bg-gray-50'}`;
                label.innerHTML = `
                    <input type="radio" name="appetizer_choice" value="${app.code}" class="form-radio h-5 w-5 text-amber-500" ${isDisabled ? 'disabled' : ''} ${isSelected ? 'checked' : ''}>
                    <span class="ml-3 font-medium ${isDisabled ? 'text-gray-500' : 'text-gray-800'}">
                        ${app.code} - ${app.name} (Qty: <span class="font-bold ${remaining <= 0 && !isSelected ? 'text-red-500' : 'text-green-600'}">${remaining}</span>)
                        <span class="text-xs text-gray-500 block">(${app.chinese})</span>
                    </span>
                `;
                listContainer.appendChild(label);
            });
            
            const noAppLabel = document.createElement('label');
            noAppLabel.className = 'flex items-center p-3 border rounded-lg transition cursor-pointer shadow-sm hover:bg-gray-50';
            noAppLabel.innerHTML = `
                <input type="radio" name="appetizer_choice" value="" class="form-radio h-5 w-5 text-gray-500" ${!order.appetizerChoice ? 'checked' : ''}>
                <span class="ml-3 font-medium text-gray-800">None / Default (不需前菜/預設)</span>
            `;
            listContainer.appendChild(noAppLabel);
            appContainer.appendChild(listContainer);
        } else {
            appContainer.classList.add('hidden');
        }

        if (isLongHaul) {
            setupMealOptions(appElements.mealOptionsContainer2, activeMeals_2, mealInventory_2, 'meal_2', order.mealCode_2, order.status);
            setupBeverageOptions(appElements.beverageOptionsContainer2, order.beverages_2, 'beverage_2');
            show(appElements.beverageOptionsWrapper2, true);
        } else {
            show(appElements.beverageOptionsWrapper2, false);
        }

        appElements.remarkTagsContainer.innerHTML = '';
        Object.keys(TAGS).forEach(tagId => {
            const tag = TAGS[tagId];
            const btn = document.createElement('button');
            btn.className = `tag-btn flex items-center gap-1.5 px-3 py-1 border rounded-full text-sm font-medium ${order.tags.includes(tagId) ? 'selected' : 'bg-gray-100'}`;
            btn.dataset.tagId = tagId;
            btn.innerHTML = `<i data-lucide="${tag.icon}" class="w-5 h-5"></i> ${tag.label}`;
            btn.onclick = () => {
                btn.classList.toggle('selected');
                btn.classList.toggle('bg-gray-100');
            };
            appElements.remarkTagsContainer.appendChild(btn);
        });
        lucide.createIcons();
        appElements.submitOrderBtn.textContent = 'Confirm Order';
        show(appElements.submitOrderBtn, true);
    }
}

function closeModal() {
    appElements.orderModal.classList.replace('flex', 'hidden');
    currentSeatId = null;
}

// [NEW] Helper function to get SPML code from inputs
function getSPMLCode(selectEl, inputEl) {
    const selected = selectEl.value;
    if (selected === 'OTHER') {
        return inputEl.value.trim().toUpperCase();
    }
    return selected;
}

// [NEW] Helper function to sync SPML 1 to SPML 2
function syncSPML(isSPML) {
    const show = (el, visible) => el.classList.toggle('hidden', !visible);
    
    appElements.spmlCheckbox2.checked = isSPML;
    appElements.spmlCheckbox2.disabled = isSPML;
    
    show(appElements.spmlInputContainer2, isSPML);
    show(appElements.mealOptionsWrapper2, !isSPML);

    if(isSPML) {
        const spmlCode = getSPMLCode(appElements.spmlSelect, appElements.spmlInputOther);
        if(ICAO_SPML_CODES[spmlCode]) {
            appElements.spmlSelect2.value = spmlCode;
            show(appElements.spmlInputOther2, false);
        } else {
            appElements.spmlSelect2.value = 'OTHER';
            appElements.spmlInputOther2.value = spmlCode;
            show(appElements.spmlInputOther2, true);
        }
        appElements.spmlSelect2.disabled = true;
        appElements.spmlInputOther2.disabled = true;
    } else {
        appElements.spmlSelect2.disabled = false;
        appElements.spmlInputOther2.disabled = false;
    }
}

// [FIXED] handleSubmitOrder - Solves SPML Appetizer issue & Phantom Meal 2 issue
function handleSubmitOrder() {
    const orderToUpdate = getOrder(currentSeatId);
    if (!orderToUpdate) {
        showMessage('Error: No seat selected.', true);
        closeModal();
        return;
    }
    
    // 取得航線資訊與判定邏輯
    const isLongHaul = activeMeals_2.length > 0;
    const isFullOrderMode = appElements.submitOrderBtn.textContent.includes('Confirm');
    const routeInfo = ROUTES.find(r => r.id === currentRoute);
    const isMRoute = routeInfo && routeInfo.type === 'M';
    const isLRoute = routeInfo && ['L', 'UL'].includes(routeInfo.type);

    // 內部小函式：專門負責在雙欄選單中抓取勾選的飲料與規格
    const getBeverageData = (container, checkboxName) => {
        if (!container) return [];
        const checkedNodes = Array.from(container.querySelectorAll(`input[name="${checkboxName}"]:checked`));
        return checkedNodes.map(node => {
            const bevObj = { name: node.value, served: false, skipped: false };
            const card = node.closest('.beverage-item-card');
            const styleSelect = card ? card.querySelector('.beverage-style-select') : null;
            if (styleSelect && !styleSelect.classList.contains('hidden')) {
                bevObj.style = styleSelect.value;
            }
            return bevObj;
        });
    };

    if (!isFullOrderMode) {
        // --- 1. Service Mode (加點服務) ---
        const phase = currentServicePhase;
        const container = (phase === 'MEAL_1') ? appElements.beverageOptionsContainer : appElements.beverageOptionsContainer2;
        const checkboxName = (phase === 'MEAL_1') ? 'beverage_1' : 'beverage_2';

        const newBevs = getBeverageData(container, checkboxName);
        if (newBevs.length > 0) {
            if (phase === 'MEAL_1') orderToUpdate.beverages.push(...newBevs);
            else orderToUpdate.beverages_2.push(...newBevs);
            showMessage(`Success: Added ${newBevs.length} drinks.`, false);
        }
    } else {
        // --- 2. Order Mode (完整存檔模式) ---
        const selectedStatus = document.querySelector('input[name="service-status"]:checked').value;
        orderToUpdate.status = selectedStatus;
        orderToUpdate.lastName = appElements.lastNameInput.value.trim().toUpperCase();
        orderToUpdate.title = appElements.titleSelect.value;
        orderToUpdate.remark = appElements.remarkInput.value;
        orderToUpdate.tags = Array.from(appElements.remarkTagsContainer.querySelectorAll('.tag-btn.selected')).map(btn => btn.dataset.tagId);

        if (['ORDERED', 'DELAYED', 'DND'].includes(selectedStatus)) {
            const isSPML = appElements.spmlCheckbox.checked;
            orderToUpdate.isSPML = isSPML;
            
            // A. 第一餐主食與前菜邏輯
            if (isSPML) {
                const spmlCode = getSPMLCode(appElements.spmlSelect, appElements.spmlInputOther);
                orderToUpdate.mealCode = spmlCode;
                orderToUpdate.mealName = 'Special Meal';
                // M/L/UL 航線 SPML 自動啟用前菜流程
                if (isMRoute || isLRoute) orderToUpdate.appetizerChoice = spmlCode; 
            } else {
                const mealRadio = document.querySelector('input[name="meal_1"]:checked');
                if (mealRadio) {
                    orderToUpdate.mealCode = mealRadio.value;
                    const mData = getMeal1(mealRadio.value);
                    orderToUpdate.mealName = mData ? mData.name : 'N/A';
                }
                // 前菜存檔 (M 航線讀取選單，L/UL 強制顯示 Standard)
                if (isMRoute) {
                    const appRadio = document.querySelector('input[name="appetizer_choice"]:checked');
                    orderToUpdate.appetizerChoice = appRadio ? appRadio.value : '';
                } else if (isLRoute) {
                    orderToUpdate.appetizerChoice = 'Standard';
                }
            }
            
            // B. 第一餐飲料存檔
            orderToUpdate.beverages = getBeverageData(appElements.beverageOptionsContainer, 'beverage_1');

            // C. 長程線第二餐與飲料邏輯
            if (isLongHaul) {
                if (orderToUpdate.isSPML) {
                    // SPML 第二餐自動同步代碼
                    orderToUpdate.isSPML_2 = true;
                    orderToUpdate.mealCode_2 = orderToUpdate.mealCode;
                } else {
                    const isSPML2 = appElements.spmlCheckbox2.checked;
                    orderToUpdate.isSPML_2 = isSPML2;
                    if (isSPML2) {
                        orderToUpdate.mealCode_2 = getSPMLCode(appElements.spmlSelect2, appElements.spmlInputOther2);
                    } else {
                        const meal2Radio = document.querySelector('input[name="meal_2"]:checked');
                        if (meal2Radio) orderToUpdate.mealCode_2 = meal2Radio.value;
                    }
                }
                // 第二餐飲料存檔
                orderToUpdate.beverages_2 = getBeverageData(appElements.beverageOptionsContainer2, 'beverage_2');
            }
        }
    }

    renderSeatLayout(); // 同步觸發 Summary 更新
    closeModal();
}

// --- Service & Delay Action Logic ---
function handleServiceClick(event, seatId, itemType, itemIndex = null) {
    event.stopPropagation();
    currentSeatId = seatId; serviceTarget = itemType; currentServiceItemIndex = itemIndex;
    const rect = event.currentTarget.getBoundingClientRect();
    Object.assign(appElements.serviceActionModal.style, { 
        top: `${window.scrollY + rect.bottom + 5}px`, 
        left: `${window.scrollX + rect.left}px`
    });
    appElements.serviceActionModal.classList.remove('hidden');
    document.addEventListener('click', () => appElements.serviceActionModal.classList.add('hidden'), { once: true });
}

// [NEW] 負責將畫面從「狀態檢視」切換成「加點飲料模式」
function renderServiceBeverageMenu() {
    const isLongHaul = activeMeals_2.length > 0;
    const show = (el, visible) => el.classList.toggle('hidden', !visible);
    
    // 隱藏狀態按鈕，顯示確認按鈕
    show(appElements.serviceModeActions, false);
    show(appElements.submitOrderBtn, true);
    appElements.submitOrderBtn.textContent = 'Add Beverage(s)';

    // 依照目前的 Phase 顯示對應內容 (無分頁)
    show(appElements.orderPhaseTabs, false);

    if (currentServicePhase === 'MEAL_1') {
        show(appElements.orderTabContent1, true);
        show(appElements.orderTabContent2, false);
    } else {
        show(appElements.orderTabContent1, false);
        show(appElements.orderTabContent2, true);
    }

    // 清空並重建飲料選單
    appElements.orderTabContent1.innerHTML = '';
    appElements.orderTabContent1.appendChild(appElements.beverageOptionsWrapper);
    appElements.orderTabContent2.innerHTML = '';
    appElements.orderTabContent2.appendChild(appElements.beverageOptionsWrapper2);

    setupBeverageOptions(appElements.beverageOptionsContainer, [], 'beverage_1');
    setupBeverageOptions(appElements.beverageOptionsContainer2, [], 'beverage_2');
    
    // 只顯示飲料區塊
    show(appElements.spmlSection, false); show(appElements.mealOptionsWrapper, false); show(appElements.dessertDisplay, false); show(appElements.beverageOptionsWrapper, true);
    show(appElements.spmlSection2, false); show(appElements.mealOptionsWrapper2, false); show(appElements.beverageOptionsWrapper2, true);
}

// [MODIFIED] handleServiceAction
// [MODIFIED] handleServiceAction - Fixed brace nesting issues
// [修正版] handleServiceAction
function handleServiceAction(action) {
    const order = getOrder(currentSeatId);
    if (!order) return;
    appElements.serviceActionModal.classList.add('hidden');
    
    // --- 區塊 A: Served / Skip ---
    if (action === 'Served' || action === 'Skip') {
        const isServed = action === 'Served';
        const isSkipped = action === 'Skip';
        
        if (serviceTarget === 'meal_1') {
            order.mealServed = isServed; order.mealSkipped = isSkipped;
            const meal = getMeal1(order.mealCode);
            const isOneTrayService = (meal && meal.dessert === 'ONE TRAY SERVICE') || (order.isSPML && ['TPE-HKG', 'TPE-SHI', 'TPE-OKA'].includes(currentRoute));
            if (isOneTrayService) {
                // One Tray 連甜點、湯品一起處理
                order.dessertServed = isServed; order.dessertSkipped = isSkipped;
                order.soupServed = isServed; order.soupSkipped = isSkipped;
            }
        } 
        else if (serviceTarget === 'appetizer') { order.appetizerServed = isServed; order.appetizerSkipped = isSkipped; } 
        else if (serviceTarget === 'soup') { order.soupServed = isServed; order.soupSkipped = isSkipped; }
        else if (serviceTarget === 'meal_2') { order.mealServed_2 = isServed; order.mealSkipped_2 = isSkipped; } 
        else if (serviceTarget === 'yogurt') { order.yogurtServed = isServed; order.yogurtSkipped = isSkipped; }
        else if (serviceTarget === 'fruit') { order.fruitServed = isServed; order.fruitSkipped = isSkipped; }
        else if (serviceTarget === 'drink_1' && currentServiceItemIndex !== null) { order.beverages[currentServiceItemIndex].served = isServed; order.beverages[currentServiceItemIndex].skipped = isSkipped; } 
        else if (serviceTarget === 'drink_2' && currentServiceItemIndex !== null) { order.beverages_2[currentServiceItemIndex].served = isServed; order.beverages_2[currentServiceItemIndex].skipped = isSkipped; } 
        else if (serviceTarget === 'dessert') { order.dessertServed = isServed; order.dessertSkipped = isSkipped; }

    } 
    // --- 區塊 B: Cancel (之前這裡被包在上面導致失效) ---
    else if (action === 'Cancel') {
         if (serviceTarget === 'meal_1') {
            const lastName = order.lastName, title = order.title;
            Object.assign(order, createInitialOrder(order.id), { lastName, title });
            showMessage(`Order for ${order.id} has been Cancelled.`, false);
            if (currentMode === MODES.SERVICE_MODE) setTimeout(() => openOrderModal(order.id), 100);
         }
         else if (serviceTarget === 'appetizer') {
            order.appetizerChoice = ''; order.appetizerServed = false; order.appetizerSkipped = false;
            showMessage(`Appetizer removed.`, false);
         } 
         else if (serviceTarget === 'meal_2') {
            order.mealCode_2 = ''; order.mealName_2 = 'N/A'; order.isSPML_2 = false;
            order.mealServed_2 = false; order.mealSkipped_2 = false;
            showMessage(`2nd Meal removed.`, false);
         } 
         else if (serviceTarget === 'drink_1' && currentServiceItemIndex !== null) {
            order.beverages.splice(currentServiceItemIndex, 1);
            showMessage(`Beverage removed.`, false);
         } 
         else if (serviceTarget === 'drink_2' && currentServiceItemIndex !== null) {
            order.beverages_2.splice(currentServiceItemIndex, 1);
            showMessage(`Beverage removed.`, false);
         }
    }
    
    if (action !== 'Cancel') showMessage(`${order.id}'s ${serviceTarget} marked as ${action}.`, false);
    renderSeatLayout();
}

function handleCloseService() {
    const order = getOrder(currentSeatId);
    if (order) {
        order.serviceClosed = true;
        showMessage(`Service for seat ${currentSeatId} has been closed.`, false);
    }
    closeModal();
    renderSeatLayout();
}

function openDelayActionModal(seatId) {
    currentSeatId = seatId;
    appElements.delayModalSeatId.textContent = seatId;
    appElements.delayActionModal.classList.replace('hidden', 'flex');
}
function closeDelayActionModal() {
    appElements.delayActionModal.classList.replace('flex', 'hidden');
    currentSeatId = null;
}
function handleDelayAction(action, value = 0) {
    const order = getOrder(currentSeatId);
    if (!order) return;
    if (action === 'start_now') {
        order.status = 'ORDERED';
        order.delayUntil = 0;
        order.delayDuration = 0;
        showMessage(`Service for seat ${order.id} will start now.`, false);
    } else if (action === 'delay') {
        order.delayUntil = Date.now() + (value * 60000);
        order.notificationShown = false;
        showMessage(`Service for seat ${order.id} delayed by ${value} minutes.`, false);
    }
    closeDelayActionModal();
    renderSeatLayout();
}

function openDndActionModal(seatId) {
    currentSeatId = seatId;
    appElements.dndModalSeatId.textContent = seatId;
    appElements.dndActionModal.classList.replace('hidden', 'flex');
}
function closeDndActionModal() {
    appElements.dndActionModal.classList.replace('flex', 'hidden');
    currentSeatId = null;
}
function handleDndAction(action) {
    const order = getOrder(currentSeatId);
    if (!order) {
        closeDndActionModal();
        return;
    }
    if (action === 'start_service') {
        order.status = 'ORDERED';
        showMessage(`Service for seat ${order.id} will start now (DND cancelled).`, false);
        renderSeatLayout();
        closeDndActionModal();
    } else if (action === 'edit_order') {
        appElements.dndActionModal.classList.replace('flex', 'hidden'); 
        openOrderModal(order.id);
    } else if (action === 'close') {
        closeDndActionModal();
    }
}

function openSwapModal() {
    const seatOptions = orders.map(o => `<option value="${o.id}">${o.id}</option>`).join('');
    appElements.swapSeat1.innerHTML = seatOptions;
    appElements.swapSeat2.innerHTML = seatOptions;
    appElements.swapSeatsModal.classList.replace('hidden', 'flex');
}

function closeSwapModal() {
     appElements.swapSeatsModal.classList.replace('flex', 'hidden');
}

function handleSwapSeats() {
    const seatId1 = appElements.swapSeat1.value;
    const seatId2 = appElements.swapSeat2.value;
    if(seatId1 === seatId2) {
        showMessage('Please select two different seats to swap.', true);
        return;
    }
    const order1 = getOrder(seatId1);
    const order2 = getOrder(seatId2);
    
    const tempOrder = {...order1, id: 'temp'};
    Object.assign(order1, {...order2, id: seatId1 });
    Object.assign(order2, {...tempOrder, id: seatId2 });

    showMessage(`Seats ${seatId1} and ${seatId2} have been swapped.`, false);
    closeSwapModal();
    renderSeatLayout();
}

// --- Save/Load and Reporting Functions ---
function handleSaveFlight() {
    const flightData = {
        flightNumber,
        currentAircraftType,
        activeAircraftConfig,
        currentRoute,
        mealInventory_1,
        mealInventory_2,
        orders
    };
    const jsonString = JSON.stringify(flightData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `starlux-flight-${flightNumber}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showMessage('Flight data saved!', false);
}

// [MODIFIED] handleLoadFlight
function handleLoadFlight(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const loadedData = JSON.parse(e.target.result);
            
            flightNumber = loadedData.flightNumber;
            currentAircraftType = loadedData.currentAircraftType;
            activeAircraftConfig = loadedData.activeAircraftConfig;
            currentRoute = loadedData.currentRoute;
            mealInventory_1 = loadedData.mealInventory_1 || loadedData.mealInventory || {}; 
            mealInventory_2 = loadedData.mealInventory_2 || {};
            orders = loadedData.orders;
            
            // [NEW] Ensure loaded orders have the new beverages_2 array
            orders.forEach(order => {
                if (!order.beverages_2) {
                    order.beverages_2 = [];
                }
            });
            
            const routeMenus = MENUS[currentRoute] || { meal_1: [], meal_2: [] };
            activeMeals_1 = routeMenus.meal_1 || [];
            activeMeals_2 = routeMenus.meal_2 || [];
            
            appElements.displayFlightNo.textContent = flightNumber;
            appElements.aircraftTypeDisplay.textContent = `Business Class Meal & Beverage Selection (${activeAircraftConfig.name})`;
            appElements.inventoryModal.classList.replace('flex', 'hidden');
        if (appElements.editInventoryBtn) appElements.editInventoryBtn.classList.remove('hidden');
            ['seatLayoutContainer', 'summarySection', 'controlPanel'].forEach(el => appElements[el].classList.remove('hidden'));
            
            // [NEW] Show/Hide aisle view controls based on loaded aircraft type
            if (activeAircraftConfig.seatLetters.length > 2) {
                appElements.aisleViewControls.classList.remove('hidden');
            } else {
                appElements.aisleViewControls.classList.add('hidden');
            }
            setAisleView('ALL'); // Reset to 'ALL' view
            
            renderSeatLayout();
            showMessage('Flight data loaded successfully!', false);
        } catch (err) {
            console.error("Failed to load flight data:", err);
            showMessage('Error reading or parsing file. Please ensure it is a valid flight data file.', true);
        }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
}

function generatePDFReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();

    doc.setFontSize(22);
    doc.text("STARLUX Business Class Service Report", 105, 20, { align: "center" });
    doc.setFontSize(16);
    doc.text(`Flight: ${flightNumber}`, 105, 40, { align: "center" });
    doc.text(`Aircraft: ${activeAircraftConfig.name}`, 105, 50, { align: "center" });
    doc.text(`Date: ${today}`, 105, 60, { align: "center" });

    doc.addPage();
    doc.setFontSize(18);
    doc.text("Meal Summary", 14, 22);
    
    const mealCounts = {};
     orders.forEach(order => {
        if (order.status !== 'PENDING') {
           if (order.mealCode) {
                const id = order.isSPML ? `SPML-1 (${order.mealCode})` : order.mealCode;
                mealCounts[id] = (mealCounts[id] || 0) + 1;
            }
            if (order.mealCode_2) {
                const id = order.isSPML_2 ? `SPML-2 (${order.mealCode_2})` : order.mealCode_2;
                mealCounts[id] = (mealCounts[id] || 0) + 1;
            }
        }
    });

    let yPos = 35;
    doc.setFontSize(12);
    doc.text("Meal Code", 14, yPos);
    doc.text("Initial", 80, yPos);
    doc.text("Ordered", 110, yPos);
    doc.text("Remaining", 140, yPos);
    yPos += 10;
    
    if (activeMeals_1.length > 0) {
        doc.setFontSize(14);
        doc.text("1st Meal Service", 14, yPos);
        yPos += 7;
        doc.setFontSize(12);
        activeMeals_1.forEach(meal => {
            const ordered = mealCounts[meal.code] || 0;
            const initial = mealInventory_1[meal.code] || 0;
            doc.text(meal.code, 14, yPos);
            doc.text(initial.toString(), 80, yPos);
            doc.text(ordered.toString(), 110, yPos);
            doc.text((initial - ordered).toString(), 140, yPos);
            yPos += 7;
            delete mealCounts[meal.code];
        });
    }

    if (activeMeals_2.length > 0) {
        yPos += 5;
        doc.setFontSize(14);
        doc.text("2nd Meal Service", 14, yPos);
        yPos += 7;
        doc.setFontSize(12);
        activeMeals_2.forEach(meal => {
            const ordered = mealCounts[meal.code] || 0;
            const initial = mealInventory_2[meal.code] || 0;
            doc.text(meal.code, 14, yPos);
            doc.text(initial.toString(), 80, yPos);
            doc.text(ordered.toString(), 110, yPos);
            doc.text((initial - ordered).toString(), 140, yPos);
            yPos += 7;
            delete mealCounts[meal.code];
        });
    }
    
    yPos += 5;
    doc.setFontSize(14);
    doc.text("Special Meals (SPML)", 14, yPos);
    yPos += 7;
    doc.setFontSize(12);
     Object.keys(mealCounts).filter(k => k.startsWith('SPML')).forEach(spmlCode => {
        doc.text(spmlCode, 14, yPos);
        doc.text("N/A", 80, yPos);
        doc.text(mealCounts[spmlCode].toString(), 110, yPos);
        doc.text("N/A", 140, yPos);
        yPos += 7;
     });

    if (yPos > 240) { doc.addPage(); yPos = 20; }
    yPos += 10;
    doc.setFontSize(18);
    doc.text("Beverage Summary", 14, yPos);
    yPos += 10;
    doc.setFontSize(12);

    const beverageCounts = {};
    orders.forEach(o => {
        o.beverages.forEach(b => beverageCounts[b.name] = (beverageCounts[b.name] || 0) + 1)
        if(o.beverages_2) o.beverages_2.forEach(b => beverageCounts[b.name] = (beverageCounts[b.name] || 0) + 1)
    });
    Object.keys(beverageCounts).forEach(bevName => {
        doc.text(`${bevName}: ${beverageCounts[bevName]}`, 14, yPos);
        yPos += 7;
        if (yPos > 280) { doc.addPage(); yPos = 20; }
    });

    doc.addPage();
    doc.setFontSize(18);
    doc.text("Special Remarks & Tags", 14, 22);
    yPos = 30;
    doc.setFontSize(12);

    orders.filter(o => o.remark || o.tags.length > 0).forEach(order => {
        const tagsText = order.tags.map(tId => TAGS[tId].label).join(', ');
        doc.text(`Seat ${order.id} (${order.lastName || 'N/A'}):`, 14, yPos);
        yPos += 7;
        if (tagsText) {
            doc.text(`  Tags: ${tagsText}`, 20, yPos);
            yPos += 7;
        }
        if (order.remark) {
            doc.text(`  Remark: ${order.remark}`, 20, yPos);
            yPos += 7;
        }
        yPos += 3; 
        if (yPos > 280) { doc.addPage(); yPos = 20; }
    });
    
    doc.save(`Flight-Report-${flightNumber}-${today}.pdf`);
}

function resetSystem() {
    location.reload();
}

async function handleEndOfFlight() {
    showMessage('Generating PDF report...', false);
    try {
        generatePDFReport();
    } catch(e) {
        console.error("PDF generation failed:", e);
        showMessage('Error generating PDF report.', true);
    }
    setTimeout(resetSystem, 1000);
}

function updateClock() {
    appElements.currentTimeDisplay.textContent = new Date().toLocaleString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
        hour: 'numeric', minute: 'numeric', timeZoneName: 'short'
    });
}

// [NEW] SPML Input Listeners
function setupSPMLListeners() {
    const show = (el, visible) => el.classList.toggle('hidden', !visible);

    appElements.spmlCheckbox.addEventListener('change', () => {
        const isChecked = appElements.spmlCheckbox.checked;
        show(appElements.spmlInputContainer, isChecked);
        show(appElements.mealOptionsWrapper, !isChecked);
        if(!isChecked) show(appElements.spmlInputOther, false);
        syncSPML(isChecked);
    });
    
    appElements.spmlSelect.addEventListener('change', () => {
        const isOther = appElements.spmlSelect.value === 'OTHER';
        show(appElements.spmlInputOther, isOther);
        syncSPML(appElements.spmlCheckbox.checked);
    });

    appElements.spmlInputOther.addEventListener('input', () => {
         syncSPML(appElements.spmlCheckbox.checked);
    });
    
    // Listeners for SPML 2 (in case SPML 1 is unchecked)
     appElements.spmlCheckbox2.addEventListener('change', () => {
        const isChecked = appElements.spmlCheckbox2.checked;
        show(appElements.spmlInputContainer2, isChecked);
        show(appElements.mealOptionsWrapper2, !isChecked);
        if(!isChecked) show(appElements.spmlInputOther2, false);
    });
    
    appElements.spmlSelect2.addEventListener('change', () => {
        const isOther = appElements.spmlSelect2.value === 'OTHER';
        show(appElements.spmlInputOther2, isOther);
    });
}

// [MODIFIED] init

// --- [NEW] Edit Inventory Feature ---
function openEditInventory() {
    // Ensure there is an active flight
    if (!flightNumber || !activeAircraftConfig || !currentRoute) {
        showMessage('Please finish Setup first before editing inventory.', true);
        return;
    }
    isEditingInventory = true;
    // Pre-fill selectors and lock them
    appElements.flightNumberInput.value = flightNumber;
    appElements.aircraftSelect.value = currentAircraftType;
    appElements.routeSelect.value = currentRoute;
    appElements.flightNumberInput.disabled = true;
    appElements.aircraftSelect.disabled = true;
    appElements.routeSelect.disabled = true;

    // Adjust modal titles/buttons
    if (appElements.inventoryModalTitle) appElements.inventoryModalTitle.textContent = 'Edit Meal Inventory';
    appElements.saveInventoryBtn.textContent = 'Save Inventory';
    appElements.saveInventoryBtn.dataset.mode = 'edit';

    // Build inputs using current inventories
    setupInventoryInputs();

    // Show modal
    appElements.inventoryModal.classList.replace('hidden', 'flex');
}

function handleSaveInventoryEdit() {
    let allValid = true;
    const routeMenus = MENUS[currentRoute] || { meal_1: [], meal_2: [] };
    activeMeals_1 = routeMenus.meal_1 || [];
    activeMeals_2 = routeMenus.meal_2 || [];

    // 1. 讀取主餐 1
    const inv1 = {};
    activeMeals_1.forEach(meal => {
        const input = document.getElementById(`qty-1-${meal.code}`);
        const value = parseInt(input && input.value, 10);
        if (isNaN(value) || value < 0) allValid = false;
        inv1[meal.code] = value || 0;
    });

    // 2. 讀取主餐 2
    const inv2 = {};
    activeMeals_2.forEach(meal => {
        const input = document.getElementById(`qty-2-${meal.code}`);
        const value = parseInt(input && input.value, 10);
        if (isNaN(value) || value < 0) allValid = false;
        inv2[meal.code] = value || 0;
    });

    // 3. 讀取前菜
    const routeMenusApp = MENUS[currentRoute] || { appetizers: [] };
    const activeAppetizers = routeMenusApp.appetizers || [];
    const invApp = {};

    activeAppetizers.forEach(app => {
        const input = document.getElementById(`qty-appetizer-${app.code}`);
        if (input) {
            const value = parseInt(input && input.value, 10);
            if (isNaN(value) || value < 0) allValid = false;
            invApp[app.code] = value || 0;
        }
    });

    if (!allValid) { showMessage('Please ensure all quantities are valid non-negative numbers.', true); return; }

    // 更新全域變數
    mealInventory_1 = inv1;
    mealInventory_2 = inv2;
    appetizerInventory = invApp;

    // Refresh UI
    renderSeatLayout();
    if (!appElements.orderModal.classList.contains('hidden') && currentSeatId) {
        openOrderModal(currentSeatId);
    }
    showMessage('Inventory updated.', false);

    // Close modal
    appElements.inventoryModal.classList.replace('flex', 'hidden');
    if (appElements.editInventoryBtn) appElements.editInventoryBtn.classList.remove('hidden');
    
    // Restore controls
    appElements.flightNumberInput.disabled = false;
    appElements.aircraftSelect.disabled = false;
    appElements.routeSelect.disabled = false;
    if (appElements.inventoryModalTitle) appElements.inventoryModalTitle.textContent = 'Setup Flight & Meal Inventory';
    appElements.saveInventoryBtn.textContent = 'Confirm Setup';
    appElements.saveInventoryBtn.dataset.mode = '';
    isEditingInventory = false;
}

function init() {
    setupInitialSelectors();
    setupInventoryInputs();
    setupSPMLListeners();

    const serviceActionBtns = document.querySelectorAll('#service-action-modal button');
    serviceActionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.getAttribute('data-action');
            handleServiceAction(action);
        });
    });


    // --- 請將這段程式碼複製並貼入 init() 函式內 (放在剛剛修復的 Service Action 下方) ---

    // [FIX 1] 補回 Delay Action Modal (延後時間選擇) 的監聽
    const delayBtns = document.querySelectorAll('#delay-action-modal button');
    delayBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.getAttribute('data-action');
            const val = e.currentTarget.getAttribute('data-value'); // 取得延後分鐘數
            handleDelayAction(action, val ? parseInt(val) : 0);
        });
    });

    // [FIX 2] 補回 DND Action Modal (請勿打擾後續動作) 的監聽
    const dndBtns = document.querySelectorAll('#dnd-action-modal button');
    dndBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.getAttribute('data-action');
            handleDndAction(action);
        });
    });

    // [FIX 3] 補回點餐視窗的分頁切換 (1st Meal / 2nd Meal Tabs)
    if (appElements.orderTab1 && appElements.orderTab2) {
        appElements.orderTab1.addEventListener('click', () => {
            appElements.orderTab1.classList.add('active');
            appElements.orderTab2.classList.remove('active');
            appElements.orderTabContent1.classList.remove('hidden');
            appElements.orderTabContent2.classList.add('hidden');
        });
        
        appElements.orderTab2.addEventListener('click', () => {
            appElements.orderTab2.classList.add('active');
            appElements.orderTab1.classList.remove('active');
            appElements.orderTabContent2.classList.remove('hidden');
            appElements.orderTabContent1.classList.add('hidden');
        });
    }

// ------------------------------------------------
    appElements.btnAddBeverage.addEventListener('click', renderServiceBeverageMenu);
    appElements.routeSelect.addEventListener('change', () => setupInventoryInputs());

    appElements.aircraftSelect.addEventListener('change', () => {
        renderPreSelectInputs();
    });

    appElements.saveInventoryBtn.addEventListener('click', (e) => {
        if (appElements.saveInventoryBtn.dataset.mode === 'edit') { 
            handleSaveInventoryEdit(); 
        } else { 
            handleSaveInventory(); 
        }
    });

    appElements.loadFlightInput.addEventListener('change', handleLoadFlight);
    if (appElements.editInventoryBtn) appElements.editInventoryBtn.addEventListener('click', openEditInventory);
    appElements.saveFlightBtn.addEventListener('click', handleSaveFlight);
    appElements.closeModalBtn.addEventListener('click', closeModal);
    appElements.submitOrderBtn.addEventListener('click', handleSubmitOrder);
    appElements.modeToggleBtn.addEventListener('click', toggleServiceMode);
    appElements.phaseToggleBtn.addEventListener('click', toggleServicePhase);
    appElements.endFlightBtn.addEventListener('click', handleEndOfFlight);
    appElements.closeServiceBtn.addEventListener('click', handleCloseService);
    appElements.openSwapModalBtn.addEventListener('click', openSwapModal);
    appElements.cancelSwapBtn.addEventListener('click', closeSwapModal);
    appElements.confirmSwapBtn.addEventListener('click', handleSwapSeats);
    appElements.dismissDueServiceAlertBtn.addEventListener('click', () => {
        appElements.dueServiceAlertModal.classList.replace('flex', 'hidden');
    });
    
    // 修正過濾按鈕的點擊監聽
   if (appElements.viewLBtn) {
    appElements.viewLBtn.addEventListener('click', () => setAisleView('L'));
}
if (appElements.viewAllBtn) {
    appElements.viewAllBtn.addEventListener('click', () => setAisleView('ALL'));
}
if (appElements.viewRBtn) {
    appElements.viewRBtn.addEventListener('click', () => setAisleView('R'));
}
    setInterval(updateClock, 1000);
    updateClock();
    lucide.createIcons();
} 

// 最後執行初始化
window.onload = init;

    window.onload = init; 

 // ==========================================
// --- OFFLINE QR SYNC MODULE (FIXED NAME SYNC) ---
// ==========================================

const syncElements = {
    btn: document.getElementById('offline-sync-btn'),
    modal: document.getElementById('sync-modal'),
    closeBtn: document.getElementById('close-sync-btn'),
    tabSend: document.getElementById('tab-send'),
    tabReceive: document.getElementById('tab-receive'),
    sendSection: document.getElementById('send-section'),
    receiveSection: document.getElementById('receive-section'),
    qrDisplay: document.getElementById('qrcode-display'),
    qrError: document.getElementById('qr-error-msg'),
    scanStatus: document.getElementById('scan-status')
};

let html5QrCode = null;

// 1. 極致壓縮資料 (已加入姓氏與稱謂)
function compressFlightData() {
    // 只提取「有變動」的座位資料 (狀態非 PENDING，或有名字，或有餐點)
    const activeOrders = orders.filter(o => 
        o.status !== 'PENDING' || o.lastName || o.mealCode || o.mealCode_2 || o.beverages.length > 0
    ).map(o => {
        // i: id, s: status, m1: meal1, m2: meal2
        // ln: lastName, ti: title (NEW!)
        const minOrder = { i: o.id };
        
        // --- [新增] 同步姓名與稱謂 ---
        if (o.lastName) minOrder.ln = o.lastName;
        if (o.title) minOrder.ti = o.title;
        // ---------------------------

        if (o.status !== 'PENDING') minOrder.s = o.status.substring(0, 1); // O=ORDERED, D=DELAY, N=DND
        if (o.status === 'DND') minOrder.s = 'X'; 

        if (o.mealCode && o.mealCode !== 'NO MEAL') minOrder.m1 = o.mealCode;
        if (o.mealCode_2 && o.mealCode_2 !== 'NO MEAL') minOrder.m2 = o.mealCode_2;
        if (o.isSPML) minOrder.sp1 = 1;
        if (o.isSPML_2) minOrder.sp2 = 1;
        
        if (o.beverages.length > 0) minOrder.b1 = o.beverages.map(b => b.name);
        if (o.beverages_2 && o.beverages_2.length > 0) minOrder.b2 = o.beverages_2.map(b => b.name);
        
        if (o.mealServed) minOrder.v1 = 1;
        if (o.mealServed_2) minOrder.v2 = 1;
        if (o.appetizerChoice) minOrder.ap = o.appetizerChoice;
        
        return minOrder;
    });

    const payload = {
        f: flightNumber, 
        t: Date.now(),
        d: activeOrders
    };

    return JSON.stringify(payload);
}

// 2. 解壓縮資料並合併 (已加入姓氏還原)
function decompressAndMerge(jsonString) {
    try {
        const payload = JSON.parse(jsonString);
        
        if (payload.f !== flightNumber && flightNumber) {
            if (!confirm(`Flight Number mismatch!\nCurrent: ${flightNumber}\nScanned: ${payload.f}\nSync anyway?`)) return;
        }

        let updateCount = 0;
        payload.d.forEach(minOrder => {
            const targetOrder = getOrder(minOrder.i);
            if (targetOrder) {
                updateCount++;
                
                // --- [新增] 還原姓名與稱謂 ---
                if (minOrder.ln) targetOrder.lastName = minOrder.ln;
                if (minOrder.ti) targetOrder.title = minOrder.ti;
                // ---------------------------

                if (minOrder.s === 'O') targetOrder.status = 'ORDERED';
                else if (minOrder.s === 'X') targetOrder.status = 'DND';
                else if (minOrder.s === 'D') targetOrder.status = 'DELAYED';
                
                if (minOrder.m1) {
                    targetOrder.mealCode = minOrder.m1;
                    targetOrder.isSPML = !!minOrder.sp1;
                    if (!targetOrder.isSPML) {
                        const m = getMeal1(minOrder.m1);
                        targetOrder.mealName = m ? m.name : minOrder.m1;
                    } else { targetOrder.mealName = 'Special Meal'; }
                }

                if (minOrder.m2) {
                    targetOrder.mealCode_2 = minOrder.m2;
                    targetOrder.isSPML_2 = !!minOrder.sp2;
                    if (!targetOrder.isSPML_2) {
                        const m = getMeal2(minOrder.m2);
                        targetOrder.mealName_2 = m ? m.name : minOrder.m2;
                    } else { targetOrder.mealName_2 = 'Special Meal'; }
                }
                
                if (minOrder.v1) targetOrder.mealServed = true;
                if (minOrder.v2) targetOrder.mealServed_2 = true;
                if (minOrder.ap) targetOrder.appetizerChoice = minOrder.ap;

                if (minOrder.b1) {
                    targetOrder.beverages = minOrder.b1.map(name => ({ name: name, served: false, skipped: false }));
                }
                if (minOrder.b2) {
                    targetOrder.beverages_2 = minOrder.b2.map(name => ({ name: name, served: false, skipped: false }));
                }
            }
        });

        renderSeatLayout();
        showMessage(`Sync Success! Updated ${updateCount} seats (with Names).`, false);
        closeSyncModal();

    } catch (e) {
        console.error(e);
        showMessage('Invalid QR Data or Format Error.', true);
    }
}

// 3. UI 邏輯
function openSyncModal() {
    if(!syncElements.modal) return;
    syncElements.modal.classList.replace('hidden', 'flex');
    switchTab('send'); 
}

function closeSyncModal() {
    syncElements.modal.classList.replace('flex', 'hidden');
    stopScanner();
}

function switchTab(mode) {
    if (mode === 'send') {
        syncElements.tabSend.className = "flex-1 py-3 font-bold text-amber-600 border-b-2 border-amber-600 bg-amber-50";
        syncElements.tabReceive.className = "flex-1 py-3 font-bold text-gray-500 hover:bg-gray-50";
        syncElements.sendSection.classList.remove('hidden');
        syncElements.receiveSection.classList.add('hidden');
        stopScanner();
        setTimeout(generateQR, 100);
    } else {
        syncElements.tabSend.className = "flex-1 py-3 font-bold text-gray-500 hover:bg-gray-50";
        syncElements.tabReceive.className = "flex-1 py-3 font-bold text-teal-600 border-b-2 border-teal-600 bg-teal-50";
        syncElements.sendSection.classList.add('hidden');
        syncElements.receiveSection.classList.remove('hidden');
        startScanner();
    }
}

function generateQR() {
    syncElements.qrDisplay.innerHTML = '';
    syncElements.qrError.classList.add('hidden');
    
    const dataString = compressFlightData();
    // 姓名加入後字串會變長，放寬一點檢查限制
    if (dataString.length > 2800) {
        syncElements.qrError.classList.remove('hidden');
        return;
    }

    new QRCode(syncElements.qrDisplay, {
        text: dataString,
        width: 250,
        height: 250,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.L
    });
}

function startScanner() {
    syncElements.scanStatus.textContent = "Requesting Camera Permission...";
    
    if (html5QrCode) stopScanner();

    html5QrCode = new Html5Qrcode("reader");
    
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    
    html5QrCode.start(
        { facingMode: "environment" }, 
        config,
        (decodedText) => {
            stopScanner();
            decompressAndMerge(decodedText);
        },
        (errorMessage) => {
            if(!errorMessage.includes("No MultiFormat Readers")) {
                 syncElements.scanStatus.textContent = "Scanning... Align QR Code within frame.";
            }
        }
    ).catch(err => {
        syncElements.scanStatus.textContent = "Camera Error: " + err;
        console.error(err);
    });
}

function stopScanner() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            html5QrCode.clear();
            html5QrCode = null;
        }).catch(() => {});
    }
}

// 綁定事件
if (syncElements.btn) syncElements.btn.addEventListener('click', openSyncModal);
if (syncElements.closeBtn) syncElements.closeBtn.addEventListener('click', closeSyncModal);
if (syncElements.tabSend) syncElements.tabSend.addEventListener('click', () => switchTab('send'));
if (syncElements.tabReceive) syncElements.tabReceive.addEventListener('click', () => switchTab('receive'));