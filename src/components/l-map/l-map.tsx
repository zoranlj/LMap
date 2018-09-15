import { Component, Prop, Element, Watch, Event, EventEmitter } from '@stencil/core';
import { Map, TileLayer, Marker, Icon } from 'leaflet';
import L from 'leaflet';

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
  @Prop() iconurl: string;
  @Prop() tilelayer: string;
  @Prop() locations: string;
  @Prop() center: string;
  @Prop() zoom: string;
  @Watch('locations')
  handleLocationsChanged(locations: string) {
    console.log('l-map handleLocationsChanged');
    this.addMarkers(JSON.parse(locations));
  }
  @Event() message: EventEmitter;

  LMap: Map;

  render() {
    return (
      <div id="l-map"></div>
    );
  }

  componentDidLoad() {
    console.log('l-map componentDidLoad');
    console.log('l-map tilelayer', this.tilelayer);
    console.log('l-map iconurl', this.iconurl);
    console.log('l-map locations', this.locations);
    console.log('l-map center', this.center);
    console.log('l-map zoom', this.zoom);
    const LMapElement: HTMLElement = this.LMapHTMLElement.shadowRoot.querySelector('#l-map');
    this.LMap = L.map(LMapElement, {minZoom: 2, maxZoom: 6, maxBounds: [[-90, -180],[90, 180]]})
      .setView(JSON.parse(this.center), Number(this.zoom));
    const tilelayer: TileLayer = L.tileLayer(this.tilelayer);
    tilelayer.addTo(this.LMap);

    this.LMap.on('click', (e:any) => {
      console.log('l-map component send location message');
      this.message.emit(e.latlng.lat + ", " + e.latlng.lng);
    });
    this.addMarkers(JSON.parse(this.locations));
  }

  addMarkers(locations) {
    const modusLogo: Icon = L.icon({
      iconUrl: this.iconurl,
      iconSize: [30, 30]
    });
    let marker: Marker;
    locations.map(latLng => {
      marker = L.marker(latLng, { icon: modusLogo });
      marker.addTo(this.LMap);
    });
  }

}
