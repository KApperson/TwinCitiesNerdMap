// Site-wide settings live here so the map, filters, and tag labels can be reused or changed centrally.
window.SITE_CONFIG = {
    // Browser tab settings: title is displayed in the tab; favicon is a project-relative asset path.
    page: {
        title: 'Twin Cities Nerd Map',
        favicon: 'favicon.svg'
    },

    // Map view: change center coordinates and zoom to choose the initial view.
    map: {
        center: { latitude: 45.0, longitude: -93.15 },
        zoom: 9
    },

    // Optional filter icons: map lowercase filter fields to relative SVG or PNG paths in images/.
    // SVGs scale automatically; for PNGs use square transparent 64x64 images. Both render at 32x32 CSS pixels.
    filterIcons: {
        // Set true to render configured image icons in white; set false to preserve their source colors.
        forceWhite: true,
        // null keeps the built-in SVG icon unless a field-specific image is configured.
        default: null,
        byField: {
            arcade: 'images/joystick-svgrepo-com.svg',
            gamestores: 'images/controller-svgrepo-com.svg',
            ttrpg: 'images/dice-25-svgrepo-com.svg',
            miniatures: 'images/measuring-tape-svgrepo-com.svg',
            boardgames: 'images/meeple-svgrepo-com.svg',
            playspace: 'images/table-svgrepo-com.svg'
        }
    },

    // Pin colors also set the matching filter button backgrounds. Omitted colors fall back to defaultColor.
    // Store pin priority: specific categories, additional filters, subcategories, gameStores, then defaultColor.
    // Give each primary category a unique color by changing its entry below; keys must match filter fields.
    pins: {
        defaultColor: '#3388ff',
        categories: {
            arcade: '#d97706',
            escaperoom: '#16a34a',
            '3rdspace': '#0f766e',
            bookstore: '#a855f7',
            comics: '#e11d48',
            toysAndCollectables: '#475569'
        },
        additional: {
            // Optional Food Options pin/button colors, keyed by CSV field.
            // foodinhouse: '#d97706',
            // outsidefood: '#0f766e'
        },
        subcategories: {
            // Use CSV tag fields here, such as tcg or boardgames.
            // tcg: '#f97316',
            // boardgames: '#14b8a6'
        }
    },

    // Filter groups: category fields are independent; game-store subfilters match together.
    filters: {
        categories: [
            { field: 'arcade', label: 'Arcade' },
            { field: 'escaperoom', label: 'Escape Room' },
            { field: '3rdspace', label: '3rd Space' },
            { field: 'bookstore', label: 'Book Store' },
            { field: 'comics', label: 'Comic Shop' },
            { field: 'toysAndCollectables', label: 'Toys and Collectables' }
        ],
        additional: {
            label: 'Food Options',
            fields: [
                { field: 'foodinhouse', label: 'Food In-House' },
                { field: 'outsidefood', label: 'Outside Food' }
            ]
        },
        gameStores: {
            label: 'Game Stores',
            // A store is a Game Store when any of these CSV fields is TRUE.
            fields: ['tcg', 'ttrpg', 'boardgames', 'videogames', 'miniatures', 'playspace'],
            subFilters: {
                // Use null to include every CSV tag column except category fields; or list field names explicitly.
                fields: null
            }
        }
    },

    // Tag labels: keys must match CSV columns. Unlisted columns get a readable label automatically.
    tags: {
        // CSV fields listed here are display text or metadata, not colored tags.
        excludedFields: ['summary', 'logo'],
        // Tag box colors are configured with CSS variables at the top of styles.css.
        labels: {
            tcg: 'TCG',
            ttrpg: 'TTRPG',
            boardgames: 'Board Games',
            videogames: 'Video Games',
            miniatures: 'Miniatures',
            playspace: 'Playspace',
            comics: 'Comics',
            bookstore: 'Bookstore',
            used: 'Used',
            escaperoom: 'Escape Room',
            thirdspace: '3rd Space',
            foodinhouse: 'Food In-House',
            outsidefood: 'Outside Food'
        }
    }
};
