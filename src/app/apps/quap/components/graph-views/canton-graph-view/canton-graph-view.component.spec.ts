import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CantonGraphViewComponent } from './canton-graph-view.component';

describe('CantonGraphViewComponent', () => {
  let component: CantonGraphViewComponent;
  let fixture: ComponentFixture<CantonGraphViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CantonGraphViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CantonGraphViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
