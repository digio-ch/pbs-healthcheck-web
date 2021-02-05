import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {WidgetComponent} from '../widget/widget.component';
import {LeaderOverviewGroupAdapter} from '../../../../shared/adapters/leader-overview/leader-overview-group.adapter';
import {LeaderOverviewGroup} from '../../../../shared/models/leader-overview/leader-overview-group';
import {BehaviorSubject} from 'rxjs';
import {WidgetTypeService} from '../../../services/widget-type.service';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-leader-overview',
  templateUrl: './leader-overview.component.html',
  styleUrls: ['./leader-overview.component.scss'],
  animations: [
    trigger('fadeOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.2s ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.2s ease-in', style({ opacity: 0 }))
      ]),
    ])
  ]
})
export class LeaderOverviewComponent extends WidgetComponent implements OnInit, AfterViewInit {
  public static WIDGET_CLASS_NAME = 'LeaderOverviewComponent';
  @ViewChild('leftIndicator', { static: false }) leftIndicator: ElementRef;
  @ViewChild('rightIndicator', { static: false }) rightIndicator: ElementRef;
  @ViewChild('itemContainer', { static: false }) itemContainer: ElementRef;
  showIndicators = false;
  leaderData: LeaderOverviewGroup[];
  scrollOffsetXSubject = new BehaviorSubject<number>(0);
  position = {left: 0, x: 0};
  grabbed = false;
  cursor = 'default';

  constructor(
    protected widgetTypeService: WidgetTypeService,
    protected leaderOverviewGroupAdapter: LeaderOverviewGroupAdapter
  ) {
    super(widgetTypeService, LeaderOverviewComponent);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.leaderData = this.leaderOverviewGroupAdapter.adaptArray(this.chartData).filter(
      l => {
        return !l.empty;
      }
    );
  }

  @HostListener('window:resize', ['$event']) onResize() {
    if (this.itemContainer.nativeElement.scrollWidth > window.innerWidth) {
      return;
    }
    this.cursor = 'default';
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.itemContainer.nativeElement.scrollWidth > window.innerWidth) {
        this.showIndicators = true;
      }
    });
    setTimeout(() => {
      this.showIndicators = false;
    }, 3000);
  }

  mouseDown(event) {
    if (this.itemContainer.nativeElement.scrollWidth < window.innerWidth) {
      return;
    }
    this.position.left = this.itemContainer.nativeElement.scrollLeft;
    this.position.x = event.clientX;

    this.cursor = 'grabbing';
    this.itemContainer.nativeElement.style.userSelect = 'none';

    this.grabbed = true;
  }

  mouseMove(event) {
    if (this.itemContainer.nativeElement.scrollWidth < window.innerWidth) {
      return;
    }
    if (!this.grabbed) { return; }
    const dx = event.clientX - this.position.x;
    this.itemContainer.nativeElement.scrollLeft = this.position.left - dx;
  }

  mouseUp(event) {
    if (this.itemContainer.nativeElement.scrollWidth < window.innerWidth) {
      return;
    }
    this.cursor = 'grab';
    this.itemContainer.nativeElement.style.removeProperty('user-select');

    this.grabbed = false;
  }

}
