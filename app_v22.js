// 配置 Tailwind CSS
tailwind.config = { theme: { extend: { colors: { 'starlux-dark': '#0d1a26', 'starlux-gold': '#d9a74a' } } } }

const STORAGE_KEY = 'STARLUX_FLIGHT_BACKUP_V1';

// 1. 自動儲存當前狀態
function saveSystemState() {
    if (!flightNumber) return; // 如果還沒設定航班，就不儲存

    const state = {
        timestamp: Date.now(),
        flightNumber,
        currentAircraftType,
        activeAircraftConfig,
        currentRoute,
        mealInventory_1,
        mealInventory_2,
        appetizerInventory, // 記得也要存前菜庫存
        orders,
        currentMode,        // 儲存當前模式 (Order/Service)
        currentServicePhase // 儲存當前階段 (Meal 1/Meal 2)
    };

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        // console.log('Auto-saved at', new Date().toLocaleTimeString());
    } catch (e) {
        console.error('Auto-save failed:', e);
    }
}

// 2. 檢查並還原狀態
function checkAndRestoreState() {
    const backup = localStorage.getItem(STORAGE_KEY);
    if (!backup) return;

    try {
        const data = JSON.parse(backup);
        // 檢查備份是否太舊 (例如超過 24 小時)，可自行決定是否要加
        const backupTime = new Date(data.timestamp).toLocaleString();
        
        // 彈出確認視窗
        if (confirm(`Detected an unsaved session for flight ${data.flightNumber} from ${backupTime}.\nDo you want to restore it?`)) {
            
            // --- 還原變數 ---
            flightNumber = data.flightNumber;
            currentAircraftType = data.currentAircraftType;
            activeAircraftConfig = data.activeAircraftConfig;
            currentRoute = data.currentRoute;
            mealInventory_1 = data.mealInventory_1 || {};
            mealInventory_2 = data.mealInventory_2 || {};
            appetizerInventory = data.appetizerInventory || {};
            orders = data.orders;
            currentMode = data.currentMode || MODES.ORDER_MODE;
            currentServicePhase = data.currentServicePhase || 'MEAL_1';

            // --- 還原 UI ---
            appElements.displayFlightNo.textContent = flightNumber;
            appElements.aircraftSelect.value = currentAircraftType;
            appElements.routeSelect.value = currentRoute;
            //appElements.aircraftTypeDisplay.textContent = `JX GIURMET (${activeAircraftConfig.name})`;

            // 隱藏 Setup 視窗，顯示主畫面
            appElements.inventoryModal.classList.replace('flex', 'hidden');
            ['seatLayoutContainer', 'summarySection', 'controlPanel'].forEach(el => appElements[el].classList.remove('hidden'));
            if (appElements.editInventoryBtn) appElements.editInventoryBtn.classList.remove('hidden');

            // 還原模式顯示 (Service Mode / Order Mode)
            if (currentMode === MODES.SERVICE_MODE) {
                appElements.modeToggleBtn.textContent = 'Switch to ORDER MODE';
                appElements.displayMode.textContent = `SERVICE MODE (${currentServicePhase === 'MEAL_1' ? 'Meal 1' : 'Meal 2'})`;
                appElements.displayMode.classList.replace('text-green-400', 'text-red-400');
                appElements.endFlightBtn.classList.remove('hidden');
                // 恢復 Service Phase 按鈕狀態
                if (activeMeals_2.length > 0) {
                    appElements.phaseToggleBtn.classList.remove('hidden');
                    appElements.phaseToggleBtn.textContent = currentServicePhase === 'MEAL_1' ? 'Switch to MEAL 2 SERVICE' : 'Switch to MEAL 1 SERVICE';
                }
            }

            // 處理走道視窗顯示
            if (activeAircraftConfig.seatLetters.length > 2) {
                appElements.aisleViewControls.classList.remove('hidden');
            } else {
                appElements.aisleViewControls.classList.add('hidden');
            }
            setAisleView('ALL');

            // 重新載入菜單定義 (確保 Inventory 顯示正確)
            const routeMenus = MENUS[currentRoute] || { meal_1: [], meal_2: [] };
            activeMeals_1 = routeMenus.meal_1 || [];
            activeMeals_2 = routeMenus.meal_2 || [];

            renderSeatLayout();
            showMessage('Session Restored Successfully!', false);
        } else {
            // 如果使用者選擇「取消」，則清除備份以免下次又問
            localStorage.removeItem(STORAGE_KEY);
        }
    } catch (e) {
        console.error('Restore failed:', e);
        showMessage('Failed to restore session data.', true);
    }
}

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
        { full: 'Sci-Fi Cosmos 2.0', short: 'Sci-Fi' },
        { full: 'Star Mojito', short: 'Star Mojito' },
        { full: 'Citrus Mist', short: 'Citrus Mist' },
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
        { full: 'Virgin Mary', short: 'Virgin Mary', type:'Juice' },
    ],
    'Champagne & White Wine': [
        { full: 'Laurent-Perrier La Cuvée', short: 'Champagane.' },
        { full: 'Masi Masianco Pinot Grigio', short: 'Italy W.W.-P.Grigio' },
        { full: 'Albert Bichot Chablis 1er Cru', short: 'French W.W-Chablis' },
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
        { full: 'Umenishiki Sake ', short: 'Sake' },
        { full: 'Hakutsuru Awayuki Sparkling Sake', short: 'Sparkling Sake'},
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
        { full: 'Espresso', short: 'Espresso', type: 'temp'},
        { full: 'Black Coffee', short: 'Black Coffee', type: 'temp' }, 
        { full: 'Latte', short: 'Latte', type: 'temp' }, 
        { full: 'Cappuccino', short: 'Cappuccino', type: 'temp' },
        { full: 'Decaffeinated Coffee', short: 'Decaff. Coffee', },
        { full: 'Baileys Coffee Latte', short: 'Baileys Latte', type: 'temp' },
        { full: 'Bi Luo Chun Tea', short: 'Bi Liu Chun', type: 'temp' },
        { full: 'Dong Ding Oolong Tea', short: 'Oolong', type: 'temp' },
        { full: 'Sun Moon Assam Black Tea', short: 'Sun Moon Assam', type: 'temp' },
        { full: 'English Breakfast Tea', short: 'EG Breakfast', type: 'temp' },
        { full: 'Earl Grey Tea', short: 'Earl Grey', type: 'temp' },
        { full: 'Sleepy Tea', short: 'Sleepy Tea', type: 'temp' },
        { full: 'Apple & Elderflower Tea', short: 'Apple Eldr', type: 'temp' },
        { full: 'Hot Chocolate', short: 'Hot Coco' },
    ],
    'STARLUX Limited': [
        { full: 'Boba Tea Latte', short: 'Boba Tea', type: 'soda_ice' },
        { full: 'Hojicha Latte', short: 'Hojicha Latte', type: 'soda_ice' }, 
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
    isPreSelect: false, isAppetizerPreSelect: false, isMeal2PreSelect: false,

    appetizerChoice: '', 
    appetizerServed: false, appetizerSkipped: false, appetizerCancelled: false, // [新增]
    
    soupServed: false, soupSkipped: false, soupCancelled: false, // [新增]

    // 1st Meal
    mealCode: '', mealName: 'N/A', isSPML: false,
    mealServed: false, mealSkipped: false, mealCancelled: false, // [新增]
    dessertServed: false, dessertSkipped: false, dessertCancelled: false, // [新增]
    
    // 2nd Meal
    mealCode_2: '', mealName_2: 'N/A', isSPML_2: false,
    mealServed_2: false, mealSkipped_2: false, mealCancelled_2: false, // [新增]
    
    yogurtServed: false, yogurtSkipped: false, yogurtCancelled: false, // [新增]
    fruitServed: false, fruitSkipped: false, fruitCancelled: false, // [新增]
    
    // 飲料結構不動，我們會在飲料物件內部加入 cancelled 屬性
    beverages: [],
    beverages_2: [], 
    
    delayUntil: 0, delayDuration: 0,
    serviceClosed: false,
    remark: '',
    tags: [],
    notificationShown: false,
    
    // [新增] 嬰兒與過敏欄位 (保留您之前的需求)
    hasInfant: false,
    allergyNote: '',
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
let beverageSummaryDoneState = {};


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

function toggleBeverageDone(category, drinkName) {
    // 產生唯一的 key (類別_飲料名)
    const key = `${category}_${drinkName}`;
    
    // 切換狀態 (True <-> False)
    if (beverageSummaryDoneState[key]) {
        delete beverageSummaryDoneState[key]; // 如果已完成，則取消
    } else {
        beverageSummaryDoneState[key] = true; // 標記為完成
    }
    
    // 重新渲染 Summary 區域以更新畫面
    renderOrderSummaryAggregate();
}

function playNotificationSound() {
    // 瀏覽器政策要求：必須先有使用者互動才能播放聲音
    if (!audioCtx) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        } catch (e) {
            console.error('Web Audio API not supported');
            return;
        }
    }
    
    // 如果 Context 被暫停 (常見於 Chrome)，嘗試恢復
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine'; // 正弦波 (嗶—)
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 音高
    oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5); // 聲音下降效果

    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
}
// [NEW] 顯示服務到期提醒視窗   
function showDueServiceAlert(seatId) {
    // 讓手機震動一下 (如果有支援)
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    
    appElements.dueServiceAlertMessage.textContent = `Delay timer for Seat ${seatId} has expired!\nPlease start service.`;
    appElements.dueServiceAlertModal.classList.replace('hidden', 'flex');
    
    // 重新渲染圖示 (因為 Modal 剛顯示出來)
    lucide.createIcons();
}

// --- 模式切換與倒數計時 ---
function toggleServiceMode() {
    if (currentMode === MODES.ORDER_MODE) {
        // --- 切換到 SERVICE MODE ---
        currentMode = MODES.SERVICE_MODE;
        currentServicePhase = 'MEAL_1'; 
        
        // UI 更新
        appElements.modeToggleBtn.textContent = 'Switch to ORDER MODE';
        appElements.displayMode.textContent = 'SERVICE MODE (Meal 1)';
        appElements.displayMode.classList.replace('text-green-400', 'text-red-400');
        appElements.endFlightBtn.classList.remove('hidden');
        
        if (activeMeals_2.length > 0) {
            appElements.phaseToggleBtn.classList.remove('hidden');
            appElements.phaseToggleBtn.textContent = 'Switch to MEAL 2 SERVICE';
        }

        // [關鍵修正] 遍歷所有訂單，啟動 Delayed 的計時器
        const now = Date.now();
        orders.forEach(order => {
            // 條件：狀態是 DELAYED 且 還沒有設定截止時間 (delayUntil)
            if (order.status === 'DELAYED') {
                // 如果之前沒設定分鐘數，預設給 30 分鐘
                if (!order.delayDuration) order.delayDuration = 30;
                
                // 如果還沒開始計時 (delayUntil 為 0 或 undefined)，現在開始計時
                if (!order.delayUntil || order.delayUntil === 0) {
                    order.delayUntil = now + (order.delayDuration * 60000);
                }
            }
        });

        // 初始化音效
        if (!audioCtx) {
            try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){}
        }

        startCountdown(); // 啟動倒數
        showMessage('Switched to SERVICE MODE (Meal 1)', false);
        
    } else {
        // --- 切換回 ORDER MODE ---
        currentMode = MODES.ORDER_MODE;
        
        appElements.modeToggleBtn.textContent = 'Switch to SERVICE MODE';
        appElements.displayMode.textContent = MODES.ORDER_MODE;
        appElements.displayMode.classList.replace('text-red-400', 'text-green-400');
        appElements.endFlightBtn.classList.add('hidden');
        appElements.phaseToggleBtn.classList.add('hidden');
        
        stopCountdown(); // 停止倒數
        showMessage('Switched to ORDER MODE', false);
    }
    renderSeatLayout();
}

// 請補回這兩個函式
function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    
    // 立即執行一次渲染，避免要等 30 秒才看到變化
    renderSeatLayout();
    
    // 設定每 30 秒 (30000ms) 更新一次
    countdownInterval = setInterval(() => {
        renderSeatLayout();
    }, 30000); 
}

function stopCountdown() {
    if (countdownInterval) { 
        clearInterval(countdownInterval); 
        countdownInterval = null; 
    }
}
function renderGalleyDashboard() {
    // 定義計數器
    const totalCountsM1 = {};
    const fieldCountsM1 = {};
    const splitCountsM1 = {}; // [NEW] 用來存 L/R 分流數據

    const totalCountsM2 = {};
    const fieldCountsM2 = {};
    const splitCountsM2 = {}; // [NEW]

    const totalCountsApp = {};
    const fieldCountsApp = {}; // 前菜通常不需要分流(冷餐直接上)，若需要可比照辦理

    const countsSPML = {};
    let totalPax = 0;

    // 1. 統計數據
    orders.forEach(o => {
        if (['ORDERED', 'DELAYED', 'DND'].includes(o.status)) {
            totalPax++;

            // --- [NEW] 判斷左右走道 ---
            // 根據您的機型設定：
            // A321neo: A/C (左), H/K (右)
            // A330/350: A/C/D/E (左), F/G/H/K (右) -> 簡化判斷：包含 A, B, C, D, E 為左
            const isLeft = ['A', 'B', 'C', 'D', 'E'].some(letter => o.id.includes(letter));
            const sideKey = isLeft ? 'L' : 'R';
            // ------------------------

            // --- Meal 1 統計 ---
            if (o.isSPML) {
                const spmlCode = o.mealCode || 'SPML';
                countsSPML[spmlCode] = (countsSPML[spmlCode] || 0) + 1;
            } else if (o.mealCode && o.mealCode !== 'NO MEAL') {
                // A. 總需求
                totalCountsM1[o.mealCode] = (totalCountsM1[o.mealCode] || 0) + 1;
                
                // B. 現場數 (Field)
                if (!o.isPreSelect) {
                    fieldCountsM1[o.mealCode] = (fieldCountsM1[o.mealCode] || 0) + 1;
                }

                // C. [NEW] L/R 分流 (包含預選與現場，給廚房總數參考)
                if (!splitCountsM1[o.mealCode]) splitCountsM1[o.mealCode] = { L: 0, R: 0 };
                splitCountsM1[o.mealCode][sideKey]++;
            }

            // --- Meal 2 統計 ---
            if (activeMeals_2.length > 0) {
                if (!o.isSPML_2 && o.mealCode_2 && o.mealCode_2 !== 'NO MEAL') {
                    totalCountsM2[o.mealCode_2] = (totalCountsM2[o.mealCode_2] || 0) + 1;
                    if (!o.isMeal2PreSelect) {
                        fieldCountsM2[o.mealCode_2] = (fieldCountsM2[o.mealCode_2] || 0) + 1;
                    }
                    // [NEW] Meal 2 分流
                    if (!splitCountsM2[o.mealCode_2]) splitCountsM2[o.mealCode_2] = { L: 0, R: 0 };
                    splitCountsM2[o.mealCode_2][sideKey]++;
                }
            }
            
            // ... (Appetizer 統計保持不變) ...
        }
    });

    document.getElementById('galley-total-pax').textContent = totalPax;

    // --- 卡片生成器 (修改 HTML 模板以顯示 L/R) ---
    const createInventoryCard = (code, orderedTotal, orderedField, name, colorClass, inventoryMap, splitData) => {
        const totalLoaded = (inventoryMap && inventoryMap[code]) ? inventoryMap[code] : 0;
        const remaining = totalLoaded - orderedField;
        
        let remainingColor = 'text-green-400';
        if (remaining <= 0) remainingColor = 'text-gray-500'; 
        else if (remaining <= 2) remainingColor = 'text-red-500 animate-pulse';

        const percentage = totalLoaded > 0 ? Math.min(100, (orderedField / totalLoaded) * 100) : 0;
        
        // [NEW] 取得左右數據
        const countL = splitData ? splitData.L : 0;
        const countR = splitData ? splitData.R : 0;

        return `
            <div class="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-lg relative group">
                <div class="h-2 w-full ${colorClass}"></div>
                
                <div class="p-4">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h4 class="text-2xl font-black text-white leading-none">${code}</h4>
                            <p class="text-xs text-gray-400 mt-1 truncate w-24">${name}</p>
                        </div>
                        <span class="text-[10px] font-mono bg-gray-700 text-gray-300 px-2 py-1 rounded">LOAD: ${totalLoaded}</span>
                    </div>

                    <div class="flex items-center gap-1 mb-3 text-[11px] font-mono bg-gray-900/50 rounded p-1">
                        <div class="flex-1 flex justify-between px-2 border-r border-gray-700">
                            <span class="text-gray-500">L</span>
                            <span class="text-amber-400 font-bold">${countL}</span>
                        </div>
                        <div class="flex-1 flex justify-between px-2">
                            <span class="text-gray-500">R</span>
                            <span class="text-amber-400 font-bold">${countR}</span>
                        </div>
                    </div>

                    <div class="flex items-end justify-between border-t border-gray-700 pt-2">
                        <div class="text-center">
                            <span class="text-[10px] uppercase text-gray-500 font-bold block mb-0.5">Ordered</span>
                            <span class="text-4xl font-bold text-white">${orderedTotal}</span>
                        </div>
                        <div class="h-8 w-px bg-gray-600 mx-2"></div>
                        <div class="text-center">
                            <span class="text-[10px] uppercase text-gray-500 font-bold block mb-0.5">Left</span>
                            <span class="text-4xl font-bold ${remainingColor}">${remaining < 0 ? 0 : remaining}</span>
                        </div>
                    </div>
                </div>

                <div class="w-full h-1.5 bg-gray-900 mt-2">
                    <div class="h-full ${remaining <= 2 ? 'bg-red-500' : colorClass}" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    };

    // 2. 渲染 Meal 1 (傳入 splitCountsM1)
    const gridM1 = document.getElementById('galley-grid-m1');
    gridM1.innerHTML = '';
    activeMeals_1.forEach(m => {
        const total = totalCountsM1[m.code] || 0;
        const field = fieldCountsM1[m.code] || 0;
        const split = splitCountsM1[m.code]; // [NEW]
        gridM1.innerHTML += createInventoryCard(m.code, total, field, m.name, 'bg-amber-500', mealInventory_1, split);
    });

    // 3. 渲染 Meal 2 (傳入 splitCountsM2)
    const sectionM2 = document.getElementById('galley-section-m2');
    if (activeMeals_2.length > 0) {
        sectionM2.classList.remove('hidden');
        const gridM2 = document.getElementById('galley-grid-m2');
        gridM2.innerHTML = '';
        activeMeals_2.forEach(m => {
            const total = totalCountsM2[m.code] || 0;
            const field = fieldCountsM2[m.code] || 0;
            const split = splitCountsM2[m.code]; // [NEW]
            gridM2.innerHTML += createInventoryCard(m.code, total, field, m.name, 'bg-blue-500', mealInventory_2, split);
        });
    } else {
        sectionM2.classList.add('hidden');
    }

    // ... (Appetizer 和 SPML 渲染保持不變) ...
    // 注意：Appetizer 如果不需要分流，createInventoryCard 的最後一個參數傳 undefined 即可

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




function renderSeatLayout() {
    const filter = appElements.sideFilter ? appElements.sideFilter.value : 'ALL';
    
    appElements.seatLayout.innerHTML = '';
    if (!activeAircraftConfig || !activeAircraftConfig.rows) return;

    const routeInfo = ROUTES.find(r => r.id === currentRoute);
    const isMRoute = routeInfo && routeInfo.type === 'M';
    const isLongHaul = routeInfo && ['L', 'UL'].includes(routeInfo.type);
    const isSSRoute = routeInfo && routeInfo.type === 'SS';

    // Helper: 服務按鈕樣式
    const getServiceBtnClass = (served, skipped, cancelled) => {
        if (cancelled) return 'w-full py-1.5 px-2 mb-1 rounded border border-red-900/50 bg-red-900/10 text-red-400 text-xs line-through opacity-60'; 
        return 'w-full py-2 px-3 mb-1.5 rounded-lg border border-[#74a397] bg-[#4a7a70] hover:bg-[#5b8c82] hover:border-[#fbbf24] text-white text-sm font-bold transition-all shadow-md active:scale-95 overflow-hidden';
    };

    activeAircraftConfig.rows.forEach(row => {
        const rowContainer = document.createElement('div');
        rowContainer.className = 'grid gap-6 w-full mb-6';

        if (filter === 'ALL') {
            // 全覽模式：鎖定欄寬
            rowContainer.style.cssText = activeAircraftConfig.gridCols.replace(/1fr/g, 'minmax(0, 1fr)');
        } else {
            // 單側模式：鎖定欄寬
            rowContainer.style.cssText = 'grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);';
        }

        activeAircraftConfig.seatLetters.forEach(letter => {
            if (filter === 'L' && !['A', 'C', 'D', 'E'].includes(letter)) return;
            if (filter === 'R' && !['F', 'G', 'H', 'K'].includes(letter)) return;

            const seatId = `${row}${letter}`;
            const order = getOrder(seatId);
            if (!order) return;

            // --- 卡片顏色 ---
            let bgClass = 'bg-[#2A423D] border-gray-600 hover:border-gray-400';
            let shadowClass = 'shadow-md';
            let delayDisplayHtml = ''; 
            let dndDisplayHtml = ''; 

            if (order.serviceClosed) {
                bgClass = 'bg-[#15201c]/60 border-gray-800 opacity-50';
            }
            else if (order.status === 'ORDERED') {
                bgClass = 'bg-[#1E3630] border-[#8C5845] ring-1 ring-[#8C5845]/30';
                shadowClass = 'shadow-[0_0_15px_rgba(140,88,69,0.15)]';
            }
            else if (order.status === 'DND') {
                bgClass = 'bg-[#1a0f0f] border-red-900/60';
                dndDisplayHtml = `<div class="mt-2 bg-red-900/20 text-red-400 text-xs font-mono py-1 px-2 rounded border border-red-800/50 flex items-center justify-center gap-2"><i data-lucide="bell-off" class="w-3 h-3"></i><span class="font-bold tracking-wider">DND</span></div>`;
            }
            else if (order.status === 'DELAYED') {
                if (!order.delayUntil || order.delayUntil === 0) {
                    bgClass = 'bg-[#0f172a] border-blue-800';
                    delayDisplayHtml = `<div class="mt-2 bg-blue-900/20 text-blue-300 text-xs font-mono py-1 px-2 rounded border border-blue-500/30 flex items-center justify-center gap-2"><i data-lucide="clock" class="w-3 h-3"></i><span>Waiting</span></div>`;
                } else {
                    const now = Date.now();
                    const diffMins = Math.ceil((order.delayUntil - now) / 60000); 
                    if ((order.delayUntil - now) > 0) {
                        bgClass = 'bg-[#0f172a] border-blue-600';
                        delayDisplayHtml = `<div class="mt-2 bg-blue-900/30 text-blue-200 text-xs font-mono py-1 px-2 rounded border border-blue-400/50 flex items-center justify-center gap-2"><i data-lucide="timer" class="w-3 h-3 animate-pulse"></i><span>${diffMins}m left</span></div>`;
                    } else {
                        bgClass = 'bg-[#2a1a10] border-amber-500 animate-pulse ring-2 ring-amber-500/50';
                        delayDisplayHtml = `<div class="mt-2 bg-amber-900 text-white text-xs font-bold py-1 px-2 rounded border border-amber-500 animate-bounce">⚠️ SERVICE DUE</div>`;
                        if (!order.notificationShown && currentMode === MODES.SERVICE_MODE) {
                            playNotificationSound(); showDueServiceAlert(seatId); order.notificationShown = true; saveSystemState();
                        }
                    }
                }
            }

            const seatCard = document.createElement('div');
            seatCard.className = `seat-card p-4 rounded-xl text-center border transition-all duration-300 flex flex-col gap-2 h-full w-full ${bgClass} ${shadowClass}`;
            seatCard.style.fontFamily = '"Inter", sans-serif';

            // 座標定位
            if (filter === 'ALL') {
                if (activeAircraftConfig.colMap && activeAircraftConfig.colMap[letter]) {
                    seatCard.style.gridColumn = activeAircraftConfig.colMap[letter];
                }
            } else {
                let targetCol = 1; 
                if (currentAircraftType === 'A321neo') {
                    if (filter === 'L' && letter === 'C') targetCol = 2;
                    if (filter === 'R' && letter === 'K') targetCol = 2;
                } else {
                    if (filter === 'L' && ['D', 'E'].includes(letter)) targetCol = 2;
                    else if (filter === 'R' && ['H', 'K'].includes(letter)) targetCol = 2;
                }
                seatCard.style.gridColumn = targetCol;
            }

            // --- Header ---
            const header = document.createElement('div');
            header.className = 'flex justify-between items-start mb-1';
            let infantHtml = order.hasInfant ? `<span class="ml-2 inline-flex items-center justify-center bg-pink-600/80 text-white rounded-full p-1"><i data-lucide="baby" class="w-4 h-4"></i></span>` : '';
            header.innerHTML = `<div class="flex items-center"><p class="text-3xl font-black text-[#fbbf24] tracking-tight text-shadow-sm">${seatId}</p>${infantHtml}</div>`;

            // Tags
            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'flex gap-1 flex-wrap justify-end max-w-[60%]';
            if (order.tags) {
                order.tags.forEach(tagId => {
                    const tag = TAGS[tagId];
                    if (tag) {
                        if (tagId === 'allergic' && order.allergyNote) {
                            tagsDiv.innerHTML += `<div class="flex items-center bg-red-900/50 border border-red-700/50 rounded px-1.5 py-0.5"><i data-lucide="${tag.icon}" class="w-3 h-3 text-red-400 mr-1"></i><span class="text-[9px] font-bold text-red-300 uppercase max-w-[50px] truncate">${order.allergyNote}</span></div>`;
                        } else {
                            tagsDiv.innerHTML += `<i data-lucide="${tag.icon}" class="w-4 h-4 ${tag.color} opacity-90"></i>`;
                        }
                    }
                });
            }
            header.appendChild(tagsDiv);
            seatCard.appendChild(header);

            if (delayDisplayHtml) seatCard.innerHTML += delayDisplayHtml;
            if (dndDisplayHtml) seatCard.innerHTML += dndDisplayHtml;

            // Name
            const nameEl = document.createElement('p');
            nameEl.className = 'text-base font-bold text-white border-b border-gray-500/50 pb-2 mb-2 truncate';
            nameEl.textContent = `${order.title || ''} ${order.lastName || 'VACANT'}`;
            seatCard.appendChild(nameEl);

            // Remark
            if (order.remark) {
                seatCard.innerHTML += `<div class="text-left bg-amber-900/20 border border-amber-700/30 rounded p-1.5 mb-2 flex items-start gap-1.5"><i data-lucide="sticky-note" class="w-3 h-3 text-amber-500 mt-0.5 shrink-0"></i><span class="text-xs text-amber-200/90 italic leading-tight break-words">${order.remark}</span></div>`;
            }

            // --- Items ---
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'flex flex-col gap-1 w-full';

            if (order.status === 'ORDERED' && !order.serviceClosed) {
                
                // 按鈕內容產生器
                const createBtnContent = (iconName, text, subText = '', cnx = false) => {
                    const cnxText = cnx ? ' (CNX)' : '';
                    return `
                        <div class="flex flex-row items-center justify-center gap-2 w-full max-w-full px-1 pointer-events-none overflow-hidden">
                            ${iconName ? `<i data-lucide="${iconName}" class="w-4 h-4 shrink-0 ${cnx ? 'text-red-400' : 'text-white'}"></i>` : ''}
                            <span class="truncate text-sm tracking-wide leading-none mt-[1px] ${cnx ? 'line-through' : ''}">${text}${cnxText}</span>
                            ${subText}
                        </div>
                    `;
                };

                if (currentServicePhase === 'MEAL_1') {
                    const showStarter = isLongHaul || (isMRoute && order.appetizerChoice);
                    
                    if (showStarter && ((!order.appetizerServed && !order.appetizerSkipped) || order.appetizerCancelled)) {
                        const btn = document.createElement('div');
                        btn.className = getServiceBtnClass(false, false, order.appetizerCancelled);
                        btn.innerHTML = createBtnContent('utensils', `Starter: ${order.appetizerChoice || 'Standard'}`, '', order.appetizerCancelled);
                        btn.onclick = e => { e.stopPropagation(); handleServiceClick(e, seatId, 'appetizer'); };
                        itemsContainer.appendChild(btn);
                    }
                    
                    if (isLongHaul && ((!order.soupServed && !order.soupSkipped) || order.soupCancelled)) {
                        const btn = document.createElement('div');
                        btn.className = getServiceBtnClass(false, false, order.soupCancelled);
                        btn.innerHTML = createBtnContent('soup', 'Soup', '', order.soupCancelled);
                        btn.onclick = e => { e.stopPropagation(); handleServiceClick(e, seatId, 'soup'); };
                        itemsContainer.appendChild(btn);
                    }
                    
                    if (order.mealCode && ((!order.mealServed && !order.mealSkipped) || order.mealCancelled)) {
                        const btn = document.createElement('div');
                        btn.className = `${getServiceBtnClass(false, false, order.mealCancelled)} border-l-4 border-l-[#A08C5B]`;
                        btn.innerHTML = createBtnContent(null, `Main: ${order.mealCode}`, '', order.mealCancelled);
                        btn.onclick = e => { e.stopPropagation(); handleServiceClick(e, seatId, 'meal_1'); };
                        itemsContainer.appendChild(btn);
                    }
                    
                    let showDessertBtn = false;
                    let dessertName = 'Dessert';
                    if (order.isSPML) { if (!isSSRoute) showDessertBtn = true; } 
                    else {
                        const mData = getMeal1(order.mealCode);
                        if (mData && mData.dessert && mData.dessert !== 'ONE TRAY SERVICE') { showDessertBtn = true; dessertName = mData.dessert; }
                    }
                    if (showDessertBtn && ((!order.dessertServed && !order.dessertSkipped) || order.dessertCancelled)) {
                        const btn = document.createElement('div');
                        btn.className = getServiceBtnClass(false, false, order.dessertCancelled);
                        btn.innerHTML = createBtnContent('ice-cream', dessertName, '', order.dessertCancelled);
                        btn.onclick = e => { e.stopPropagation(); handleServiceClick(e, seatId, 'dessert'); };
                        itemsContainer.appendChild(btn);
                    }
                } else {
                    const m2Code = order.mealCode_2;
                    const isCongee = m2Code && (m2Code.includes('CON') || m2Code.includes('MCF'));
                    
                    if (isLongHaul) {
                        if (!isCongee && ((!order.yogurtServed && !order.yogurtSkipped) || order.yogurtCancelled)) {
                            const btn = document.createElement('div');
                            btn.className = getServiceBtnClass(false, false, order.yogurtCancelled);
                            btn.innerHTML = createBtnContent(null, 'Yogurt', '', order.yogurtCancelled);
                            btn.onclick = e => { e.stopPropagation(); handleServiceClick(e, seatId, 'yogurt'); };
                            itemsContainer.appendChild(btn);
                        }
                        if (order.mealCode_2 && ((!order.mealServed_2 && !order.mealSkipped_2) || order.mealCancelled_2)) {
                            const btn = document.createElement('div');
                            btn.className = `${getServiceBtnClass(false, false, order.mealCancelled_2)} border-l-4 border-l-blue-400`;
                            btn.innerHTML = createBtnContent(null, `M2: ${order.mealCode_2}`, '', order.mealCancelled_2);
                            btn.onclick = e => { e.stopPropagation(); handleServiceClick(e, seatId, 'meal_2'); };
                            itemsContainer.appendChild(btn);
                        }
                        if ((!order.fruitServed && !order.fruitSkipped) || order.fruitCancelled) {
                            const btn = document.createElement('div');
                            btn.className = getServiceBtnClass(false, false, order.fruitCancelled);
                            btn.innerHTML = createBtnContent('apple', 'Fruit', '', order.fruitCancelled);
                            btn.onclick = e => { e.stopPropagation(); handleServiceClick(e, seatId, 'fruit'); };
                            itemsContainer.appendChild(btn);
                        }
                    }
                }

                // --- 飲料顯示 (Short Name) ---
                const currentBevs = (currentServicePhase === 'MEAL_1') ? order.beverages : order.beverages_2;
                if (currentBevs && currentBevs.length > 0) {
                    currentBevs.forEach((bev, idx) => {
                        if ((!bev.served && !bev.skipped) || bev.cancelled) {
                            const btn = document.createElement('div');
                            btn.className = `flex flex-row items-center justify-center ${getServiceBtnClass(false, false, bev.cancelled)}`;
                            
                            const styleText = (bev.style && bev.style !== 'Normal') ? ` <span class="text-[10px] text-amber-200 ml-1 font-normal shrink-0">(${bev.style})</span>` : '';
                            
                            // [關鍵] 使用 getBeverageShort 取得縮寫
                            const displayName = getBeverageShort(bev.name);

                            btn.innerHTML = `
                                <div class="flex flex-row items-center justify-center gap-2 w-full max-w-full px-1 pointer-events-none overflow-hidden">
                                    <i data-lucide="coffee" class="w-4 h-4 shrink-0 text-white"></i> 
                                    <span class="truncate text-sm tracking-wide leading-none mt-[1px]">${displayName}</span>
                                    ${styleText}
                                </div>
                            `;
                            
                            const targetType = (currentServicePhase === 'MEAL_1') ? 'drink_1' : 'drink_2';
                            btn.onclick = e => { e.stopPropagation(); handleServiceClick(e, seatId, targetType, idx); };
                            itemsContainer.appendChild(btn);
                        }
                    });
                }
            }
            seatCard.appendChild(itemsContainer);

            // Summary
            const summaryDiv = document.createElement('div');
            summaryDiv.className = 'text-xs text-left opacity-70 flex flex-col gap-0.5 mt-auto pt-2 border-t border-gray-500/30';
            
            const currentBevs = (currentServicePhase === 'MEAL_1') ? order.beverages : order.beverages_2;
            if (currentBevs) {
                currentBevs.forEach(bev => {
                    if (bev.served || bev.skipped) {
                        const styleText = (bev.style && bev.style !== 'Normal') ? ` <span class="opacity-70">[${bev.style}]</span>` : '';
                        // [關鍵] Summary 也顯示縮寫
                        const displayName = getBeverageShort(bev.name);
                        summaryDiv.innerHTML += `<div class="line-through text-gray-400 italic">✓ ${displayName}${styleText}</div>`;
                    }
                });
            }
            if (order.appetizerServed) summaryDiv.innerHTML += `<div class="text-gray-400">✓ Starter Done</div>`;
            if (order.soupServed) summaryDiv.innerHTML += `<div class="text-gray-400">✓ Soup Done</div>`;
            if (order.mealServed) summaryDiv.innerHTML += `<div class="text-[#fbbf24] font-bold">✓ ${order.mealCode}</div>`; 
            if (order.dessertServed) summaryDiv.innerHTML += `<div class="text-gray-400">✓ Dessert Done</div>`;
            if (order.yogurtServed) summaryDiv.innerHTML += `<div class="text-gray-400">✓ Yogurt Done</div>`;
            if (order.mealServed_2) summaryDiv.innerHTML += `<div class="text-[#fbbf24] font-bold">✓ M2: ${order.mealCode_2}</div>`;
            if (order.fruitServed) summaryDiv.innerHTML += `<div class="text-gray-400">✓ Fruit Done</div>`;

            seatCard.appendChild(summaryDiv);

            seatCard.onclick = () => {
                if (order.status === 'DND') openDndActionModal(seatId);
                else if (order.status === 'DELAYED') openDelayActionModal(seatId);
                else openOrderModal(seatId);
            };

            rowContainer.appendChild(seatCard);
        }); 

        if (rowContainer.children.length > 0) appElements.seatLayout.appendChild(rowContainer);
    });

    lucide.createIcons();
    renderOrderSummaryAggregate();
}
// [最終修正版] renderOrderSummaryAggregate - 解決捲動跳回頂部的問題
function renderOrderSummaryAggregate() {
    // --- [關鍵修正 1] 重繪前，先記住目前的捲動位置 ---
    const scrollContainer = document.getElementById('beverage-scroll-container');
    let savedScrollTop = 0;
    if (scrollContainer) {
        savedScrollTop = scrollContainer.scrollTop;
    }
    // ----------------------------------------------

    appElements.summaryList.innerHTML = '';

    // --- 1. 資料統計 ---
    const mealCounts = {};
    const bevCounts = {}; 
    let totalMealOrders = 0;

    orders.forEach(o => {
        if (['ORDERED', 'DELAYED', 'DND'].includes(o.status)) {
            
            // A. 統計主餐
            let code = (currentServicePhase === 'MEAL_1') ? o.mealCode : o.mealCode_2;
            if (code && code !== 'NO MEAL') {
                totalMealOrders++;
                mealCounts[code] = (mealCounts[code] || 0) + 1;
            }

            // B. 統計飲料
            const currentBevs = (currentServicePhase === 'MEAL_1') ? o.beverages : o.beverages_2;
            if (currentBevs && currentBevs.length > 0) {
                currentBevs.forEach(b => {
                    if (!b.served && !b.skipped) {
                        // 1. 找出類別
                        let category = 'Others';
                        for (const [catName, list] of Object.entries(BEVERAGE_CATEGORIES)) {
                            if (list.some(item => item.full === b.name)) {
                                category = catName;
                                break;
                            }
                        }
                        // 2. 初始化並計數
                        if (!bevCounts[category]) bevCounts[category] = {};
                        const fullName = b.name + (b.style ? ` (${b.style})` : '');
                        bevCounts[category][fullName] = (bevCounts[category][fullName] || 0) + 1;
                    }
                });
            }
        }
    });

    // --- 2. 產生 HTML (左欄：餐點) ---
    const mealPhaseTitle = (currentServicePhase === 'MEAL_1') ? '1st Meal' : '2nd Meal';
    let leftPanelHtml = `
        <div class="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-lg h-full">
            <h3 class="text-amber-400 font-bold  uppercase text-lg mb-4 border-l-4 border-amber-500 pl-3">
                Meals Summary <span class="text-gray-400 text-sm font-normal">(${totalMealOrders} seats)</span>
            </h3>
            <div class="space-y-4">
                <div>
                    <h4 class="text-amber-200/80 font-bold text-sm uppercase mb-2 border-b border-gray-700 pb-1">${mealPhaseTitle}</h4>
                    <div class="space-y-2">`;
    
    if (Object.keys(mealCounts).length === 0) {
        leftPanelHtml += `<p class="text-gray-500 italic text-sm">No meals ordered yet.</p>`;
    } else {
        for (const [code, count] of Object.entries(mealCounts)) {
            leftPanelHtml += `
                <div class="flex justify-between items-center text-gray-200">
                    <span class="font-medium">${code}</span>
                    <span class="font-bold text-amber-400 text-lg">${count}</span>
                </div>`;
        }
    }
    leftPanelHtml += `</div></div></div></div>`;

    // --- 3. 產生 HTML (右欄：飲料 - 含打勾功能) ---
    // [關鍵修正 2] 這裡加上 id="beverage-scroll-container" 讓我們可以抓到它
    let rightPanelHtml = `
        <div class="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-lg h-full flex flex-col">
            <h3 class="text-amber-400 font-bold uppercase text-lg mb-4 border-l-4 border-amber-500 pl-3 shrink-0">
                Beverages Summary
            </h3>
            <h4 class="text-white font-bold text-sm uppercase mb-4 border-b border-gray-600 pb-2 shrink-0">
                ${mealPhaseTitle} Beverages
            </h4>
            <div id="beverage-scroll-container" class="space-y-5 custom-scrollbar overflow-y-auto pr-2 flex-1">`;

    const categoryOrder = Object.keys(BEVERAGE_CATEGORIES);
    
    if (Object.keys(bevCounts).length === 0) {
        rightPanelHtml += `<p class="text-gray-500 italic text-sm">No pending beverages.</p>`;
    } else {
        categoryOrder.forEach(catName => {
            const items = bevCounts[catName];
            if (items) {
                rightPanelHtml += `
                    <div>
                        <h5 class="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-2 sticky top-0 bg-gray-800 py-1 z-10">${catName}</h5>
                        <div class="space-y-1.5">`;
                
                for (const [name, count] of Object.entries(items)) {
                    // 產生 Key 並檢查是否已打勾
                    const key = `${catName}_${name}`;
                    const isDone = beverageSummaryDoneState[key];
                    
                    // 處理單引號跳脫問題 (例如 Jack Daniel's)
                    const safeCat = catName.replace(/'/g, "\\'");
                    const safeName = name.replace(/'/g, "\\'");

                    // 根據狀態決定 Icon 樣式
                    const iconHtml = isDone 
                        ? `<div class="w-5 h-5 rounded-full bg-green-500 border border-green-500 flex items-center justify-center text-white shadow-md transition-all scale-110"><i data-lucide="check" class="w-3 h-3 stroke-[3]"></i></div>` // 實心勾勾
                        : `<div class="w-5 h-5 rounded-full border-2 border-gray-500 hover:border-amber-400 hover:bg-gray-700 transition-all"></div>`; // 空心圓圈
                    
                    // 整個項目 (Row) 點擊都可以觸發
                    const opacityClass = isDone ? 'opacity-40' : 'opacity-100'; // 打勾後整行變半透明
                    
                    rightPanelHtml += `
                        <div class="flex justify-between items-center group cursor-pointer select-none p-1 rounded hover:bg-white/5 transition-colors ${opacityClass}" 
                             onclick="toggleBeverageDone('${safeCat}', '${safeName}')">
                            <span class="text-gray-300 text-sm group-hover:text-white transition-colors">${name}</span>
                            <div class="flex items-center gap-3">
                                <span class="font-bold text-white text-lg">${count}</span>
                                ${iconHtml}
                            </div>
                        </div>`;
                }
                rightPanelHtml += `</div></div>`;
            }
        });
    }
    rightPanelHtml += `</div></div>`;

    appElements.summaryList.innerHTML = leftPanelHtml + rightPanelHtml;
    lucide.createIcons(); // 重新渲染勾勾圖示

    // --- [關鍵修正 3] 重繪完成後，馬上恢復捲動位置 ---
    const newScrollContainer = document.getElementById('beverage-scroll-container');
    if (newScrollContainer) {
        newScrollContainer.scrollTop = savedScrollTop;
    }
    // ----------------------------------------------
}

// [最終完整版] renderServiceSummary: 包含狀態顯示與 Undo 復原功能
// [最終修正版] renderServiceSummary: 改用純文字 "Undo" 按鈕
function renderServiceSummary(order) {
    let html = '<div class="space-y-3 p-4 bg-gray-50 rounded-lg text-sm">';
    html += `<h4 class="text-lg font-semibold text-gray-800">Service Summary for ${order.id}</h4>`;
    
    // Helper: 產生狀態列
    const getStatusRow = (label, served, skipped, cancelled, itemType, index = null) => {
        // 判斷是否已結束流程
        const isDone = served || skipped || cancelled;
        
        let statusText = 'Pending';
        let color = 'text-gray-500';
        let icon = '○';
        let rowClass = 'py-2 border-b border-gray-100'; // 稍微增加一點垂直間距

        if (served) { statusText = 'Served'; color = 'text-green-600 font-bold'; icon = '✓'; }
        else if (skipped) { statusText = 'Skipped'; color = 'text-yellow-600'; icon = '⊘'; }
        else if (cancelled) { 
            statusText = 'Cancelled'; 
            color = 'text-red-500 font-bold'; 
            icon = '✕'; 
            rowClass += ' bg-red-50 opacity-75'; 
        }
        
        // [修改] Undo 按鈕：改用純文字，樣式更像按鈕
        const undoBtn = isDone 
            ? `<button onclick="handleUndoService('${order.id}', '${itemType}'${index !== null ? `, ${index}` : ''})" 
                       class="ml-3 px-3 py-1 bg-white border border-gray-300 rounded text-xs font-bold text-gray-600 hover:bg-red-50 hover:text-red-500 hover:border-red-300 shadow-sm transition-all">
                   Undo
               </button>` 
            : '';

        // 標籤樣式
        const labelStyle = cancelled ? 'line-through text-gray-400' : 'font-medium text-gray-700';

        return `<div class="flex justify-between items-center ${rowClass}">
                    <span class="${labelStyle}">${label}</span>
                    <div class="flex items-center">
                        <span class="${color} flex items-center gap-1 text-xs uppercase font-bold tracking-wide">${icon} ${statusText}</span>
                        ${undoBtn}
                    </div>
                </div>`;
    };

    // --- 1st Meal Flow ---
    if (order.mealCode) {
        html += `<h5 class="font-bold text-amber-600 border-b pb-1 mt-3 mb-2">1st Meal Service</h5>`;
        
        // 1. Starter
        if (order.appetizerChoice) {
            html += getStatusRow(`Starter: ${order.appetizerChoice}`, order.appetizerServed, order.appetizerSkipped, order.appetizerCancelled, 'appetizer');
        }
        
        // 2. Soup
        html += getStatusRow(`Soup: Standard`, order.soupServed, order.soupSkipped, order.soupCancelled, 'soup');

        // 3. Main
        html += getStatusRow(`Main: ${order.mealCode}`, order.mealServed, order.mealSkipped, order.mealCancelled, 'meal_1');
        
        // 4. Beverages (1st Meal)
        if (order.beverages && order.beverages.length > 0) {
            html += `<div class="py-2 border-b border-gray-100 bg-gray-50/50 rounded mt-1">
                        <span class="block font-bold text-gray-600 mb-1 px-2 text-xs uppercase">Beverages (Meal 1)</span>
                        <div class="pl-2 pr-2 space-y-1">`;
            order.beverages.forEach((b, idx) => {
                const label = `${b.name} ${b.style ? `(${b.style})` : ''}`;
                html += getStatusRow(label, b.served, b.skipped, b.cancelled, 'drink_1', idx);
            });
            html += `</div></div>`;
        }

        // 5. Dessert
        const meal1 = getMeal1(order.mealCode);
        const isOneTray = (meal1 && meal1.dessert === 'ONE TRAY SERVICE');
        if (!isOneTray) {
            html += getStatusRow(`Dessert: ${meal1 ? meal1.dessert : 'Dessert'}`, order.dessertServed, order.dessertSkipped, order.dessertCancelled, 'dessert');
        }
    }

    // --- 2nd Meal Flow ---
    if (order.mealCode_2) {
        html += `<h5 class="font-bold text-blue-600 border-b pb-1 mt-4 mb-2">2nd Meal Service</h5>`;
        
        const m2Code = order.mealCode_2;
        const isCongee = m2Code.includes('CON') || m2Code.includes('MCF') || (order.mealName_2 && order.mealName_2.toUpperCase().includes('CONGEE'));

        // 1. Yogurt
        if (!isCongee) {
            html += getStatusRow(`Yogurt: Standard`, order.yogurtServed, order.yogurtSkipped, order.yogurtCancelled, 'yogurt');
        }

        // 2. Main (Meal 2)
        html += getStatusRow(`Main: ${order.mealCode_2}`, order.mealServed_2, order.mealSkipped_2, order.mealCancelled_2, 'meal_2');

        // 3. Beverages (2nd Meal)
        if (order.beverages_2 && order.beverages_2.length > 0) {
            html += `<div class="py-2 border-b border-gray-100 bg-gray-50/50 rounded mt-1">
                        <span class="block font-bold text-gray-600 mb-1 px-2 text-xs uppercase">Beverages (Meal 2)</span>
                        <div class="pl-2 pr-2 space-y-1">`;
            order.beverages_2.forEach((b, idx) => {
                const label = `${b.name} ${b.style ? `(${b.style})` : ''}`;
                html += getStatusRow(label, b.served, b.skipped, b.cancelled, 'drink_2', idx);
            });
            html += `</div></div>`;
        }

        // 4. Fruit
        html += getStatusRow(`Fruit: Standard`, order.fruitServed, order.fruitSkipped, order.fruitCancelled, 'fruit');
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

// [修正版 - Dark Theme] setupInventoryInputs
// [修正版 - White & Gold Theme] setupInventoryInputs
function setupInventoryInputs() {
    const selectedRouteId = appElements.routeSelect.value;
    const routeInfo = ROUTES.find(r => r.id === selectedRouteId);
    
    const routeMenus = MENUS[selectedRouteId] || { meal_1: [], meal_2: [], appetizers: [] };
    activeMeals_1 = routeMenus.meal_1 || [];
    activeMeals_2 = routeMenus.meal_2 || [];
    const activeAppetizers = routeMenus.appetizers || [];
    
    const needsAppetizer = routeInfo && ['M', 'L', 'UL'].includes(routeInfo.type);
    const needsSecondMeal = routeInfo && ['L', 'UL'].includes(routeInfo.type);

    appElements.inventoryInputsContainer.innerHTML = '';
    
    // Helper: 產生白底+企業色輸入條
    const createInputRow = (code, name, chinese, qtyId, existingQty) => `
        <div class="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg mb-2 shadow-sm hover:border-[#8C5845]/30 transition-colors group">
            <div class="flex-1 pr-4">
                <div class="font-bold text-[#424649] text-sm mb-0.5 tracking-wide group-hover:text-[#8C5845] transition-colors">${code}</div>
                <div class="text-xs text-gray-500">${name}</div>
                <div class="text-[10px] text-gray-400 italic">${chinese || ''}</div>
            </div>
            <input type="number" id="${qtyId}" 
                   class="w-16 py-1.5 px-2 bg-slate-50 border border-gray-200 rounded-lg text-center font-bold text-lg text-[#424649] focus:ring-2 focus:ring-[#8C5845]/20 focus:border-[#8C5845] focus:outline-none" 
                   min="0" value="${existingQty}">
        </div>
    `;

    // --- 1. Appetizers ---
    if (needsAppetizer && activeAppetizers.length > 0) {
        appElements.inventoryInputsContainer.innerHTML += `
            <h4 class="text-[10px] font-bold text-[#8C5845] mb-2 mt-2 flex items-center gap-2 uppercase tracking-wider">
                <i data-lucide="utensils" class="w-3 h-3"></i> Starter
            </h4>`;
        activeAppetizers.forEach(app => {
            const qty = (isEditingInventory && appetizerInventory) ? (appetizerInventory[app.code] || 0) : 0;
            appElements.inventoryInputsContainer.innerHTML += createInputRow(app.code, app.name, app.chinese, `qty-appetizer-${app.code}`, qty);
        });
    }

    // --- 2. 1st Meal ---
    if (activeMeals_1.length > 0) {
        appElements.inventoryInputsContainer.innerHTML += `
            <h4 class="text-[10px] font-bold text-[#8C5845] mb-2 mt-6 flex items-center gap-2 uppercase tracking-wider">
                <i data-lucide="flame" class="w-3 h-3"></i> 1st Meal
            </h4>`;
        activeMeals_1.forEach(meal => {
            const qty = (isEditingInventory && mealInventory_1) ? (mealInventory_1[meal.code] || 0) : 0;
            appElements.inventoryInputsContainer.innerHTML += createInputRow(meal.code, meal.name, meal.chinese, `qty-1-${meal.code}`, qty);
        });
    }

    // --- 3. 2nd Meal ---
    const container2 = document.getElementById('inventory-inputs-container-2');
    if (container2) {
        const showSecondMeal = needsSecondMeal && activeMeals_2.length > 0;
        container2.innerHTML = '';
        container2.classList.toggle('hidden', !showSecondMeal);
        
        if (showSecondMeal) {
            container2.innerHTML += `
                <h4 class="text-[10px] font-bold text-[#85724E] mb-2 mt-6 flex items-center gap-2 uppercase tracking-wider">
                    <i data-lucide="moon" class="w-3 h-3"></i> 2nd Meal
                </h4>`;
            activeMeals_2.forEach(meal => {
                const qty = (isEditingInventory && mealInventory_2) ? (mealInventory_2[meal.code] || 0) : 0;
                container2.innerHTML += createInputRow(meal.code, meal.name, meal.chinese, `qty-2-${meal.code}`, qty);
            });
        }
    }
    
    lucide.createIcons();
    renderPreSelectInputs(); 
}
// [FIXED] renderPreSelectInputs: Now pre-fills data from existing orders
function renderPreSelectInputs() {
    const grid = document.getElementById('preselect-grid');
    grid.innerHTML = '';
    
    const aircraftType = appElements.aircraftSelect.value;
    const config = AIRCRAFT_CONFIGS[aircraftType];
    const routeId = appElements.routeSelect.value;
    
    const meals1 = MENUS[routeId]?.meal_1 || [];
    const meals2 = MENUS[routeId]?.meal_2 || []; 
    const appetizers = MENUS[routeId]?.appetizers || [];
    
    const routeInfo = ROUTES.find(r => r.id === routeId);
    const isMRoute = routeInfo && routeInfo.type === 'M';
    const isLongHaul = routeInfo && ['L', 'UL'].includes(routeInfo.type);

    if (!config || !meals1.length) return;

    const seatIds = [];
    config.rows.forEach(row => {
        config.seatLetters.forEach(letter => {
             if (aircraftType === 'A350-900' && row === '8' && (letter === 'A' || letter === 'K')) return;
             if (aircraftType === 'A330-900neo') {
                const isEven = parseInt(row) % 2 === 0;
                if (isEven && !['A','E','F','K'].includes(letter)) return;
                if (!isEven && !['C','D','G','H'].includes(letter)) return;
             }
            seatIds.push(`${row}${letter}`);
        });
    });

    seatIds.forEach(seatId => {
        // --- [關鍵修改] 嘗試取得已存在的訂單資料 ---
        const existingOrder = getOrder(seatId); 
        const lastNameVal = existingOrder ? (existingOrder.lastName || '') : '';
        const currentMealCode = existingOrder ? existingOrder.mealCode : '';
        const currentMealCode2 = existingOrder ? existingOrder.mealCode_2 : '';
        const currentApp = existingOrder ? existingOrder.appetizerChoice : '';
        const isSPML = existingOrder ? existingOrder.isSPML : false;
        // ----------------------------------------

        const div = document.createElement('div');
        div.className = 'bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3 transition-all duration-300 hover:border-[#8C5845]/50 hover:shadow-md';
        div.id = `preselect-card-${seatId}`;
        
        const selectClass = "w-full text-[12px] p-2 border border-gray-300 rounded bg-white text-[#424649] outline-none focus:border-[#8C5845] focus:ring-1 focus:ring-[#8C5845]/20";
        const labelClass = "text-[10px] text-gray-500 font-bold uppercase block mb-1";

        // 產生 Meal 1 選項 (如果有值就 selected)
        let meal1Options = `<option value="">-- No Meal --</option>`;
        meals1.forEach(m => { 
            const isSelected = (!isSPML && m.code === currentMealCode) ? 'selected' : '';
            meal1Options += `<option value="${m.code}" ${isSelected}>${m.code}</option>`; 
        });

        // 產生 SPML 選項 (如果有值就 selected)
        let spmlOptions = `<option value="">-- Select SPML --</option>`;
        Object.keys(ICAO_SPML_CODES).forEach(code => {
            const isSelected = (isSPML && code === currentMealCode) ? 'selected' : '';
            spmlOptions += `<option value="${code}" ${isSelected}>${ICAO_SPML_CODES[code]}</option>`;
        });

        let meal2SectionHTML = '';
        if (isLongHaul && meals2.length > 0) {
            let meal2Options = `<option value="">-- No Meal 2 --</option>`;
            meals2.forEach(m => { 
                const isSelected = (!isSPML && m.code === currentMealCode2) ? 'selected' : '';
                meal2Options += `<option value="${m.code}" ${isSelected}>${m.code}</option>`; 
            });
            meal2SectionHTML = `
                <div id="m2-container-${seatId}" class="pt-2 border-t border-dashed border-gray-200">
                    <label class="${labelClass} text-[#85724E]">2nd Meal Choice</label>
                    <select id="preselect-m2-${seatId}" class="${selectClass} border-[#85724E]/30 focus:border-[#85724E]">
                        ${meal2Options}
                    </select>
                </div>
            `;
        }

        let appSectionHTML = '';
        if (isMRoute && appetizers.length > 0) {
            let appOptions = `<option value="">-- No App. --</option>`;
            appetizers.forEach(a => { 
                const isSelected = (!isSPML && a.code === currentApp) ? 'selected' : '';
                appOptions += `<option value="${a.code}" ${isSelected}>${a.code}</option>`; 
            });
            appSectionHTML = `
                <div id="app-container-${seatId}" class="pt-2 border-t border-dashed border-gray-200">
                    <label class="${labelClass} text-[#8C5845]">Pre-Select Appetizer</label>
                    <select id="preselect-app-${seatId}" class="${selectClass} border-[#8C5845]/30 focus:border-[#8C5845]">
                        ${appOptions}
                    </select>
                </div>
            `;
        }

        div.innerHTML = `
            <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-black px-2 py-0.5 rounded bg-[#8C5845]/10 text-[#8C5845] border border-[#8C5845]/20">${seatId}</span>
                <span class="text-[10px] text-gray-400 font-bold uppercase">Online Record</span>
            </div>
            <input type="text" id="preselect-name-${seatId}" class="${selectClass} placeholder-gray-300 font-bold uppercase tracking-wide" placeholder="LAST NAME" value="${lastNameVal}">

            <div class="space-y-3">
                <div id="normal-meal-container-${seatId}">
                    <label class="${labelClass}">1st Meal Choice</label>
                    <select id="preselect-${seatId}" class="${selectClass}">
                        ${meal1Options}
                    </select>
                </div>
                
                ${meal2SectionHTML}
                ${appSectionHTML}

                <div id="spml-container-${seatId}" class="hidden">
                    <div class="flex justify-between items-center mb-1">
                        <label class="${labelClass} text-[#0d1a26]">Special Meal (SPML)</label>
                        <button type="button" onclick="toggleSPMLMode('${seatId}', false)" class="text-[9px] text-[#8C5845] underline hover:text-[#9C6D56]">Back to Normal</button>
                    </div>
                    <select id="preselect-spml-${seatId}" class="${selectClass} border-[#0d1a26]/30 text-[#0d1a26] bg-[#0d1a26]/5">
                        ${spmlOptions}
                    </select>
                </div>

                <button type="button" id="btn-spml-toggle-${seatId}" onclick="toggleSPMLMode('${seatId}', true)" 
                        class="w-full py-1.5 border border-[#0d1a26]/20 text-[#0d1a26] text-[11px] font-bold rounded-lg hover:bg-[#0d1a26]/5 transition-colors flex items-center justify-center gap-1">
                    <i data-lucide="star" class="w-3 h-3"></i> Switch to SPML
                </button>
            </div>
        `;
        grid.appendChild(div);

        // --- [關鍵修改] 如果原本就是 SPML，載入時就要切換顯示狀態 ---
        if (isSPML) {
            // 這裡我們直接呼叫 toggleSPMLMode 來設定 UI 狀態
            // 注意：因為上面 HTML 已經產生並 append 了，所以 toggleSPMLMode 可以抓到元素
            toggleSPMLMode(seatId, true);
        }
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
    
    //appElements.aircraftTypeDisplay.textContent = `Business Class Meal & Beverage Selection (${activeAircraftConfig.name})`;

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
            order.isPreSelect = true; // 標記為預選 
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
        saveSystemState(); // <--- [加入這行]
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


// [CRITICAL FIX] setupMealOptions - 分離預選餐點與一般庫存
function setupMealOptions(container, mealList, inventory, radioName, currentMealCode, orderStatus) {
    container.innerHTML = '';
    
    mealList.forEach(meal => {
        // --- [關鍵修正] 計算已點數量時，排除「預選餐點」 ---
        const totalOrdered = orders.filter(o => 
            // 條件 1: 必須是同一道菜
            ((radioName === 'meal_1' && o.mealCode === meal.code) || 
             (radioName === 'meal_2' && o.mealCode_2 === meal.code)) &&
            
            // 條件 2: 狀態必須是有效訂單
            (o.status === 'ORDERED' || o.status === 'DELAYED') &&
            
            // 條件 3: [重要] 必須「不是」預選餐點 (預選的不扣一般庫存)
            !o.isPreSelect && !o.isMeal2PreSelect &&
            
            // 條件 4: 不是 SPML
            !o.isSPML && !o.isSPML_2
        ).length;
        
        // 計算剩餘庫存 (總裝載量 - 現場點餐量)
        const remaining = (inventory[meal.code] || 0) - totalOrdered;
        
        // 判斷是否選中與是否停用
        const isCurrentlySelected = meal.code === currentMealCode;
        // 如果還有剩餘，或者雖然沒剩但這就是當前乘客選的(避免被鎖住)，則可以選
        const isDisabled = remaining <= 0 && !isCurrentlySelected;

        const label = document.createElement('label');
        label.className = `flex items-center p-3 border rounded-lg transition cursor-pointer shadow-sm ${isDisabled ? 'disabled-option bg-gray-100' : 'hover:bg-gray-50'}`;
        
        // 顯示邏輯：如果有剩餘顯示綠色，沒剩顯示紅色
        const qtyDisplay = remaining <= 0 && !isCurrentlySelected 
            ? `<span class="font-bold text-red-500">0</span>` 
            : `<span class="font-bold text-green-600">${remaining}</span>`;

        label.innerHTML = `
            <input type="radio" name="${radioName}" value="${meal.code}" class="form-radio h-5 w-5 text-amber-500" ${isDisabled ? 'disabled' : ''}>
            <span class="ml-3 font-medium ${isDisabled ? 'text-gray-500' : 'text-gray-800'}">
                ${meal.code} - ${meal.name} (Qty: ${qtyDisplay})
                <span class="text-xs text-gray-500 block">(${meal.chinese})</span>
            </span>`;
        container.appendChild(label);
    });

    // 加入 "NO MEAL" 選項
    const noMealLabel = document.createElement('label');
    noMealLabel.className = 'flex items-center p-3 border rounded-lg transition cursor-pointer shadow-sm hover:bg-gray-50';
    noMealLabel.innerHTML = `
        <input type="radio" name="${radioName}" value="NO MEAL" class="form-radio h-5 w-5 text-gray-500">
        <span class="ml-3 font-medium text-gray-800">NO MEAL (不需主餐)</span>
    `;
    container.appendChild(noMealLabel);
    
    // 恢復選取狀態
    if (currentMealCode === 'NO MEAL') {
        noMealLabel.querySelector('input').checked = true;
    }
    const existingRadio = container.querySelector(`input[name="${radioName}"][value="${currentMealCode}"]`);
    if (existingRadio) {
        existingRadio.checked = true;
    }
}

// [MODIFIED] setupBeverageOptions
// [最終修正版 v9] setupBeverageOptions - 啟用飲料客製化選項 (冰塊/溫度/喝法)
function setupBeverageOptions(container, selectedBeverages = [], checkboxName = 'beverage') {
    container.innerHTML = '';
    
    // 1. 定義各類型的選項內容
    const STYLE_MAP = {
        'ice': ['Normal', 'Less Ice', 'No Ice', 'Warm','+Lemon','Ice+Lemon','Less Ice + Lemon','No Ice + Lemon','Warm with Lemon' ],
        'temp': ['Hot', 'Iced','Warm','Hot With Milk', 'Hot With Sugar', 'Hot With Milk & Sugar','Iced With Milk', 'Iced With Sugar', 'Iced With Milk & Sugar'],
        'whisky': ['Neat', 'On the Rocks', 'Water Splash','Mizuwali'], // 您提到的 On the Rock
        'soda_ice': ['Normal', 'Less Ice', 'No Ice','with Lemon','Less Ice + Lemon','No Ice + Lemon'],
        'juice': ['Normal','With Ice', 'Less Ice', 'No Ice']
        //'Coffee': ['Black', 'With Milk', 'With Sugar', 'With Milk & Sugar'],
    };

    // 定義兩大分類
    const groups = {
        nonAlcoholic: ['WATER', 'Mocktails (Non-alcoholic)', 'Soda & Soft Dr.', 'Juices & Milks', 'Coffee, Teas & Others', 'STARLUX Limited'],
        alcoholic: ['Specialty Cocktails', 'Cocktails', 'Champagne & White Wine', 'Red Wine & Port', 'Whisky', 'Spirits & Liqueurs', 'Beer']
    };

    const mainDiv = document.createElement('div');
    mainDiv.className = 'bev-main-container';

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
            itemsGrid.className = 'grid grid-cols-1 gap-2 p-1';

            BEVERAGE_CATEGORIES[category].forEach(bev => {
                const existing = selectedBeverages.find(b => b.name === bev.full);
                const isChecked = !!existing;
                
                // 檢查此飲料是否有對應的選項類型
                const options = bev.type ? STYLE_MAP[bev.type] : null;

                const card = document.createElement('div');
                card.className = `beverage-item-card p-2 rounded-lg border transition-all ${isChecked ? 'ring-1 ring-amber-500 bg-amber-50 border-amber-300' : 'bg-white border-gray-200'}`;
                
                let html = `
                    <label class="flex items-center cursor-pointer select-none">
                        <input type="checkbox" name="${checkboxName}" value="${bev.full}" 
                               class="form-checkbox h-5 w-5 text-amber-600 rounded focus:ring-amber-500" ${isChecked ? 'checked' : ''}>
                        <div class="ml-3">
                            <span class="font-bold block text-gray-800 text-sm">${bev.full}</span>
                        </div>
                    </label>
                `;

                // --- [新增] 如果有選項，就插入下拉選單 ---
                if (options) {
                    const savedStyle = existing ? existing.style : '';
                    const selectHideClass = isChecked ? '' : 'hidden'; // 沒勾選就隱藏
                    
                    let optionsHtml = options.map(opt => 
                        `<option value="${opt}" ${opt === savedStyle ? 'selected' : ''}>${opt}</option>`
                    ).join('');
                    
                    html += `
                        <select class="beverage-style-select w-full mt-2 p-1.5 text-xs border border-gray-300 rounded bg-white text-gray-700 outline-none focus:border-amber-500 ${selectHideClass}">
                            ${optionsHtml}
                        </select>
                    `;
                }
                // ----------------------------------------

                card.innerHTML = html;
                itemsGrid.appendChild(card);

                // --- [新增] 事件監聽：勾選時顯示選單，取消時隱藏 ---
                const checkbox = card.querySelector('input[type="checkbox"]');
                const select = card.querySelector('select');
                
                checkbox.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        card.classList.replace('bg-white', 'bg-amber-50');
                        card.classList.replace('border-gray-200', 'border-amber-300');
                        card.classList.add('ring-1', 'ring-amber-500');
                        if (select) select.classList.remove('hidden');
                    } else {
                        card.classList.replace('bg-amber-50', 'bg-white');
                        card.classList.replace('border-amber-300', 'border-gray-200');
                        card.classList.remove('ring-1', 'ring-amber-500');
                        if (select) select.classList.add('hidden');
                    }
                });
            });

            panel.appendChild(itemsGrid);
            groupDiv.appendChild(trigger);
            groupDiv.appendChild(panel);
            
            trigger.onclick = (e) => {
                e.preventDefault();
                const isOpen = panel.classList.contains('open');
                panel.classList.toggle('open', !isOpen);
                trigger.classList.toggle('active', !isOpen);
                trigger.querySelector('[data-lucide="chevron-down"]').style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)'; // 修正箭頭方向
            };

            groupWrapper.appendChild(groupDiv);
        });
        return groupWrapper;
    };

    mainDiv.appendChild(renderGroup('SOFT DRINKS & COFFEE', groups.nonAlcoholic, 'coffee'));
    mainDiv.appendChild(renderGroup('WINE & COCKTAILS', groups.alcoholic, 'wine'));

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
    saveSystemState(); // <--- [加入這行]
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

// [NEW] 處理服務動作 (Served / Skip / Cancel)
// [修改] handleServiceAction - 改為標記取消，而非刪除資料
function handleServiceAction(action) {
    const order = getOrder(currentSeatId);
    if (!order) return;
    appElements.serviceActionModal.classList.add('hidden');
    
    // --- 區塊 A: Served / Skip (保持不變) ---
    if (action === 'Served' || action === 'Skip') {
        const isServed = action === 'Served';
        const isSkipped = action === 'Skip';
        
        // 注意：如果原本是 Cancelled 狀態，設為 Served/Skip 時應自動取消 Cancelled
        if (serviceTarget === 'meal_1') { 
            order.mealServed = isServed; order.mealSkipped = isSkipped; order.mealCancelled = false;
            // One Tray 邏輯保持...
            const meal = getMeal1(order.mealCode);
            if ((meal && meal.dessert === 'ONE TRAY SERVICE') || (order.isSPML && ['TPE-HKG', 'TPE-SHI', 'TPE-OKA'].includes(currentRoute))) {
                order.dessertServed = isServed; order.dessertSkipped = isSkipped; order.dessertCancelled = false;
                order.soupServed = isServed; order.soupSkipped = isSkipped; order.soupCancelled = false;
            }
        } 
        else if (serviceTarget === 'appetizer') { order.appetizerServed = isServed; order.appetizerSkipped = isSkipped; order.appetizerCancelled = false; } 
        else if (serviceTarget === 'soup') { order.soupServed = isServed; order.soupSkipped = isSkipped; order.soupCancelled = false; }
        else if (serviceTarget === 'meal_2') { order.mealServed_2 = isServed; order.mealSkipped_2 = isSkipped; order.mealCancelled_2 = false; } 
        else if (serviceTarget === 'yogurt') { order.yogurtServed = isServed; order.yogurtSkipped = isSkipped; order.yogurtCancelled = false; }
        else if (serviceTarget === 'fruit') { order.fruitServed = isServed; order.fruitSkipped = isSkipped; order.fruitCancelled = false; }
        else if (serviceTarget === 'drink_1' && currentServiceItemIndex !== null) { 
            if(order.beverages[currentServiceItemIndex]) {
                order.beverages[currentServiceItemIndex].served = isServed; 
                order.beverages[currentServiceItemIndex].skipped = isSkipped;
                order.beverages[currentServiceItemIndex].cancelled = false;
            }
        } 
        else if (serviceTarget === 'drink_2' && currentServiceItemIndex !== null) { 
            if(order.beverages_2[currentServiceItemIndex]) {
                order.beverages_2[currentServiceItemIndex].served = isServed; 
                order.beverages_2[currentServiceItemIndex].skipped = isSkipped;
                order.beverages_2[currentServiceItemIndex].cancelled = false;
            }
        } 
        else if (serviceTarget === 'dessert') { order.dessertServed = isServed; order.dessertSkipped = isSkipped; order.dessertCancelled = false; }
    } 
    
    // --- 區塊 B: Cancel (核心修改) ---
    else if (action === 'Cancel') {
         // 不刪除資料，只標記 Cancelled
         if (serviceTarget === 'meal_1') { order.mealCancelled = true; order.mealServed = false; order.mealSkipped = false; }
         else if (serviceTarget === 'appetizer') { order.appetizerCancelled = true; order.appetizerServed = false; order.appetizerSkipped = false; }
         else if (serviceTarget === 'soup') { order.soupCancelled = true; order.soupServed = false; order.soupSkipped = false; }
         else if (serviceTarget === 'meal_2') { order.mealCancelled_2 = true; order.mealServed_2 = false; order.mealSkipped_2 = false; }
         else if (serviceTarget === 'yogurt') { order.yogurtCancelled = true; order.yogurtServed = false; order.yogurtSkipped = false; }
         else if (serviceTarget === 'fruit') { order.fruitCancelled = true; order.fruitServed = false; order.fruitSkipped = false; }
         else if (serviceTarget === 'dessert') { order.dessertCancelled = true; order.dessertServed = false; order.dessertSkipped = false; }
         
         else if (serviceTarget === 'drink_1' && currentServiceItemIndex !== null) {
            if(order.beverages[currentServiceItemIndex]) {
                order.beverages[currentServiceItemIndex].cancelled = true;
                order.beverages[currentServiceItemIndex].served = false;
            }
         } 
         else if (serviceTarget === 'drink_2' && currentServiceItemIndex !== null) {
            if(order.beverages_2[currentServiceItemIndex]) {
                order.beverages_2[currentServiceItemIndex].cancelled = true;
                order.beverages_2[currentServiceItemIndex].served = false;
            }
         }
         
         showMessage(`${serviceTarget} marked as CANCELLED.`, false);
    }
    
    if (action !== 'Cancel') showMessage(`${order.id}'s ${serviceTarget} marked as ${action}.`, false);
    renderSeatLayout();
    saveSystemState();
}

// [NEW] 復原服務狀態 (Undo)
// [修改] handleUndoService - 支援復原 Cancelled 狀態
function handleUndoService(seatId, itemType, index = null) {
    const order = getOrder(seatId);
    if (!order) return;

    // Helper: Reset all status flags
    const reset = (prefix) => {
        order[`${prefix}Served`] = false;
        order[`${prefix}Skipped`] = false;
        order[`${prefix}Cancelled`] = false; // 重置 Cancelled
    };

    if (itemType === 'appetizer') reset('appetizer');
    else if (itemType === 'soup') reset('soup');
    else if (itemType === 'meal_1') { 
        reset('meal');
        // One Tray 連帶重置
        const meal = getMeal1(order.mealCode);
        if ((meal && meal.dessert === 'ONE TRAY SERVICE') || (order.isSPML && ['TPE-HKG', 'TPE-SHI', 'TPE-OKA'].includes(currentRoute))) {
            reset('dessert');
            reset('soup');
        }
    }
    else if (itemType === 'dessert') reset('dessert');
    else if (itemType === 'meal_2') {
         order.mealServed_2 = false; order.mealSkipped_2 = false; order.mealCancelled_2 = false; 
    }
    else if (itemType === 'yogurt') reset('yogurt');
    else if (itemType === 'fruit') reset('fruit');
    
    else if (itemType === 'drink_1' && index !== null) { 
        if(order.beverages[index]) { 
            order.beverages[index].served = false; 
            order.beverages[index].skipped = false;
            order.beverages[index].cancelled = false; // 重置
        }
    }
    else if (itemType === 'drink_2' && index !== null) { 
        if(order.beverages_2[index]) { 
            order.beverages_2[index].served = false; 
            order.beverages_2[index].skipped = false; 
            order.beverages_2[index].cancelled = false; // 重置
        }
    }

    saveSystemState();
    renderSeatLayout();
    openOrderModal(seatId);
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
    saveSystemState(); // <--- [加入這行] 自動存檔
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
        saveSystemState();
        closeDndActionModal();
    } else if (action === 'edit_order') {
        appElements.dndActionModal.classList.replace('flex', 'hidden'); 
        openOrderModal(order.id);
    } else if (action === 'close') {
        closeDndActionModal();
    }
}

// [FIXED] openSwapModal: Shows seat ID AND Last Name
function openSwapModal() {
    // 修改 map 邏輯：如果有名字就顯示名字，沒有就只顯示 ID
    const seatOptions = orders.map(o => {
        const displayText = o.lastName ? `${o.id} (${o.lastName})` : o.id;
        return `<option value="${o.id}">${displayText}</option>`;
    }).join('');

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
    saveSystemState(); // <--- [加入這行]
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

// [修正版] End of Flight - 改用軟重置，不重新整理網頁
async function handleEndOfFlight() {
    if (!confirm('Are you sure you want to end this flight? This will clear the current data.')) return;

    // 1. 產生報表 (維持不變)
    showMessage('Generating PDF report...', false);
    try {
        generatePDFReport();
    } catch(e) {
        console.error("PDF generation failed:", e);
        showMessage('Error generating PDF report.', true);
    }

    // 2. 清除「資料」 (不會清除程式碼)
    localStorage.removeItem(STORAGE_KEY); 

    // 3. 執行軟重置 (等待 1.5 秒讓 PDF 下載開始)
    setTimeout(resetSystem, 1500);
}

// [新版] Soft Reset - 手動清空變數並回到起始畫面
function resetSystem() {
    // A. 停止所有計時器與音效
    stopCountdown();
    
    // B. 清空核心變數
    flightNumber = '';
    currentAircraftType = '';
    currentRoute = '';
    orders = [];
    mealInventory_1 = {};
    mealInventory_2 = {};
    appetizerInventory = {};
    currentSeatId = null;
    isEditingInventory = false;
    currentMode = MODES.ORDER_MODE;
    currentServicePhase = 'MEAL_1';

    // C. 清空介面顯示
    appElements.flightNumberInput.value = '';
    appElements.aircraftSelect.selectedIndex = 0; // 重置選單
    appElements.routeSelect.selectedIndex = 0;
    appElements.displayFlightNo.textContent = 'N/A';
    appElements.seatLayout.innerHTML = '';
    appElements.summaryList.innerHTML = '';
    appElements.displayMode.textContent = 'ORDER MODE';
    appElements.displayMode.classList.replace('text-red-400', 'text-green-400');
    
    // D. 隱藏所有功能按鈕
    appElements.endFlightBtn.classList.add('hidden');
    appElements.phaseToggleBtn.classList.add('hidden');
    appElements.modeToggleBtn.textContent = 'Switch to SERVICE MODE';
    
    // E. 關閉主程式畫面 (`#app`)
    document.getElementById('app').classList.add('hidden');

    // F. 確保設定視窗是關閉的 (下次按 Start 時會重新判斷並打開)
    appElements.inventoryModal.classList.add('hidden');
    appElements.inventoryModal.classList.remove('flex');
    
    // G. [關鍵] 重新顯示起始畫面 (#start-screen)
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-btn');
    const loadingSpinner = document.getElementById('loading-spinner');

    if (startScreen) {
        startScreen.style.display = ''; // 移除 display: none
        startScreen.classList.remove('opacity-0', 'pointer-events-none'); // 移除淡出效果
        
        // 重置起始畫面的按鈕狀態
        if (loadingSpinner) loadingSpinner.classList.add('hidden');
        if (startBtn) {
            startBtn.classList.remove('hidden');
            // 稍微讓它彈跳一下提示使用者已重置
            startBtn.classList.add('animate-bounce'); 
            setTimeout(() => startBtn.classList.remove('animate-bounce'), 1000);
        }
    }

    showMessage('System Reset. Ready for next flight.', false);
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

// [FIXED] handleSaveInventoryEdit - 確保 Edit 模式下會儲存乘客資料 (IEML/SPML)
function handleSaveInventoryEdit() {
    let allValid = true;
    const routeMenus = MENUS[currentRoute] || { meal_1: [], meal_2: [] };
    activeMeals_1 = routeMenus.meal_1 || [];
    activeMeals_2 = routeMenus.meal_2 || [];
    const routeInfo = ROUTES.find(r => r.id === currentRoute);

    // ---------------------------------------------------------
    // 1. 讀取左側：一般庫存數量 (原本的功能)
    // ---------------------------------------------------------
    
    // Meal 1 庫存
    const inv1 = {};
    activeMeals_1.forEach(meal => {
        const input = document.getElementById(`qty-1-${meal.code}`);
        const value = parseInt(input && input.value, 10);
        if (isNaN(value) || value < 0) allValid = false;
        inv1[meal.code] = value || 0;
    });

    // Meal 2 庫存
    const inv2 = {};
    activeMeals_2.forEach(meal => {
        const input = document.getElementById(`qty-2-${meal.code}`);
        const value = parseInt(input && input.value, 10);
        if (isNaN(value) || value < 0) allValid = false;
        inv2[meal.code] = value || 0;
    });

    // 前菜庫存
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

    if (!allValid) { 
        showMessage('Please ensure all quantities are valid non-negative numbers.', true); 
        return; 
    }

    // ---------------------------------------------------------
    // 2. [關鍵新增] 讀取右側：乘客座位資料 (IEML / SPML / Name)
    // ---------------------------------------------------------
    
    // 重新取得所有座位 ID (確保與產生畫面時的順序一致)
    let seatIds = [];
    if (activeAircraftConfig && activeAircraftConfig.rows) {
        activeAircraftConfig.rows.forEach(row => {
            activeAircraftConfig.seatLetters.forEach(letter => {
                 // 這裡沿用 setupInventoryInputs 的座位過濾邏輯
                 if (currentAircraftType === 'A350-900' && row === '8' && (letter === 'A' || letter === 'K')) return;
                 if (currentAircraftType === 'A330-900neo') {
                    const isEven = parseInt(row) % 2 === 0;
                    if (isEven && !['A','E','F','K'].includes(letter)) return;
                    if (!isEven && !['C','D','G','H'].includes(letter)) return;
                 }
                 seatIds.push(`${row}${letter}`);
            });
        });
    }

    seatIds.forEach(seatId => {
        const order = getOrder(seatId);
        if (!order) return;

        // 取得該座位的輸入欄位 DOM
        const nameEl = document.getElementById(`preselect-name-${seatId}`);
        const mainMealEl = document.getElementById(`preselect-${seatId}`);
        const spmlEl = document.getElementById(`preselect-spml-${seatId}`);
        const appSelectEl = document.getElementById(`preselect-app-${seatId}`);
        const m2SelectEl = document.getElementById(`preselect-m2-${seatId}`);

        // A. 更新姓名
        if (nameEl) {
            order.lastName = nameEl.value.trim().toUpperCase();
        }

        // B. 更新餐點 (先重置預選狀態，避免殘留)
        // 注意：我們只重置「預選」相關屬性，不重置現場服務狀態 (Served/Skipped)
        order.isSPML = false;
        order.isSPML_2 = false;
        order.isPreSelect = false;
        order.isMeal2PreSelect = false;
        order.isAppetizerPreSelect = false;

        // 優先檢查是否選擇了 SPML
        if (spmlEl && spmlEl.value) {
            // 如果選了 SPML
            order.status = 'ORDERED'; // 強制設為有單
            order.isSPML = true;
            order.mealCode = spmlEl.value;
            order.mealName = 'Special Meal';

            // 長程線同步 Meal 2
            if (activeMeals_2.length > 0) {
                order.isSPML_2 = true;
                order.mealCode_2 = spmlEl.value;
                order.mealName_2 = 'Special Meal';
            }
            // M/L 航線 SPML 自動帶入前菜代碼 (依據規則)
            if (activeAppetizers.length > 0 || ['L', 'UL'].includes(routeInfo?.type)) {
                order.appetizerChoice = spmlEl.value; 
            }

        } else if (mainMealEl && mainMealEl.value) {
            // 如果選了一般餐
            if (order.status !== 'CHECKED_IN' && order.status !== 'DELAYED' && order.status !== 'DND') {
                 order.status = 'ORDERED';
            }
            order.mealCode = mainMealEl.value;
            const mData = activeMeals_1.find(m => m.code === mainMealEl.value);
            order.mealName = mData ? mData.name : 'N/A';
            order.isPreSelect = true; // 標記為預選
            
        } else {
            // 如果兩者都沒選 (清空狀態)
            // 只有在還沒開始服務的情況下才清空代碼，避免影響現場操作
            if (!order.mealServed) {
                order.mealCode = '';
                order.mealName = 'N/A';
            }
        }

        // C. 更新前菜 (若非 SPML)
        if (appSelectEl && appSelectEl.value && !order.isSPML) {
            order.appetizerChoice = appSelectEl.value;
            order.isAppetizerPreSelect = true;
        }

        // D. 更新第二餐 (若非 SPML)
        if (m2SelectEl && m2SelectEl.value && !order.isSPML) {
            order.mealCode_2 = m2SelectEl.value;
            const mData = activeMeals_2.find(m => m.code === m2SelectEl.value);
            order.mealName_2 = mData ? mData.name : 'N/A';
            order.isMeal2PreSelect = true;
        }
    });

    // ---------------------------------------------------------
    // 3. 存檔與更新 UI
    // ---------------------------------------------------------

    // 更新全域變數 (庫存)
    mealInventory_1 = inv1;
    mealInventory_2 = inv2;
    appetizerInventory = invApp;

    // Refresh UI
    renderSeatLayout();
    saveSystemState(); // 自動存檔
    
    // 如果剛好有人開著該座位的點餐視窗，也即時更新它
    if (!appElements.orderModal.classList.contains('hidden') && currentSeatId) {
        openOrderModal(currentSeatId);
    }
    
    showMessage('Inventory & Passenger Records updated.', false);

    // Close modal & Restore Controls
    appElements.inventoryModal.classList.replace('flex', 'hidden');
    if (appElements.editInventoryBtn) appElements.editInventoryBtn.classList.remove('hidden');
    
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

    // --- [FIX] 修復 Delay Action Modal (延後用餐) 按鈕監聽 ---
    const delayBtns = document.querySelectorAll('#delay-action-modal button');
    delayBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.getAttribute('data-action');
            const val = e.currentTarget.getAttribute('data-value'); // 取得延後分鐘數
            handleDelayAction(action, val ? parseInt(val) : 0);
        });
    });

    // --- [FIX] 修復 DND Action Modal (請勿打擾) 按鈕監聽 ---
    const dndBtns = document.querySelectorAll('#dnd-action-modal button');
    dndBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.getAttribute('data-action');
            handleDndAction(action);
        });
    });
    
    // --- [FIX] 確保點餐視窗內的狀態切換 (Radio Buttons) 能正確觸發 UI 變化 ---
    appElements.serviceStatusRadios.forEach(radio => {
        radio.addEventListener('change', toggleMealBeverageVisibility);
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
    checkAndRestoreState(); // <--- [加入這行] 網頁載入時自動檢查是否有未存檔的飛行
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
        saveSystemState(); // <--- [加入這行]
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

// --- Start Screen Logic (FIXED VERSION) ---
document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const readyMsg = document.getElementById('ready-msg');
    
    // 取得主介面與設定視窗
    const appContainer = document.getElementById('app');
    const inventoryModal = document.getElementById('inventory-modal');

    // 1. 初始化隱藏：確保一開始使用者看不到後面的系統
    if (inventoryModal) {
        inventoryModal.classList.add('hidden');
        inventoryModal.classList.remove('flex'); 
    }
    if (appContainer) {
        appContainer.classList.add('hidden');
    }

    // 定義「進入系統」的動作
    const enterSystem = () => {
        // A. 淡出 Start Screen
        startScreen.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => { startScreen.style.display = 'none'; }, 700);

        // B. 顯示主程式背景容器
        if (appContainer) appContainer.classList.remove('hidden');

        // C. 決定是否顯示「設定視窗」
        const hasBackup = localStorage.getItem('STARLUX_FLIGHT_BACKUP_V1');
        
        if (!hasBackup) {
            // 如果沒有備份 (代表是新航班)，強制顯示設定視窗！
            if (inventoryModal) {
                inventoryModal.classList.remove('hidden');
                inventoryModal.classList.add('flex'); 
            }
        }
        
        // D. 嘗試全螢幕
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(e => console.log('Fullscreen denied:', e));
        }
    };

    // 2. 檢測資源載入狀態
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loadingSpinner) loadingSpinner.classList.add('hidden');
            if (startBtn) {
                startBtn.classList.remove('hidden');
                startBtn.classList.add('animate-bounce-slight');
            }
            
            // 檢查離線功能
            if (readyMsg) {
                if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                    readyMsg.classList.remove('hidden');
                } else {
                    readyMsg.innerHTML = '<i data-lucide="check-circle" class="w-3 h-3"></i> SYSTEM READY';
                    readyMsg.classList.remove('hidden');
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }
            }

            // 綁定按鈕點擊
            if (startBtn) startBtn.addEventListener('click', enterSystem);

        }, 800);
    });
});