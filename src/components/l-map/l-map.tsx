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

    const tileLayer = L.tileLayer(this.tileLayerUrl).addTo(this.layerGroupTiles);
    const esriNationalGeographic = L.esri.basemapLayer('NationalGeographic').addTo(this.layerGroupTiles);

    if (this.locations.length) {
      this.addMarkers(JSON.parse(this.locations));
    }

    let esriFeatureLayerStates = L.esri.featureLayer({
      url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized/FeatureServer/0',
      style: function () {
        return { color: '#545454', weight: 1 };
      },
      useCors: false
    });

    this.LMap = L.map(LMapElement, {
      zoomControl: false,
      minZoom: Number(this.minZoom),
      maxZoom: Number(this.maxZoom),
      maxBounds: [[-90, -180],[90, 180]],
      layers: [this.layerGroupTiles, this.layerGroupLocations, esriFeatureLayerStates],
    })
      .setView(JSON.parse(this.center), Number(this.zoom))
      .on('click', (e:any) => {
          console.log('l-map component send location message');
          this.message.emit(e.latlng.lat + ', ' + e.latlng.lng);
        });

    const baseMaps = {
      'Custom Tile Layer': tileLayer,
      'Esri National Geographic': esriNationalGeographic
    };

    const overlayMaps = {
      'Custom Locations': this.layerGroupLocations,
      'Esri States': esriFeatureLayerStates
    };

    L.control.layers(baseMaps, overlayMaps).addTo(this.LMap);

  }

  addMarkers(locations) {
    const modusLogo = L.icon({
      iconUrl: this.iconUrl,
      iconSize: [30, 30]
    });
    locations.map(latLng => {
      L.marker(latLng, { icon: modusLogo }).addTo(this.layerGroupLocations);
    });
  }

}
