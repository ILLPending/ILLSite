import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMiscPanelComponent } from './admin-misc-panel.component';

describe('AdminMiscPanelComponent', () => {
  let component: AdminMiscPanelComponent;
  let fixture: ComponentFixture<AdminMiscPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminMiscPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMiscPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
