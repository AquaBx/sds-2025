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

    export function init(mapDiv: HTMLDivElement) {
        map = new maplibre.Map({
            container: mapDiv, // container id
            style: 'https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json', // style URL
            center: [0, 0], // starting position [lng, lat]
            zoom: 1 // starting zoom
        });

        const query = window.matchMedia('(prefers-color-scheme: dark)')
        changelayer(query)

        map.on('idle', () => {
            const query = window.matchMedia('(prefers-color-scheme: dark)')
            changelayer(query)
            query.addEventListener('change', changelayer);
        })

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

    export function markersReset() {
        MapManager.markers.forEach((m) => m.remove());
        MapManager.markers = []
        bounds = new maplibre.LngLatBounds();
    }

    function changelayer(event) {
        const layer = event.matches ? "dark-matter-gl-style" : "positron-gl-style"
        map.setStyle(`https://tiles.basemaps.cartocdn.com/gl/${layer}/style.json`)
    }
}