import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {WidgetComponent} from '../widget/widget.component';
import {WidgetTypeService} from '../../../services/widget-type.service';
import * as L from 'leaflet';
import 'leaflet-fullscreen';
import 'dependencies/leaflet.markercluster/dist/leaflet.markercluster.js';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-geo-location',
  templateUrl: './geo-location.component.html',
  styleUrls: ['./geo-location.component.scss']
})
export class GeoLocationComponent extends WidgetComponent implements OnInit, AfterViewInit {
  public static WIDGET_CLASS_NAME = 'GeoLocationComponent';

  @ViewChild('map', { static: true }) mapRef: any;

  private map: L.Map;

  private totalLat = 0;
  private totalLng = 0;
  private totalAmt = 0;

  notFound = 0;

  private addressMarker;
  private meetingPointMarkers;

  constructor(
    widgetTypeService: WidgetTypeService,
    private translateService: TranslateService
  ) {
    super(widgetTypeService, GeoLocationComponent);
  }

  ngOnInit(): void {
    this.loadDataPoints();
  }

  ngAfterViewInit(): void {
    this.setupMap();

    this.alignMap();

    const map = this.map;

    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }

  private setupMap(): void {
    this.map = L.map(this.mapRef.nativeElement, {
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
    const pixelkarteGrauUrl = 'https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-grau/default/current/3857/{z}/{x}/{y}.jpeg';
    const pixelkarteGrauTileLayer = L.tileLayer(pixelkarteGrauUrl, {
      attribution: '&copy; <a href="https://www.swisstopo.admin.ch/" target="_blank" rel="noopener noreferrer">swisstopo</a>',
    });

    const pixelkarteUrl = 'https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg';
    const pixelkarteTileLayer = L.tileLayer(pixelkarteUrl, {
      attribution: '&copy; <a href="https://www.swisstopo.admin.ch/" target="_blank" rel="noopener noreferrer">swisstopo</a>',
    });

    const streetMapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const streetMapTileLayer = L.tileLayer(streetMapUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    });

    this.map.addLayer(pixelkarteGrauTileLayer);

    const residences = await this.translateService.get('chart.geo-location.residences').toPromise();
    const meetingPoints = await this.translateService.get('chart.geo-location.meeting-points').toPromise();

    const overlays = {};
    overlays[residences] = this.addressMarker;
    overlays[meetingPoints] = this.meetingPointMarkers;

    this.map.addLayer(this.addressMarker);
    this.map.addLayer(this.meetingPointMarkers);

    L.control.layers(
      {
        'Swisstopo (grau)': pixelkarteGrauTileLayer,
        'Swisstopo (farbig)': pixelkarteTileLayer,
        OpenStreetMap: streetMapTileLayer
      },
      overlays
    ).addTo(this.map);
  }

  private loadDataPoints(): void {
    const data = this.chartData as GeoLocation[];
    const addresses = data.filter(o => o.type.shape === 'circle');
    const meetingPoints = data.filter(o => o.type.shape === 'group_meeting_point');

    const addressMarkerCluster = (L as any).markerClusterGroup({
      disableClusteringAtZoom: 14,
    });
    const meetingMarkerCluster = (L as any).markerClusterGroup({
      disableClusteringAtZoom: 12,
    });

    const iconSize = 15;
    const groupMeetingIconSize = 25;

    const icon = (color: string) => {
      return L.divIcon({
        html: '<div class="leaflet-geo-location" style="background-color: ' + color + '"></div>',
        iconSize: [iconSize, iconSize],
        iconAnchor: [iconSize / 2, iconSize / 2],
        className: ''
      });
    };

    const meetingIcon = () => {
      return L.divIcon({
        html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" height="30" width="30"><defs></defs><g stroke="#d96a09"><path fill="none" stroke-linecap="round" stroke-linejoin="round" d="m23.25.748-7.5 7.5"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" d="M8.25 21.748v-6h-6"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" d="M15.75 2.248v6h6"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" d="m8.25 15.748-7.5 7.5"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" d="m.75.748 7.5 7.5"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" d="M15.75 21.748v-6h6"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" d="M8.25 2.248v6h-6"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" d="m15.75 15.748 7.5 7.5"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" d="M9.75 11.998a2.25 2.25 0 1 0 4.5 0 2.25 2.25 0 1 0-4.5 0"></path></g></svg>',
        iconSize: [groupMeetingIconSize, groupMeetingIconSize],
        iconAnchor: [groupMeetingIconSize / 2, groupMeetingIconSize / 2],
        className: ''
      });
    };

    addresses.map(geoLocation => {
      if (geoLocation.latitude) {
        geoLocation.latitude += (Math.random() - 0.5) * 0.00015;
        geoLocation.longitude += (Math.random() - 0.5) * 0.00015;

        this.totalLat += geoLocation.latitude;
        this.totalLng += geoLocation.longitude;
        this.totalAmt++;

        const marker = L.marker([geoLocation.latitude, geoLocation.longitude], {
          icon: icon(geoLocation.type.color),
          riseOnHover: true
        }).bindPopup(geoLocation.label);

        marker.on('mouseover', () => {
          marker.openPopup();
        });

        marker.on('mouseout', () => {
          marker.closePopup();
        });

        if (geoLocation.type.shape === 'circle') {
          addressMarkerCluster.addLayer(marker);
        }
      } else {
        this.notFound++;
      }
    });

    meetingPoints.map(geoLocation => {
      const marker = L.marker([geoLocation.latitude, geoLocation.longitude], {
        icon: meetingIcon(),
        riseOnHover: true
      });
      meetingMarkerCluster.addLayer(marker);
    });

    this.addressMarker = addressMarkerCluster;
    this.meetingPointMarkers = meetingMarkerCluster;
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
