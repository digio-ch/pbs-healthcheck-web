import { Component, OnInit } from '@angular/core';
import {WidgetComponent} from '../widget/widget.component';
import {WidgetTypeService} from '../../../services/widget-type.service';
import * as L from 'leaflet';
import 'leaflet-fullscreen';

@Component({
  selector: 'app-geo-location',
  templateUrl: './geo-location.component.html',
  styleUrls: ['./geo-location.component.scss']
})
export class GeoLocationComponent extends WidgetComponent implements OnInit {
  public static WIDGET_CLASS_NAME = 'GeoLocationComponent';

  private map: L.Map;

  private totalLat = 0;
  private totalLng = 0;
  private totalAmt = 0;

  constructor(
    widgetTypeService: WidgetTypeService
  ) {
    super(widgetTypeService, GeoLocationComponent);
  }

  ngOnInit(): void {
    this.setupMap();

    this.loadDataPoints();

    this.alignMap();
  }

  private setupMap(): void {
    this.map = L.map('map', {
      crs: L.CRS.EPSG3857,
      worldCopyJump: false,
      minZoom: 7,
      maxBounds: [
        [45.5, 5.5], // [south, west]
        [48.0, 11.0] // [north, east]
      ]
    });

    this.setupFullscreen();
    this.setupLayers();
  }

  private setupFullscreen(): void {
    this.map.addControl(new (L.Control as any).Fullscreen());
  }

  private setupLayers(): void {
    const pixelkarteUrl = 'https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg';
    const pixelkarteTileLayer = L.tileLayer(pixelkarteUrl);

    const streetMapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const streetMapTileLayer = L.tileLayer(streetMapUrl);

    this.map.addLayer(pixelkarteTileLayer);

    L.control.layers({
      swisstopo: pixelkarteTileLayer,
      openstreetmap: streetMapTileLayer
    }).addTo(this.map);
  }

  private loadDataPoints(): void {
    const data = this.chartData as GeoLocation[];

    const icon = (color: string) => {
      return L.divIcon({
        html: '<div class="leaflet-geo-location" style="background-color: ' + color + '"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
    };

    data.map(geoLocation => {
      if (geoLocation.latitude) {
        this.totalLat += geoLocation.latitude;
        this.totalLng += geoLocation.longitude;
        this.totalAmt++;

        L.marker([geoLocation.latitude, geoLocation.longitude], {
          icon: icon(geoLocation.type.color),
          riseOnHover: true
        }).addTo(this.map)
          .bindPopup(geoLocation.label);
      }
    });
  }

  private alignMap(): void {
    const averageLat = this.totalAmt > 0 ? this.totalLat / this.totalAmt : 46.94809;
    const averageLng = this.totalAmt > 0 ? this.totalLng / this.totalAmt : 7.44744;

    const zoom = this.totalAmt > 0 ? 15 : 10;

    this.map.setView(L.latLng(averageLat, averageLng), zoom);
  }

}

interface GeoLocation {
  latitude: number;
  longitude: number;
  label: string;
  type: {
    color: string;
    shape: string;
  };
}
