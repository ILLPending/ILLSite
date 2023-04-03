import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProfilesPanelComponent } from './admin-profiles-panel.component';

describe('AdminProfilesPanelComponent', () => {
  let component: AdminProfilesPanelComponent;
  let fixture: ComponentFixture<AdminProfilesPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminProfilesPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProfilesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
