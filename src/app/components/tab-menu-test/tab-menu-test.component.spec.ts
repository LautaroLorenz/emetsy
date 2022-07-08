import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabMenuTestComponent } from './tab-menu-test.component';

describe('TabMenuTestComponent', () => {
  let component: TabMenuTestComponent;
  let fixture: ComponentFixture<TabMenuTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabMenuTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabMenuTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
