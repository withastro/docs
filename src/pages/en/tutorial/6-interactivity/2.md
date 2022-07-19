---
layout: ~/layouts/MainLayout.astro
title: Building a Responsive Navigation Menu
---

## Goals

BY THE END OF THIS SECTION YOU WILL HAVE:

- 

- 

- 

## Header Component
```astro
---
import Navigation from './Navigation.astro';
---

<header>
    <nav class="nav">
      <div class="hamburger">
        <span class="line"></span>
        <span class="line"></span>
        <span class="line"></span>
      </div>

      <div class="nav-links">
        <Navigation />
      </div>
    </nav>
  </header>
```

## CSS

```css
/* nav styles */

.nav {
  align-items: center;
  padding-top: 20px;
}

.hamburger {
  padding-right: 20px;
  cursor: pointer;
}

.hamburger .line {
  display: block;
  width: 40px;
  height: 5px;
  margin-bottom: 10px;
  background-color: var(--text-color);
}

.nav-links {
  width: 100%;
  top: 5rem;
  left: 48px;
  background-color: #ff9776;
  display: none;
  margin: 0;
}

.nav-links a {
  display: block;
  text-align: center;
  padding: 10px 0;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
}

.nav-links a:hover, a:focus {
  background-color: #ff9776;
}

.expanded {
  display: unset;
}

@media screen and (min-width: 636px) {
  .nav-links {
    margin-left: 5em;
    display: block;
    position: static;
    width: auto;
    background: none;
  }

  .nav-links a {
    display: inline-block;
    padding: 15px 20px;
  }

  .hamburger {
    display: none;
  }
}
```
## Script

```diff
  <script src='../scripts/theme-toggle.js'></script>
+ <script>
+   document.querySelector('.hamburger').addEventListener('click', () => {
+     document.querySelector('.nav-links').classList.toggle('expanded');
+   });
+ </script>
```

This script reacts to the hamburger (3 lines) being clicked, and toggles the vertical menu of nav links.

## Before You Go

### Test your knowledge

### Checklist for moving on
