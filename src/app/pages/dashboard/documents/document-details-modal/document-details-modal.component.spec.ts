import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentDetailsModalComponent } from './document-details-modal.component';

describe('DocumentDetailsModalComponent', () => {
  let component: DocumentDetailsModalComponent;
  let fixture: ComponentFixture<DocumentDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentDetailsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
