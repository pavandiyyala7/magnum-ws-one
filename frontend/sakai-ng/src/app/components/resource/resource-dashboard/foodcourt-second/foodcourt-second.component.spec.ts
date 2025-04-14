import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodcourtSecondComponent } from './foodcourt-second.component';

describe('FoodcourtSecondComponent', () => {
  let component: FoodcourtSecondComponent;
  let fixture: ComponentFixture<FoodcourtSecondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoodcourtSecondComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FoodcourtSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
