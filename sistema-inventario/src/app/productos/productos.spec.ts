import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductosComponent } from './productos';

describe('ProductosComponent', () => {
  let component: ProductosComponent;
  let fixture: ComponentFixture<ProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe agregar un producto y limpiar el formulario', () => {
    component.nuevoNombre = 'Teclado';
    component.nuevoPrecio = 100;
    component.nuevaCantidad = 5;
    component.agregarProducto();

    expect(component.productos.length).toBe(1);
    expect(component.productos[0].nombre).toBe('Teclado');
    expect(component.nuevoNombre).toBe('');
  });

  it('debe eliminar un producto por id', () => {
    component.nuevoNombre = 'Mouse';
    component.nuevoPrecio = 50;
    component.nuevaCantidad = 3;
    component.agregarProducto();

    const id = component.productos[0].id;
    component.eliminarProducto(id);

    expect(component.productos.length).toBe(0);
  });
});
