import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QnDiv } from './qn-div';

describe('QnDiv', () => {
  let component: QnDiv;
  let fixture: ComponentFixture<QnDiv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QnDiv]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QnDiv);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
