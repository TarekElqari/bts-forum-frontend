import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudOrTeachComponent } from './stud-or-teach.component';

describe('StudOrTeachComponent', () => {
  let component: StudOrTeachComponent;
  let fixture: ComponentFixture<StudOrTeachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudOrTeachComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudOrTeachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
