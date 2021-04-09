import { Component, OnInit } from '@angular/core';
import {WidgetComponent} from '../widget/widget.component';
import {WidgetTypeService} from '../../../services/widget-type.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-geo-location',
  templateUrl: './geo-location.component.html',
  styleUrls: ['./geo-location.component.scss']
})
export class GeoLocationComponent extends WidgetComponent implements OnInit {
  public static WIDGET_CLASS_NAME = 'GeoLocationComponent';

  private map: L.Map;

  constructor(
    widgetTypeService: WidgetTypeService
  ) {
    super(widgetTypeService, GeoLocationComponent);
  }

  ngOnInit(): void {
    this.map = L.map('map', {
      crs: L.CRS.EPSG3857,
      worldCopyJump: false,
      minZoom: 7,
      maxBounds: [
        [45.5, 5.5], // [south, west]
        [48.0, 11.0] // [north, east]
      ]
    });

    const pixelkarteUrl = 'https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg';
    const pixelkarteTileLayer = L.tileLayer(pixelkarteUrl);
    this.map.addLayer(pixelkarteTileLayer);

    const streetMapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const streetMapTileLayer = L.tileLayer(streetMapUrl);
    this.map.addLayer(streetMapTileLayer);

    L.control.layers({
      'Pixel': pixelkarteTileLayer,
      'Street': streetMapTileLayer
    }).addTo(this.map);

    this.map.setView(L.latLng(46.57591, 7.84956), 8);
  }

}
