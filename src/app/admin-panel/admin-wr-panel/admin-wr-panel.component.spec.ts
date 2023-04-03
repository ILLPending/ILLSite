import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWrPanelComponent } from './admin-wr-panel.component';

describe('AdminWrPanelComponent', () => {
  let component: AdminWrPanelComponent;
  let fixture: ComponentFixture<AdminWrPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminWrPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminWrPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
