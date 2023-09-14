import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomGanttChartComponent } from './custom-gantt-chart.component';

describe('CustomGanttChartComponent', () => {
  let component: CustomGanttChartComponent;
  let fixture: ComponentFixture<CustomGanttChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomGanttChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomGanttChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
