import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopFloorNewComponent } from './shop-floor-new.component';

describe('ShopFloorNewComponent', () => {
  let component: ShopFloorNewComponent;
  let fixture: ComponentFixture<ShopFloorNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShopFloorNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShopFloorNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
