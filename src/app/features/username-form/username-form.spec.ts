import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernameForm } from './username-form';

describe('UsernameForm', () => {
  let component: UsernameForm;
  let fixture: ComponentFixture<UsernameForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsernameForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsernameForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
