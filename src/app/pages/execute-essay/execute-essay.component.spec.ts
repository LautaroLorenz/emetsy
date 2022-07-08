import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecuteEssayComponent } from './execute-essay.component';

describe('ExecuteEssayComponent', () => {
  let component: ExecuteEssayComponent;
  let fixture: ComponentFixture<ExecuteEssayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecuteEssayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecuteEssayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
