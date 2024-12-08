import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpoFilhoComponent } from './corpo-filho.component';

describe('CorpoFilhoComponent', () => {
  let component: CorpoFilhoComponent;
  let fixture: ComponentFixture<CorpoFilhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorpoFilhoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorpoFilhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
