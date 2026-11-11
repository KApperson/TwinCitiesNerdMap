// App entry point. index.html loads config.js, information.js, Leaflet, and Papa Parse first.
// Startup is handled at the bottom by initializeApp().

// Runtime state and shared display helpers
let storesData = [];
let storeTagFields = [];
let storeFeatureFields = [];

// Built-in SVG fallbacks; configured PNG paths in SITE_CONFIG.filterIcons take precedence.
const filterIcons = {
    arcade: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v7m-2-7h4M8 13l4-3 4 3v4H8v-4Zm0 7v1m8-1v1M5 22h14"/><circle cx="12" cy="3" r="1.5"/></svg>',
    escaperoom: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17M3 21h18M9 21V7h6v14"/><circle cx="13" cy="14" r=".6"/></svg>',
    '3rdspace': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v2h-4"/></svg>',
    bookstore: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6c-2-2-5-2-9-1v14c4-1 7-1 9 1m0-14c2-2 5-2 9-1v14c-4-1-7-1-9 1m0-14v14"/></svg>',
    comics: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h12v15H8zM5 6v15h12M2 9v12h12"/><path d="M11 7h6m-6 3h6m-9 3h6m-6 3h6"/></svg>',
    boardgames: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="2.5"/><path d="M12 8v6m0-5-6 4m6-4 6 4m-12 0 3 3m6-3-3 3m-6 0-1 5m10-5 1 5"/></svg>',
    miniatures: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h13a2 2 0 0 1 2 2v10H5a3 3 0 0 1 0-12Zm0 0v12m5-12v5m4-5v3m4-3v5M5 17v2m4-2v2m4-2v2m4-2v2"/></svg>',
    playspace: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12v3H6zM8 11v10m8-10v10M3 10v3h3v5H3v-5m18-3v3h-3v5h3v-5"/></svg>',
    tcg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 8 10-4 5 12-10 4L4 8Zm4-4 10-2 4 12-4 1M8 11l5-2m-4 5 5-2"/></svg>',
    ttrpg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 9 6v8l-9 6-9-6V8l9-6Z"/><path d="m3 8 9 3 9-3m-9 3v11m-9-6 9-5 9 5m-9-5 4-9"/></svg>',
    videogames: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16l2 5H2l2-5Zm-2 5h20v10H2zM9 10v4h6v-4"/><path d="M7 16h.01m10 0h.01"/></svg>',
    toysandcollectables: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h16v12H4zM2 5h20v4H2zM12 5v16m0-16c-5 0-5-5-2-5 2 0 2 3 2 5Zm0 0c5 0 5-5 2-5-2 0-2 3-2 5Z"/></svg>',
    foodinhouse: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2v7m-3-7v4a3 3 0 0 0 6 0V2M7 9v13m10-20v20m0-20c3 2 4 5 4 9h-4"/></svg>',
    outsidefood: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16l-2 13H6L4 8Zm-1 0 2-5h14l2 5M9 12v5m6-5v5"/></svg>',
    gamestores: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12a4 4 0 0 1 3.8 5l-1 4a2 2 0 0 1-3.2 1L14 15h-4l-3.6 3a2 2 0 0 1-3.2-1l-1-4A4 4 0 0 1 6 8Z"/><path d="M7 11v4m-2-2h4m7-1h.01m3 2h.01"/></svg>',
    default: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4zM8 8h8v8H8z"/></svg>'
};

function formatTagLabel(field) {
    return SITE_CONFIG.tags.labels[field.toLowerCase()] || field
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, character => character.toUpperCase());
}

function compareLabels(first, second) {
    return first.localeCompare(second, undefined, { sensitivity: 'base' });
}

function getTagColorStyle(field) {
    const colorKey = field.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    return ` style="background-color: var(--store-tag-color-${colorKey}, var(--store-tag-color-default))"`;
}

function hasStoreTag(store, field) {
    return String(store[field] || '').trim().toUpperCase() === 'TRUE';
}

function getStorePinColor(store) {
    const pinColors = SITE_CONFIG.pins;
    const isConfiguredColor = color => typeof color === 'string' && color.trim() !== '';
    const configuredCategory = SITE_CONFIG.filters.categories
        .find(category => hasStoreTag(store, category.field) && isConfiguredColor(pinColors.categories[category.field]));

    if (configuredCategory) return pinColors.categories[configuredCategory.field];

    const configuredAdditionalFilter = SITE_CONFIG.filters.additional.fields
        .find(filter => hasStoreTag(store, filter.field) && isConfiguredColor(pinColors.additional[filter.field]));

    if (configuredAdditionalFilter) return pinColors.additional[configuredAdditionalFilter.field];

    const configuredSubcategory = storeFeatureFields
        .find(field => hasStoreTag(store, field) && isConfiguredColor(pinColors.subcategories[field]));

    if (configuredSubcategory) return pinColors.subcategories[configuredSubcategory];
    if (isConfiguredColor(pinColors.categories.gameStores)) return pinColors.categories.gameStores;
    return pinColors.defaultColor;
}

function getFilterPinColor(field, group) {
    const pinColors = SITE_CONFIG.pins;
    if (group === 'category' && pinColors.categories[field]) return pinColors.categories[field];
    if (group === 'additional' && pinColors.additional[field]) return pinColors.additional[field];
    if (group === 'subcategory') {
        return pinColors.subcategories[field] || pinColors.categories.gameStores || pinColors.defaultColor;
    }
    if (group === 'gameStores') return pinColors.categories.gameStores || pinColors.defaultColor;
    return pinColors.defaultColor;
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

function getSafeLogoUrl(value) {
    const logoUrl = String(value ?? '').trim();
    if (!logoUrl) return '';

    try {
        const resolvedUrl = new URL(logoUrl, document.baseURI);
        return ['http:', 'https:'].includes(resolvedUrl.protocol) ? logoUrl : '';
    } catch {
        return '';
    }
}

// Filter controls are buttons with aria-pressed state, allowing the same handler for every filter group.
function createFilterButton({ id, field, label, icon = field, pinColor, disabled = false, expandable = false }) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `filter-tile${expandable ? ' filter-tile-game-store' : ''}`;
    button.setAttribute('aria-pressed', 'false');
    button.disabled = disabled;
    button.style.setProperty('--filter-pin-color', pinColor || SITE_CONFIG.pins.defaultColor);
    if (id) button.id = id;

    const iconElement = document.createElement('span');
    iconElement.className = 'filter-tile-icon';
    const iconKey = icon.toLowerCase();
    const iconPath = SITE_CONFIG.filterIcons.byField[iconKey] || SITE_CONFIG.filterIcons.default;
    if (iconPath) {
        const image = document.createElement('img');
        image.src = iconPath;
        image.alt = '';
        image.onerror = () => {
            iconElement.innerHTML = filterIcons[iconKey] || filterIcons.default;
        };
        iconElement.appendChild(image);
    } else {
        iconElement.innerHTML = filterIcons[iconKey] || filterIcons.default;
    }

    const labelElement = document.createElement('span');
    labelElement.className = 'filter-tile-label';
    labelElement.textContent = label;
    button.append(iconElement, labelElement);

    if (expandable) {
        button.setAttribute('aria-expanded', 'false');
        const indicator = document.createElement('span');
        indicator.className = 'filter-expand-indicator';
        indicator.textContent = '+';
        button.appendChild(indicator);
    }
    return button;
}

// Build controls from config and CSV fields so new categories or features need minimal app changes.
function renderFeatureFilters() {
    const container = document.getElementById('feature-filters');
    container.replaceChildren();

    [...storeFeatureFields]
        .sort((first, second) => compareLabels(formatTagLabel(first), formatTagLabel(second)))
        .forEach(field => {
            const button = createFilterButton({
                field,
                label: formatTagLabel(field),
                pinColor: getFilterPinColor(field, 'subcategory'),
                disabled: document.getElementById('filter-game-stores').getAttribute('aria-pressed') !== 'true'
            });
            button.dataset.storeField = field;
            container.appendChild(button);
        });
}

function renderFilterControls() {
    const categoryContainer = document.getElementById('category-filters');
    [...SITE_CONFIG.filters.categories]
        .sort((first, second) => compareLabels(first.label, second.label))
        .forEach(category => {
            const button = createFilterButton({
                field: category.field,
                label: category.label,
                icon: category.field,
                pinColor: getFilterPinColor(category.field, 'category')
            });
            button.dataset.categoryField = category.field;
            categoryContainer.appendChild(button);
        });

    const additionalFilterContainer = document.getElementById('additional-filters');
    document.getElementById('additional-filter-title').textContent = SITE_CONFIG.filters.additional.label;
    [...SITE_CONFIG.filters.additional.fields]
        .sort((first, second) => compareLabels(first.label, second.label))
        .forEach(filter => {
            const button = createFilterButton({
                field: filter.field,
                label: filter.label,
                pinColor: getFilterPinColor(filter.field, 'additional')
            });
            button.dataset.additionalField = filter.field;
            additionalFilterContainer.appendChild(button);
        });

    document.getElementById('game-store-filter').appendChild(createFilterButton({
        id: 'filter-game-stores',
        label: SITE_CONFIG.filters.gameStores.label,
        icon: 'gamestores',
        pinColor: getFilterPinColor('', 'gameStores'),
        expandable: true
    }));
}

function syncFeatureFilters() {
    const gameStoresButton = document.getElementById('filter-game-stores');
    const enabled = gameStoresButton.getAttribute('aria-pressed') === 'true';
    document.querySelector('.game-store-filters').classList.toggle('expanded', enabled);
    document.getElementById('sidebar').classList.toggle('game-stores-active', enabled);
    gameStoresButton.setAttribute('aria-expanded', String(enabled));
    gameStoresButton.querySelector('.filter-expand-indicator').textContent = enabled ? '\u2212' : '+';

    document.querySelectorAll('#feature-filters .filter-tile').forEach(button => {
        button.disabled = !enabled;
        if (!enabled) button.setAttribute('aria-pressed', 'false');
    });
}

// Render editable Info content as text, not HTML.
function renderInformation() {
    document.getElementById('info-title').textContent = SITE_INFORMATION.title;
    const container = document.getElementById('info-sections');
    container.replaceChildren();

    SITE_INFORMATION.sections.forEach(section => {
        const article = document.createElement('article');
        article.className = 'info-section';
        const heading = document.createElement('h3');
        heading.textContent = section.title;
        article.appendChild(heading);

        if (section.text) {
            const text = document.createElement('p');
            text.textContent = section.text;
            article.appendChild(text);
        }
        container.appendChild(article);
    });
}

// Initialize the sidebar controls and Info view.
function initializeSidebar() {
    document.getElementById('store-filter-title').textContent = SITE_CONFIG.page.title;
    renderFilterControls();
    renderInformation();

    const sidebarMain = document.getElementById('sidebar-main');
    const infoView = document.getElementById('info-view');
    const infoOpenButton = document.getElementById('info-open');
    const infoCloseButton = document.getElementById('info-close');

    const closeInformation = () => {
        infoView.hidden = true;
        sidebarMain.hidden = false;
        infoOpenButton.setAttribute('aria-expanded', 'false');
        infoOpenButton.focus();
    };

    infoOpenButton.addEventListener('click', () => {
        sidebarMain.hidden = true;
        infoView.hidden = false;
        infoOpenButton.setAttribute('aria-expanded', 'true');
        infoCloseButton.focus();
    });
    infoCloseButton.addEventListener('click', closeInformation);
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !infoView.hidden) closeInformation();
    });
}

// Create the Leaflet map and connect the collapsible sidebar to map resizing.
function initializeMap() {
    const map = L.map('map').setView(
        [SITE_CONFIG.map.center.latitude, SITE_CONFIG.map.center.longitude],
        SITE_CONFIG.map.zoom
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const markerLayer = L.layerGroup().addTo(map);
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    sidebarToggle.addEventListener('click', () => {
        const isExpanded = sidebarToggle.getAttribute('aria-expanded') === 'true';
        document.body.classList.toggle('sidebar-collapsed', isExpanded);
        sidebarToggle.setAttribute('aria-expanded', String(!isExpanded));
        sidebarToggle.setAttribute('aria-label', isExpanded ? 'Show sidebar' : 'Hide sidebar');
        sidebarToggle.title = isExpanded ? 'Show sidebar' : 'Hide sidebar';
    });
    sidebar.addEventListener('transitionend', event => {
        if (event.propertyName === 'flex-basis') map.invalidateSize({ pan: false });
    });
    return { map, markerLayer };
}

function getActiveFilters() {
    return {
        categories: [...document.querySelectorAll('#category-filters [data-category-field][aria-pressed="true"]')]
            .map(button => button.dataset.categoryField),
        additional: [...document.querySelectorAll('#additional-filters [data-additional-field][aria-pressed="true"]')]
            .map(button => button.dataset.additionalField),
        gameStores: document.getElementById('filter-game-stores').getAttribute('aria-pressed') === 'true',
        features: [...document.querySelectorAll('#feature-filters [data-store-field][aria-pressed="true"]')]
            .map(button => button.dataset.storeField)
    };
}

/**
 * Match selected primary categories and Food Options as alternatives.
 * Game Stores includes flagged or unclassified stores; selected feature filters narrow that group.
 */
function storeMatchesFilters(store, filters) {
    const hasFilters = filters.categories.length || filters.additional.length || filters.gameStores;
    if (!hasFilters) return true;

    const recognizedFields = [
        ...SITE_CONFIG.filters.categories.map(category => category.field),
        ...SITE_CONFIG.filters.additional.fields.map(filter => filter.field),
        ...SITE_CONFIG.filters.gameStores.fields
    ];
    const isUnclassified = !recognizedFields.some(field => hasStoreTag(store, field));
    const isGameStore = isUnclassified || SITE_CONFIG.filters.gameStores.fields.some(field => hasStoreTag(store, field));

    return filters.categories.some(field => hasStoreTag(store, field)) ||
        filters.additional.some(field => hasStoreTag(store, field)) ||
        (filters.gameStores && isGameStore && filters.features.every(field => hasStoreTag(store, field)));
}

// Keep popup and sidebar item markup in separate builders to make store display changes local.
function createStorePopup(store, pinColor) {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${store.lat},${store.lng}`)}`;
    const summaryHtml = store.summary?.trim()
        ? `<div class="store-summary">${escapeHtml(store.summary)}</div>`
        : '';
    const addressHtml = store.address?.trim()
        ? `<div class="store-address">${escapeHtml(store.address)}</div>`
        : '';
    const websiteUrl = String(store.website ?? '').trim();
    const websiteLink = websiteUrl
        ? `<a class="popup-website-link" href="${escapeHtml(websiteUrl)}" target="_blank" rel="noopener noreferrer">Visit Website</a>`
        : '';
    const tagsHtml = storeTagFields
        .filter(field => hasStoreTag(store, field))
        .map(field => `<span class="store-tag"${getTagColorStyle(field)}>${formatTagLabel(field)}</span>`)
        .join('');
    const logoUrl = getSafeLogoUrl(store.logo);
    const logoHtml = logoUrl
        ? `<img class="store-popup-logo" src="${escapeHtml(logoUrl)}" alt="${escapeHtml(store.name)} logo">`
        : '';

    return `
        <div class="store-popup-layout">
            ${logoHtml}
            <div class="store-popup-details">
                <strong>${escapeHtml(store.name)}</strong><br>
                ${summaryHtml}
                ${websiteLink}
                ${addressHtml}
                ${tagsHtml ? `<div class="store-tags">${tagsHtml}</div>` : ''}
                <a class="directions-button" href="${directionsUrl}" target="_blank" rel="noopener noreferrer">Get Directions</a>
            </div>
        </div>
    `;
}

function renderStoreListItem(store, marker, pinColor, map) {
    const item = document.createElement('div');
    item.className = 'store-list-item';
    const summaryHtml = store.summary?.trim()
        ? `<span class="store-summary">${escapeHtml(store.summary)}</span>`
        : '';
    const websiteUrl = String(store.website ?? '').trim();
    const websiteLink = websiteUrl
        ? `<a href="${escapeHtml(websiteUrl)}" target="_blank" rel="noopener noreferrer">Website</a>`
        : '';

    item.innerHTML = `
        <div class="store-list-details">
            <strong>${escapeHtml(store.name)}</strong>
            ${summaryHtml}
            ${websiteLink}
        </div>
        <button type="button" class="store-pin-button" aria-label="Show ${escapeHtml(store.name)} on map" title="Show on map">
            <svg viewBox="0 0 25 41" aria-hidden="true"><path d="M12.5 1C6.2 1 1 6.2 1 12.5c0 8.2 11.5 27 11.5 27s11.5-18.8 11.5-27C24 6.2 18.8 1 12.5 1Z" fill="${escapeHtml(pinColor)}" stroke="var(--store-pin-outline-color)" stroke-width="1.5"/><circle cx="12.5" cy="12.5" r="3.5" fill="var(--store-pin-center-color)"/></svg>
        </button>
    `;
    item.querySelector('.store-pin-button').addEventListener('click', () => {
        map.setView(marker.getLatLng(), Math.max(map.getZoom(), 14));
        marker.openPopup();
    });
    return item;
}

// Rebuild markers and the alphabetized sidebar list after data loads or a filter changes.
function renderStores(map, markerLayer) {
    markerLayer.clearLayers();
    const listContainer = document.getElementById('store-list');
    listContainer.replaceChildren();
    const filters = getActiveFilters();

    [...storesData]
        .sort((first, second) => compareLabels(String(first.name || ''), String(second.name || '')))
        .forEach(store => {
            if (!storeMatchesFilters(store, filters) || !store.lat || !store.lng) return;

            const pinColor = getStorePinColor(store);
            const icon = L.divIcon({
                className: 'store-pin-icon',
                html: `<svg viewBox="0 0 25 41" aria-hidden="true"><path d="M12.5 1C6.2 1 1 6.2 1 12.5c0 8.2 11.5 27 11.5 27s11.5-18.8 11.5-27C24 6.2 18.8 1 12.5 1Z" fill="${escapeHtml(pinColor)}" stroke="var(--store-pin-outline-color)" stroke-width="1.5"/><circle cx="12.5" cy="12.5" r="3.5" fill="var(--store-pin-center-color)"/></svg>`,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34]
            });
            const marker = L.marker([parseFloat(store.lat), parseFloat(store.lng)], { icon });
            marker.bindPopup(createStorePopup(store, pinColor), { minWidth: 320, maxWidth: 420 });
            markerLayer.addLayer(marker);
            listContainer.appendChild(renderStoreListItem(store, marker, pinColor, map));
        });
}

function handleFilterButtonClick(event, map, markerLayer) {
    const button = event.target.closest('.filter-tile');
    if (!button || button.disabled) return;

    const isPressed = button.getAttribute('aria-pressed') === 'true';
    button.setAttribute('aria-pressed', String(!isPressed));
    if (button.id === 'filter-game-stores') {
        syncFeatureFilters();
    } else if (button.dataset.storeField && !isPressed) {
        document.getElementById('filter-game-stores').setAttribute('aria-pressed', 'true');
        syncFeatureFilters();
    }
    renderStores(map, markerLayer);
}

// Papa Parse supplies both the store records and header names used to derive tag/subfilter fields.
function loadStoreData(map, markerLayer) {
    Papa.parse('stores.csv', {
        download: true,
        header: true,
        complete(results) {
            storesData = results.data;
            const websiteIndex = results.meta.fields.indexOf('website');
            storeTagFields = results.meta.fields.slice(websiteIndex + 1)
                .filter(field => !SITE_CONFIG.tags.excludedFields.includes(field.toLowerCase()));
            const configuredFeatureFields = SITE_CONFIG.filters.gameStores.subFilters.fields;
            const excludedSubfilterFields = new Set([
                ...SITE_CONFIG.filters.categories.map(category => category.field.toLowerCase()),
                ...SITE_CONFIG.filters.additional.fields.map(filter => filter.field.toLowerCase())
            ]);
            storeFeatureFields = configuredFeatureFields === null
                ? storeTagFields.filter(field => !excludedSubfilterFields.has(field.toLowerCase()))
                : configuredFeatureFields.filter(field =>
                    storeTagFields.some(tag => tag.toLowerCase() === field.toLowerCase()) &&
                    !excludedSubfilterFields.has(field.toLowerCase())
                );

            renderFeatureFilters();
            renderStores(map, markerLayer);
        }
    });
}

// Wire UI, map, and data loading after all dependencies have loaded.
function initializeApp() {
    initializeSidebar();
    const { map, markerLayer } = initializeMap();

    document.querySelectorAll('.filter-grid').forEach(container => {
        container.addEventListener('click', event => handleFilterButtonClick(event, map, markerLayer));
    });
    loadStoreData(map, markerLayer);
}

initializeApp();
