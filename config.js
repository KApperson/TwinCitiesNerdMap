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

    // Optional PNG filter icons: use square transparent PNGs at 64x64 pixels for crisp high-density display.
    // The buttons render icons at 32x32 CSS pixels. Center the artwork, keep consistent padding, and avoid text/background fills.
    // Save images in icons/ and use relative paths. Keys must be lowercase filter fields.
    filterIcons: {
        // null keeps the built-in SVG icons unless an individual field has a PNG override.
        default: null,
        byField: {
            // arcade: 'icons/arcade.png',
            // escaperoom: 'icons/escape-room.png',
            // '3rdspace': 'icons/third-space.png',
            // bookstore: 'icons/bookstore.png',
            // comics: 'icons/comics.png',
            // toysandcollectables: 'icons/toys-and-collectables.png',
            // foodinhouse: 'icons/food-in-house.png',
            // outsidefood: 'icons/outside-food.png',
            // tcg: 'icons/tcg.png'
        }
    },

    // Pin colors: omitted or null overrides use the next matching color, then defaultColor.
    // Specific categories win first, then matching subcategories, then the general gameStores color.
    pins: {
        defaultColor: '#3388ff',
        categories: {
            // Use filter category fields here, such as bookstore or comics.
            bookstore: '#a855f7',
            comics: '#e11d48',
            escaperoom: '#16a34a'
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
