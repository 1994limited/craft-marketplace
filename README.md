# Craft Plugin Store assets

The Plugin Store listing images, icons and listing text for 1994's Craft plugins, and the tools that draw them. They're kept here so they don't ship inside the plugins people install; the plugins' READMEs link to them.

The Statamic addons have the same thing in [statamic-marketplace](https://github.com/1994limited/statamic-marketplace), in the same house style: a plugin and its Statamic addon look like the same product.

One folder per plugin, named after its repo without `-craft`: so far `newsletter`. Each follows the same layout:

```
newsletter/
    addon-icon.svg, addon-icon.png, addon-icon-2x.png
    cover-1600x900.png, cover-1600x900-2x.png
    01-*.png ... 05-*.png (and -2x)   the listing's images, 1600×900
    description.md                    the listing text
    charts/                           control panel, email and site screenshots
    tools/                            the scripts that draw them
```

The Plugin Store takes the plugin's icon from its own `src/icon.svg`; `addon-icon.*` here is the square tile for anywhere else the plugin is shown. Upload the listing images (and the screenshots in `charts/`) in the plugin's listing in Craft Console, and paste `description.md` as its description.

For Newsletter:

```bash
cd newsletter/tools
npm install
npm run marketplace     # the listing images
SITE=~/Sites/my-site SITE_URL=http://localhost:8091 CP_USER=... CP_PASSWORD=... npm run screenshots
```

`marketplace` needs nothing but Chrome. `screenshots` needs a Craft site with the plugin installed, some subscribers (one waiting to confirm) and mail written to files (`useFileTransport`); it writes to `tools/screenshots/`, so copy what you want into `charts/`.
