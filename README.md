# Folio

[中文介绍](README.zh-CN.md)

![Folio preview](screenshot.png)

Folio is a warm editorial theme for Obsidian. It gives long notes a manuscript-like reading surface, with ivory backgrounds, clay accents, refined typography, and quiet interface polish for writing, research, and daily knowledge work.

If you want Obsidian to feel less like a generic app screen and more like a calm writing desk, Folio is built for that.

## Highlights

- Warm light and dark modes built from the same ivory, slate, charcoal, and clay palette
- Editorial typography for reading, writing, research notes, and long-form thinking
- CJK-aware font stacks for mixed English and Chinese vaults
- Multi-color callouts for `info`, `warning`, `error`, `danger`, `success`, `tip`, `question`, `quote`, `abstract`, `summary`, and `example`
- Styled headings, tables, blockquotes, links, tags, checkboxes, embeds, code blocks, properties, Canvas nodes, and file navigation
- Carefully tuned command palette, search, tabs, menus, modals, sliders, settings, and mobile surfaces
- Accessible focus states, reduced-motion handling, high-contrast support, and print-friendly output

## Preview

![Folio table styling](table-showcase.png)

![Folio blockquote styling](blockquote-showcase.png)

## Design

Folio is designed around a restrained editorial palette:

| Token | Use |
| --- | --- |
| Ivory | Main writing surface |
| Slate | Primary text and headings |
| Clay | Links, buttons, selection, focus, and active states |
| Charcoal | Dark mode background |

Typography is tuned for mixed English and Chinese notes. The public theme uses open and system font stacks, so it works without bundling private font files:

- **Reading and headings:** Lora, Georgia, and CJK serif fallbacks
- **Interface:** Instrument Sans, Inter, and system UI fallbacks
- **Code:** JetBrains Mono and system monospace fallbacks

## What Folio Styles

Folio focuses on the parts of Obsidian that shape the writing day:

- **Callouts:** distinct accent palettes for common note states without making the page feel noisy
- **Tables:** completely borderless-grid editorial tables with a subtle clay-colored outer border, 8px rounded corners, bold contrast headers, and a faint background elevation.
- **Blockquotes:** magazine-inspired editorial quotes with an invisible border, a delicate serif quotation mark, and elegant text indentation.
- **Code:** warm syntax colors for keywords, strings, numbers, comments, functions, types, properties, operators, and variables
- **Navigation:** active file and outline indicators with clay accent strips for stronger orientation
- **Metadata:** transparent property fields with subtle hover and focus states
- **Canvas and embeds:** rounded nodes, quiet borders, and soft elevation
- **Tags and checkboxes:** clay pill tags and filled task checkboxes
- **Accessibility:** visible keyboard focus, high-contrast mode support, reduced-motion support, and print/PDF-friendly styling

## Installation

Install from the Obsidian community theme browser:

1. Open **Settings -> Appearance -> Themes -> Manage**
2. Search for **Folio**
3. Install and enable the theme

Manual installation is also possible by downloading the latest release and placing `theme.css` and `manifest.json` in:

```text
<vault>/.obsidian/themes/Folio/
```

## Compatibility

- Obsidian 1.5.0+
- Light and dark modes
- Desktop and mobile
- No plugin required

## License

[MIT](LICENSE)
