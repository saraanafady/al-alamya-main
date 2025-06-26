# Internationalization (i18n) Implementation

This project uses **react-i18next** for internationalization support with Arabic and English languages.

## Features

- ✅ **Bidirectional Support**: Full RTL (Right-to-Left) support for Arabic
- ✅ **Language Detection**: Automatic language detection from browser/localStorage
- ✅ **Dynamic Language Switching**: Real-time language switching without page reload
- ✅ **Responsive RTL**: RTL-aware responsive design
- ✅ **Proper Typography**: Arabic-optimized fonts and spacing
- ✅ **Currency Localization**: Different currency symbols for different languages

## Supported Languages

| Language | Code | Direction | Currency |
|----------|------|-----------|----------|
| English  | `en` | LTR       | `$`      |
| Arabic   | `ar` | RTL       | `ر.س`    |

## Usage

### Basic Translation

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('navigation.home')}</h1>
      <p>{t('common.loading')}</p>
    </div>
  );
}
```

### Translation with Variables

```jsx
const message = t('cart.addedToCart', { product: 'iPhone 15' });
```

### Language Switching

```jsx
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ar')}>العربية</button>
    </div>
  );
}
```

## Components with i18n Support

### ✅ Fully Translated Components
- `NavbarMain` - Navigation and header
- `BestsellersSection` - Bestsellers section
- `RecommendationsSection` - Recommendations
- `FeaturedSection` - Featured product
- `LanguageSwitcher` - Language switching component 