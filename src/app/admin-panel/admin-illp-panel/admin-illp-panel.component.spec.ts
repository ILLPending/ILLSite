import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminIllpPanelComponent } from './admin-illp-panel.component';

describe('AdminIllpPanelComponent', () => {
  let component: AdminIllpPanelComponent;
  let fixture: ComponentFixture<AdminIllpPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminIllpPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminIllpPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
