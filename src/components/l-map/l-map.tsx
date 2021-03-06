import { Component, Prop, Element, Watch, Event, EventEmitter } from '@stencil/core';
import L from 'leaflet';
import esri from'../../../node_modules/esri-leaflet/dist/esri-leaflet';
L.esri = esri;

@Component({
  tag: 'l-map',
  styleUrls: [
    'l-map.css',
    '../../../node_modules/leaflet/dist/leaflet.css'
  ],
  shadow: true
})

export class LMap {
  @Element() LMapHTMLElement: HTMLElement;
  @Prop() iconUrl: string;
  @Prop() tileLayerUrl: string;
  @Prop() center: string;
  @Prop() zoom: string;
  @Prop() minZoom: string;
  @Prop() maxZoom: string;
  @Prop() currentLocation: string;
  @Prop() currentLocationIconUrl: string;
  @Prop() locations: string;
  @Watch('locations')
  handleLocationsChanged(locations: string) {
    console.log('l-map handleLocationsChanged');
    this.addMarkers(JSON.parse(locations));
  }
  @Event() message: EventEmitter;

  LMap;
  layerGroupTiles = L.layerGroup();
  layerGroupLocations = L.layerGroup();

  render() {
    return (
      <div id="l-map"></div>
    );
  }

  componentDidLoad() {
    console.log('l-map componentDidLoad');
    console.log('l-map tileLayerUrl', this.tileLayerUrl);
    console.log('l-map iconurl', this.iconUrl);
    console.log('l-map locations', this.locations);
    console.log('l-map center', this.center);
    console.log('l-map zoom', this.zoom);
    console.log('l-map min zoom', this.minZoom);
    console.log('l-map max zoom', this.maxZoom);

    const LMapElement: HTMLElement = this.LMapHTMLElement.shadowRoot.querySelector('#l-map');

    const tileLayer = L.tileLayer(this.tileLayerUrl);
    const esriTopographic = L.esri.basemapLayer('Topographic');
    const esriStreets = L.esri.basemapLayer('Streets');
    const esriGray = L.esri.basemapLayer('Gray');
    const esriDarkGray = L.esri.basemapLayer('DarkGray');
    const esriShadedRelief = L.esri.basemapLayer('ShadedRelief');
    const esriImagery = L.esri.basemapLayer('Imagery');
    const esriNationalGeographic = L.esri.basemapLayer('NationalGeographic').addTo(this.layerGroupTiles);

    setTimeout(() => {
      this.LMap.invalidateSize();
    },2000);

    if (this.locations && this.locations.length) {
      this.addMarkers(JSON.parse(this.locations));
    }

    if (this.currentLocation && this.currentLocation.length) {
      this.addCurrentLocationMarker(JSON.parse(this.currentLocation));
    }

    let esriFeatureLayerStates = L.esri.featureLayer({
      url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized/FeatureServer/0',
      style: function () {
        return { color: '#545454', weight: 1 };
      },
      useCors: false
    });

    this.LMap = L.map(LMapElement, {
      tap: false,
      zoomControl: false,
      minZoom: Number(this.minZoom) || 0,
      maxZoom: Number(this.maxZoom) || 16,
      maxBounds: [[-90, -180],[90, 180]],
      layers: [this.layerGroupTiles, this.layerGroupLocations, esriFeatureLayerStates],
    })
      .setView(this.center? JSON.parse(this.center) : [0,0], this.zoom ? Number(this.zoom) : 2)
      .on('click', (e:any) => {
          console.log('l-map component send location message');
          this.message.emit(e.latlng.lat + ', ' + e.latlng.lng);
        });

    const baseMaps = {
      'Custom Tile Layer': tileLayer,
      'Esri Topographic': esriTopographic,
      'Esri Streets': esriStreets,
      'Esri Gray': esriGray,
      'Esri DarkGray': esriDarkGray,
      'Esri ShadedRelief': esriShadedRelief,
      'Esri Imagery': esriImagery,
      'Esri National Geographic': esriNationalGeographic
    };

    const overlayMaps = {
      'Custom Locations': this.layerGroupLocations,
      'Esri States': esriFeatureLayerStates
    };

    L.control.layers(baseMaps, overlayMaps, {
      position: 'bottomright'
    }).addTo(this.LMap);

  }

  addMarkers(locations) {
    const customIcon = L.icon({
      iconUrl: this.iconUrl,
      iconSize: [30, 30]
    });
    locations.map(latLng => {
      L.marker(latLng, { icon: customIcon }).addTo(this.layerGroupLocations);
    });
  }

  addCurrentLocationMarker(location) {
    const customIcon = L.icon({
      iconUrl: this.currentLocationIconUrl,
      iconSize: [30, 30]
    });
    L.marker(location, { icon: customIcon }).addTo(this.layerGroupLocations);
  }

}
