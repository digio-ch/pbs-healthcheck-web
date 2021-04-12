import { Component, OnInit } from '@angular/core';
import {WidgetComponent} from '../widget/widget.component';
import {WidgetTypeService} from '../../../services/widget-type.service';
import * as L from 'leaflet';
import 'leaflet-fullscreen';
import 'dependencies/leaflet.markercluster/dist/leaflet.markercluster.js';
import {TranslateService} from "@ngx-translate/core";
import {Layer} from "leaflet";

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

  private addressMarker;

  constructor(
    widgetTypeService: WidgetTypeService,
    private translateService: TranslateService
  ) {
    super(widgetTypeService, GeoLocationComponent);
  }

  ngOnInit(): void {
    this.loadDataPoints();

    this.setupMap();

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

  private async setupLayers(): Promise<void> {
    const pixelkarteUrl = 'https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg';
    const pixelkarteTileLayer = L.tileLayer(pixelkarteUrl);

    const streetMapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const streetMapTileLayer = L.tileLayer(streetMapUrl);

    this.map.addLayer(pixelkarteTileLayer);

    const residences = await this.translateService.get('chart.geo-location.residences').toPromise();

    const overlays = {};
    overlays[residences] = this.addressMarker;

    this.map.addLayer(this.addressMarker);

    L.control.layers(
      {
        swisstopo: pixelkarteTileLayer,
        openstreetmap: streetMapTileLayer
      },
      overlays
    ).addTo(this.map);
  }

  private loadDataPoints(): void {
    const data = this.chartData as GeoLocation[];

    const markerCluster = (L as any).markerClusterGroup();

    const icon = (color: string) => {
      return L.divIcon({
        html: '<div class="leaflet-geo-location" style="background-color: ' + color + '"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        className: ''
      });
    };

    data.map(geoLocation => {
      if (geoLocation.latitude) {
        this.totalLat += geoLocation.latitude;
        this.totalLng += geoLocation.longitude;
        this.totalAmt++;

        const marker = L.marker([geoLocation.latitude, geoLocation.longitude], {
          icon: icon(geoLocation.type.color),
          riseOnHover: true
        }).bindPopup(geoLocation.label);

        markerCluster.addLayer(marker);
      }
    });

    this.addressMarker = markerCluster;
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
