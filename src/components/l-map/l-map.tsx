import { Component, Prop, Element, Watch, Event, EventEmitter } from '@stencil/core';
import leaflet from 'leaflet';
// import esri from'../../../node_modules/esri-leaflet/dist/esri-leaflet'

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
  @Watch('tileLayerUrl')
  handleLTileLayerChanged(tileLayerUrl: string) {
    console.log('l-map handleLTileLayerChanged');
    console.log('l-map tileLayerUrl', tileLayerUrl);
    this.tileLayer.setUrl(tileLayerUrl);
  }
  @Prop() locations: string;
  @Prop() center: string;
  @Prop() zoom: string;
  @Prop() minZoom: string;
  @Prop() maxZoom: string;
  @Watch('locations')
  handleLocationsChanged(locations: string) {
    console.log('l-map handleLocationsChanged');
    this.addMarkers(JSON.parse(locations));
  }
  @Event() message: EventEmitter;

  LMap;
  tileLayer;

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

    this.LMap = leaflet.map(LMapElement, { zoomControl: false, minZoom: Number(this.minZoom), maxZoom: Number(this.maxZoom), maxBounds: [[-90, -180],[90, 180]]})
      .setView(JSON.parse(this.center), Number(this.zoom));

    this.tileLayer = leaflet.tileLayer(this.tileLayerUrl);
    this.tileLayer.addTo(this.LMap);

    this.LMap.on('click', (e:any) => {
      console.log('l-map component send location message');
      this.message.emit(e.latlng.lat + ", " + e.latlng.lng);
    });
    this.addMarkers(JSON.parse(this.locations));
    //
    // esri.basemapLayer('Gray').addTo(this.LMap);
    // esri.basemapLayer('Topographic').addTo(this.LMap);
    //
    // esri.featureLayer({
    //   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3",
    //   style: function () {
    //     return {color: '#bada55', weight: 2 };
    //   }
    // }).addTo(this.LMap);
  }

  addMarkers(locations) {
    const modusLogo = leaflet.icon({
      iconUrl: this.iconUrl,
      iconSize: [30, 30]
    });
    let marker;
    locations.map(latLng => {
      marker = leaflet.marker(latLng, { icon: modusLogo });
      marker.addTo(this.LMap);
    });
  }

}
