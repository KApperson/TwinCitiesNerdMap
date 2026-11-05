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

    // Filter groups: category fields are independent; game-store subfilters match together.
    filters: {
        categories: [
            { field: 'bookstore', label: 'Bookstores' },
            { field: 'comics', label: 'Comics' }
        ],
        gameStores: {
            label: 'Game Stores',
            subFilters: {
                // Use null to include every CSV tag column except category fields; or list field names explicitly.
                fields: null
            }
        }
    },

    // Tag labels: keys must match CSV columns. Unlisted columns get a readable label automatically.
    tags: {
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
