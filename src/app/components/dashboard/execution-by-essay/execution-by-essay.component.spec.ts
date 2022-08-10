import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionByEssayComponent } from './execution-by-essay.component';

describe('ExecutionByEssayComponent', () => {
  let component: ExecutionByEssayComponent;
  let fixture: ComponentFixture<ExecutionByEssayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutionByEssayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutionByEssayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
