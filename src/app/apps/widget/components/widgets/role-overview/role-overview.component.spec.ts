import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleOverviewComponent } from './role-overview.component';

describe('RoleOverviewComponent', () => {
  let component: RoleOverviewComponent;
  let fixture: ComponentFixture<RoleOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
