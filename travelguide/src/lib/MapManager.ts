import maplibre from 'maplibre-gl';
import { mount } from 'svelte';
import Marker from '$lib/components/Marker.svelte';
import MarkerPopup from '$lib/components/MarkerPopup.svelte';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace MapManager {
    export let map: maplibre.Map;
    let popup: maplibre.Popup;
    export let markers: maplibre.Marker[] = []
    export let bounds = new maplibre.LngLatBounds();
    export let route = []
    let layers = []


    export function init(mapDiv: HTMLDivElement) {
        map = new maplibre.Map({
            container: mapDiv, // container id
            style: 'https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json', // style URL
            center: [0, 0], // starting position [lng, lat]
            zoom: 1 // starting zoom
        });

        const query = window.matchMedia('(prefers-color-scheme: dark)');
        changelayer(query);
        query.addEventListener('change', changelayer);

        const componentDom = document.createElement('div');
        mount(MarkerPopup, {
            target: componentDom,
            props: { initial: 13 }
        });

        popup = new maplibre.Popup({ offset: 25 }).setDOMContent(componentDom);
    }

    export function createMarker(place: Place) {
        const marker = new maplibre.Marker();
        marker.setLngLat([place.location.lat, place.location.lon]);
        markers.push(marker);
        marker.setPopup(popup);
        marker.addTo(map);

        bounds.extend([place.location.lat, place.location.lon]);

        return marker
    }
    export function createRoute(routes: GeoJSON.FeatureCollection<GeoJSON.LineString>[]) {
        if (!routes || routes.length === 0) {
            console.log(routes)
            console.error('Routes must contain at least one FeatureCollection of LineString features.');
            return;
        }

        // if (map.getSource('route')) {
        //     map.removeLayer('route');
        //     map.removeSource('route');
        // }

        routes.forEach((route, index) => {
            if (route.features.length === 0) {
                console.warn('Skipping empty FeatureCollection.');
                return;
            }

            const routeSourceId = `route-${index}`;
            const routeLayerId = `route-layer-${index}`;

            route.features.forEach((feature) => {
                if (feature.geometry.type === 'LineString') {
                    feature.geometry.coordinates.forEach(([lon, lat]) => {
                        bounds.extend([lon, lat]);
                    });
                }
            });

            map.addSource(routeSourceId, {
                type: 'geojson',
                data: route
            });

            const color = generateDistinctColor(index);

            let layer = {
                id: routeLayerId,
                type: 'line',
                source: routeSourceId,
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': color,
                    'line-width': 4
                }
            }

            layers.push(layer)
            map.addLayer(layer);

        });
    }

    function generateDistinctColor(index: number): string {
        const colors = [
            '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
            '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
            '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000',
            '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'
        ];
        return colors[index % colors.length];
    }

    export function markersReset() {
        MapManager.markers.forEach((m) => m.remove());
        MapManager.markers = []
        bounds = new maplibre.LngLatBounds();
    }

    function changelayer(event) {
        const layer = event.matches ? "dark-matter-gl-style" : "positron-gl-style"
        map.setStyle(`https://tiles.basemaps.cartocdn.com/gl/${layer}/style.json`)

        layers.forEach((l) => {
            map.addLayer(l);
        })
    }
}