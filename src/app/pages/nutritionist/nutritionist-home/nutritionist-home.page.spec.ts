import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionistHomePage } from './nutritionist-home.page';

describe('NutritionistHomePage', () => {
  let component: NutritionistHomePage;
  let fixture: ComponentFixture<NutritionistHomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NutritionistHomePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NutritionistHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
