# Folio

![Folio preview](screenshot.png)

Folio is a warm, editorial Obsidian theme for reading, writing, and research. It pairs an ivory canvas with clay accents, book-like spacing, and refined typography so long notes feel closer to a manuscript than a generic app screen.

## Highlights

- Warm light and dark modes with a shared ivory, slate, charcoal, and clay color system
- Serif-forward reading layout with CJK-aware font fallbacks
- Multi-color callouts for common note states, including info, warning, error, success, question, quote, summary, and example
- Carefully styled navigation, tabs, search, command palette, modals, menus, sliders, and settings surfaces
- Full Markdown coverage for headings, tables, callouts, blockquotes, links, tags, checkboxes, embeds, code, properties, and Canvas nodes
- Accessible focus states, reduced-motion handling, high-contrast support, and print-friendly output

## Design

Folio is built around a restrained editorial palette:

| Token | Use |
| --- | --- |
| Ivory | Main writing surface |
| Slate | Primary text and headings |
| Clay | Links, buttons, selection, focus, and active states |
| Charcoal | Dark mode background |

Typography is tuned for mixed English and Chinese notes. The public theme uses open and system font stacks:

- **Reading and headings:** Lora, Georgia, and CJK serif fallbacks
- **Interface:** Instrument Sans, Inter, and system UI fallbacks
- **Code:** JetBrains Mono and system monospace fallbacks

## Feature Coverage

Folio styles the parts of Obsidian that are most visible during daily writing:

- **Callouts:** distinct accent palettes for `info`, `warning`, `error` / `danger`, `success` / `tip`, `question`, `quote`, `abstract` / `summary`, and `example`
- **Tables:** bordered editorial tables with tuned header spacing, row hover states, and transparent inline code inside table cells
- **Dataview:** compact Dataview table spacing using scoped table variables for better density
- **Code:** warm syntax colors for keywords, strings, numbers, comments, functions, types, properties, operators, and variables
- **Navigation:** active file and outline indicators with clay accent strips for stronger orientation
- **Metadata:** transparent property fields with subtle hover and focus states
- **Canvas and embeds:** rounded nodes, quiet borders, and soft elevation
- **Tags and checkboxes:** clay pill tags and filled task checkboxes
- **Accessibility:** visible keyboard focus, high-contrast mode support, reduced-motion support, and print/PDF-friendly styling

## Installation

Install from Obsidian:

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

## License

[MIT](LICENSE)
