# The 1994 house style for Plugin Store images

The same style as the Statamic addons', so the rules live in one place: [statamic-marketplace/_style/STYLE.md](https://github.com/1994limited/statamic-marketplace/blob/main/_style/STYLE.md). In short: the cover is a colour field in the plugin's own colour, the images inside the listing are white sheets, and what's drawn on them comes from the plugin's own world.

`house.mjs` here is a copy of statamic-marketplace's `_style/house.mjs` (colours, type, page shell, rendering). Change both together, so a plugin and its Statamic addon keep matching.

The only differences on Craft:

- The meta line says `Name · for Craft CMS`.
- Craft's words: "control panel", "plugin", Twig in the examples.
- The Plugin Store shows the plugin's own `src/icon.svg`, so that icon and `addon-icon.svg` here are the same mark.
