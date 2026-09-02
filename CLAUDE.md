# כסף גדול (Kesef Gadol)

אפליקציית ווב (PWA) אישית לילד/ה למעקב אחר כסף: יתרה, הכנסות, הוצאות, יעדי חיסכון, גרפים, ודוחות חודשיים.

## הרצה מקומית

```bash
npm install
npm run dev
```

הבנייה לפרודקשן:

```bash
npm run build
npm run preview
```

> **הערה לסביבת הפיתוח:** הפרויקט הזה נוצר בסביבה ללא גישה לרשת, כך שכל קבצי התלויות (package.json, קונפיגורציה) נכתבו ידנית ולא הותקנו/נבדקו בפועל עם `npm install`. בפעם הראשונה שפותחים את הפרויקט בסביבה עם אינטרנט (למשל ב-Claude Code או במחשב רגיל), יש להריץ `npm install` ואז `npm run dev` כדי לוודא שהכול עולה כמצופה, ולתקן אם יש קונפליקטים בגרסאות.

## סטאק טכנולוגי

- **React + Vite** — צד לקוח בלבד, ללא שרת
- **React Router** (`HashRouter`, כדי לעבוד גם ב-GitHub Pages בלי קונפיגורציית שרת)
- **Recharts** לגרפים
- **vite-plugin-pwa** להתקנה כאפליקציה במסך הבית + עבודה אופליין
- **localStorage** לשמירת כל הנתונים — **אין שרת, אין מסד נתונים, אין התחברות**
- פריסה ל-**GitHub Pages** דרך GitHub Actions (`.github/workflows/deploy.yml`)

## החלטות עיצוב מרכזיות

### מודל נתונים — שני מטבעות (CAD + ILS)
האפליקציה תומכת בשני מטבעות: **דולר קנדי (ברירת המחדל, לשימוש יומיומי)** ו**שקל (לביקורים בישראל)**. כל תנועה שומרת את המטבע שלה. **אין המרה אוטומטית בין מטבעות** — זו החלטה מכוונת: המרה לפי שער חליפין תדרוש קריאת רשת (אין כזו כרגע) והייתה עלולה להטעות ילד/ה לגבי כמה כסף באמת יש. במקום זאת, היתרה הראשית שמוצגת היא תמיד ב-CAD (המטבע היומיומי), ואם יש גם יתרת ₪, היא מוצגת כשורה משנית נפרדת ("+ ₪120 מביקורים בישראל"). ראו `src/lib/currency.js` ו-`src/lib/calculations.js`.

אם בעתיד ירצו המרה אמיתית — יהיה צריך להוסיף קריאת API לשער חליפין (למשל exchangerate.host), מה שידרוש שכבת רשת שלא קיימת כרגע.

### ייצוא PDF — דרך הדפדפן, לא ספריית PDF
כדי לשמור את האפליקציה קלה (ללא ספריות PDF כבדות כמו jsPDF), ה"ייצוא PDF" עובד באמצעות `window.print()` בשילוב עם `src/styles/print.css` ו-`src/components/history/MonthlyReport.jsx`. הרכיב `MonthlyReport` בנוי מראש בדף ההיסטוריה אך מוסתר (`display: none`) עד שמדפיסים — או-אז `print.css` מסתיר את כל שאר האפליקציה ומציג רק את הדוח, בעיצוב שמתאים לדף A4. המשתמש/ת בוחרים "שמור כ-PDF" בחלון ההדפסה של הדפדפן. זה נותן דוח יפה בלי תלות בספרייה חיצונית.

### ייצוא JSON
`src/lib/exportJson.js` — מוריד קובץ `.json` יחיד עם כל הנתונים (פרופיל, תנועות, יעדים), לגיבוי או מעבר מכשיר.

### אין שרת, אין התחברות
כל הנתונים ב-localStorage בלבד. ראו סעיף אבטחה במפרט המקורי. אם בעתיד יתווסף סנכרון בין מכשירים (למשל גישת הורה), יהיה צורך ב-Firebase או שירות דומה — לא קיים כרגע בכוונה.

> **הערה:** מפתח ה-localStorage (`PREFIX` בקובץ `src/lib/storage.js`) עודכן מ-`kesefKatan:` ל-`kesefGadol:` בעקבות שינוי שם האפליקציה. מכיוון שהאפליקציה עדיין לא פורסמה בפועל, זה לא משפיע על אף אחד — אך אם בעתיד ישונה השם שוב **אחרי** שיש כבר משתמשים עם נתונים שמורים, יש לזכור ששינוי ה-prefix "ימחק" (בפועל: לא ימצא) את הנתונים הישנים שלהם, ותידרש לוגיקת מיגרציה.

## מבנה תיקיות

```
src/
├── components/
│   ├── layout/        # AppHeader, TabBar
│   ├── home/           # BalanceHero (גרפיקת הצמח), QuickActions, MiniChart, RecentTxList
│   ├── charts/          # BalanceOverTimeChart, SpendingByCategoryChart (Recharts)
│   ├── goals/           # GoalCard, GoalForm
│   ├── history/          # TransactionList, ExportBar, MonthlyReport (PDF)
│   ├── modals/            # AddIncomeModal, AddExpenseModal
│   └── shared/            # Modal, Chip, CurrencyToggle, CurrencyTabs, EmptyState
├── hooks/               # useTransactions, useGoals, useLocalStorage
├── lib/                  # storage, calculations, categories, currency, exportJson
├── pages/                 # HomePage, ChartsPage, GoalsPage, HistoryPage
└── styles/                 # tokens.css (מערכת עיצוב), global.css, print.css
```

## קטגוריות

- **הוצאות**: אוכל 🍎, משחקים 🎮, ספרים וכלים 📚, בגדים 👕, אחר ✨ (`src/lib/categories.js`)
- **הכנסות**: דמי כיס 🎁, מתנה 💝, עבודה בבית 🧹, אחר ✨

## מה נשאר לבדוק/להשלים בסביבה עם אינטרנט

1. `npm install` בפועל, לוודא תאימות גרסאות (React 18, Vite 5, Recharts 2, vite-plugin-pwa).
2. בדיקת ה-PWA (התקנה למסך הבית, עבודה אופליין) במכשיר אמיתי.
3. בדיקת `window.print()` בדפדפנים שונים (במיוחד Safari/iOS, שם "שמירה כ-PDF" עובדת קצת אחרת).
4. אייקונים — `public/icons/` מכיל סט אייקונים מעוצב (מטבע עם נבט צומח, בהתאם לפלטת הצבעים ולקונספט הצמיחה של האפליקציה): `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` (לאנדרואיד, עם safe zone שנבדק שלא נחתך בחיתוך עגול), `apple-touch-icon.png` (180px, ל-iOS), ו-`favicon-32.png`. קובץ המקור של הגנרטור נמצא ב-`icon-design/make_icons_v2.py` בשורש הריפו (לא חלק מהבילד) — ניתן להריץ מחדש ולשנות צבעים/גודל אם רוצים גרסה אחרת.
5. הגדרת GitHub Pages בהגדרות הריפו (Settings → Pages → Source: GitHub Actions) כדי שה-workflow יעבוד.
