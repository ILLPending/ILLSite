import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDataListComponent } from './admin-data-list.component';

describe('AdminDataListComponent', () => {
  let component: AdminDataListComponent;
  let fixture: ComponentFixture<AdminDataListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDataListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
