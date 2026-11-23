import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheveiculoComponent } from './detalheveiculo.component';

describe('DetalheveiculoComponent', () => {
  let component: DetalheveiculoComponent;
  let fixture: ComponentFixture<DetalheveiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheveiculoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalheveiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
