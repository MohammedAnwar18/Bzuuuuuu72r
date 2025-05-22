mapboxgl.accessToken = 'pk.eyJ1IjoibW9oYW1tZWQtMTMzMSIsImEiOiJjbHY3dHFsaDcwZWcyMm9xaXBmdHVibm11In0.BDSWP06iKFsCOxq0IwxLBg';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mohammed-1331/cmav35y3d003l01sc46d02q65',
  center: [34.66, 31.47],
  zoom: 13
});

const allFeatures = [];

map.on('load', async () => {
  for (const item of geojsonFiles) {
    const response = await fetch(`geojson/${item.file}`);
    const feature = await response.json();

    allFeatures.push(feature); // نخزن الميزة للبحث

    const sourceId = `source-${item.name}`;
    const layerId = `layer-${item.name}`;

    map.addSource(sourceId, {
      type: 'geojson',
      data: feature
    });

    map.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': '#FF0000',
        'line-width': 2
      },
      minzoom: 12,
      maxzoom: 50
    });
  }
});

function searchFeature() {
  const term = document.getElementById('search').value.trim().toLowerCase();
  const match = allFeatures.find(f => f.properties.name.toLowerCase().includes(term));

  if (match) {
    const coords = match.geometry.coordinates[0][0];
    map.flyTo({ center: coords, zoom: 15 });

    new mapboxgl.Popup()
      .setLngLat(coords)
      .setHTML(`<strong>${match.properties.name}</strong>`)
      .addTo(map);
  } else {
    alert("المنطقة غير موجودة.");
  }
}
