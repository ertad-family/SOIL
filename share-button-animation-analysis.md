# Анализ реализации Share кнопки с анимацией

## Источник и автор

**Автор:** Yancy Min  
**Оригинал:** [CodePen](https://codepen.io/yancy/pen/qyMdod)  
**Архив:** [GitHub Gist](https://gist.github.com/CodeMyUI/a9f120acc9cc70f6585d6317695a3c6e)

---

## Как это работает

Анимация реализована **на чистом CSS** без JavaScript. Принцип работы:

1. Есть контейнер `.btn_wrap` с двумя слоями:
   - `span` - тёмный слой с текстом "Share" (сверху)
   - `.container` - светлый слой с иконками соцсетей (снизу)

2. При hover на `.btn_wrap`:
   - `span` сдвигается влево (`translateX(-280px)`)
   - Иконки становятся видимыми (`opacity: 1`) и масштабируются (`scale(1)`)
   - Иконки появляются с разной задержкой (каскадный эффект)

---

## Полный исходный код

### HTML

```html
<div class="btn_wrap">
  <span>Share</span>
  <div class="container">
    <i class="fab fa-facebook-f"></i>
    <i class="fab fa-twitter"></i>
    <i class="fab fa-instagram"></i>
    <i class="fab fa-github"></i>
  </div>
</div>
```

### CSS

```css
* {
  margin: 0;
  padding: 0;
}

/* Иконки - изначально скрыты и уменьшены */
i {
  opacity: 0;
  font-size: 28px;
  color: #1f1e1e;
  will-change: transform;
  transform: scale(0.1);
  transition: all 0.3s ease;
}

/* Основной контейнер кнопки */
.btn_wrap {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  width: 240px;
  height: 72px;
  background-color: #eeeeed;
  border-radius: 80px;
  padding: 0 18px;
  will-change: transform;
  transition: all 0.2s ease-in-out;
}

/* Эффект увеличения при наведении */
.btn_wrap:hover {
  transform: scale(1.1);
}

/* Слой с текстом "Share" */
span {
  position: absolute;
  z-index: 99;
  width: 240px;
  height: 72px;
  border-radius: 80px;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
    "Helvetica Neue", sans-serif;
  font-size: 20px;
  text-align: center;
  line-height: 70px;
  letter-spacing: 2px;
  color: #eeeeed;
  background-color: #1f1e1e;
  padding: 0 18px;
  transition: all 1.2s ease;
}

/* Контейнер с иконками */
.container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 240px;
  height: 64px;
  border-radius: 80px;
}

/* Каскадная задержка появления иконок */
.container i:nth-of-type(1) {
  transition-delay: 1.1s;
}

.container i:nth-of-type(2) {
  transition-delay: 0.9s;
}

.container i:nth-of-type(3) {
  transition-delay: 0.7s;
}

.container i:nth-of-type(4) {
  transition-delay: 0.4s;
}

/* Анимация при наведении - сдвиг текста */
.btn_wrap:hover span {
  transition-delay: 0.25s;
  transform: translateX(-280px);
}

/* Анимация при наведении - появление иконок */
.btn_wrap:hover i {
  opacity: 1;
  transform: scale(1);
}
```

### Подключение Font Awesome

```html
<link href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" rel="stylesheet" />
```

---

## Ключевые CSS-свойства

| Свойство                            | Назначение                                     |
| ----------------------------------- | ---------------------------------------------- |
| `overflow: hidden`                  | Скрывает span при сдвиге за пределы контейнера |
| `transform: translateX(-280px)`     | Сдвигает текст "Share" влево                   |
| `transform: scale(.1)` → `scale(1)` | Анимация появления иконок                      |
| `transition-delay`                  | Каскадный эффект появления иконок              |
| `will-change: transform`            | Оптимизация производительности                 |
| `z-index: 99`                       | Размещает span поверх иконок                   |

---

## Адаптация для плагина WordPress

Для интеграции в Lumo Contribution Widget нужно:

1. **Изменить структуру HTML** для WordPress/React
2. **Добавить ссылки** на соцсети вместо просто иконок
3. **Адаптировать цвета** под тему Pubnews
4. **Добавить Pinterest и LinkedIn** (как на скриншоте)

### Адаптированная версия для плагина

```jsx
// React компонент ShareButton.js
import React from "react";
import "./ShareButton.scss";

const ShareButton = ({ url, title }) => {
  const shareLinks = [
    {
      name: "Facebook",
      icon: "fab fa-facebook-f",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "Twitter",
      icon: "fab fa-twitter",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: "LinkedIn",
      icon: "fab fa-linkedin-in",
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`,
    },
    {
      name: "Pinterest",
      icon: "fab fa-pinterest-p",
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <div className="share-btn-wrap">
      <span className="share-btn-text">
        <i className="fas fa-share-alt"></i> Share
      </span>
      <div className="share-btn-icons">
        {shareLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Share on ${link.name}`}
          >
            <i className={link.icon}></i>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ShareButton;
```

### SCSS стили (адаптированные под Pubnews)

```scss
// ShareButton.scss
.share-btn-wrap {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  min-width: 120px;
  height: 40px;
  background-color: var(--pubnews-global-preset-theme-color, #ede8e2);
  border-radius: 40px;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);

    .share-btn-text {
      transition-delay: 0.15s;
      transform: translateX(-150px);
    }

    .share-btn-icons a {
      opacity: 1;
      transform: scale(1);
    }
  }
}

.share-btn-text {
  position: absolute;
  z-index: 99;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  border-radius: 40px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  justify-content: center;
  color: #1f1e1e;
  background-color: var(--pubnews-global-preset-theme-color, #ede8e2);
  transition: all 0.8s ease;

  i {
    font-size: 12px;
  }
}

.share-btn-icons {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  padding: 0 15px;

  a {
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    color: #1f1e1e;
    text-decoration: none;
    transform: scale(0.1);
    transition: all 0.3s ease;

    &:hover {
      color: var(--pubnews-global-preset-theme-color, #cf2e2e);
    }

    i {
      font-size: 16px;
    }

    // Каскадная задержка
    &:nth-child(1) {
      transition-delay: 0.7s;
    }
    &:nth-child(2) {
      transition-delay: 0.6s;
    }
    &:nth-child(3) {
      transition-delay: 0.5s;
    }
    &:nth-child(4) {
      transition-delay: 0.4s;
    }
  }
}
```

---

## Вывод

**Эта анимация НЕ является частью темы Pubnews или какого-либо плагина WordPress.** Это кастомная CSS-анимация, реализованная вручную на сайте Ertad.

Для добавления в плагин Lumo Contribution Widget нужно:

1. Создать отдельный React-компонент `ShareButton`
2. Добавить SCSS стили
3. Интегрировать в `ContributionOption` компонент вместо статических иконок
4. Подключить Font Awesome для иконок
