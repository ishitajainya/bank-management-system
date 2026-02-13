import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClerkComponent } from './create-clerk.component';

describe('CreateClerkComponent', () => {
  let component: CreateClerkComponent;
  let fixture: ComponentFixture<CreateClerkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateClerkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateClerkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
