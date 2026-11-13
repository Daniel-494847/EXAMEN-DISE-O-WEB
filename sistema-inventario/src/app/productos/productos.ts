import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-productos',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class ProductosComponent {
  nuevoNombre = '';
  nuevoPrecio: number | null = null;
  nuevaCantidad: number | null = null;

  productos: Producto[] = [];

  agregarProducto() {
    if (!this.nuevoNombre.trim() || this.nuevoPrecio === null || this.nuevaCantidad === null) return;
    this.productos.push({
      id: Date.now(),
      nombre: this.nuevoNombre,
      precio: this.nuevoPrecio,
      cantidad: this.nuevaCantidad
    });
    this.nuevoNombre = '';
    this.nuevoPrecio = null;
    this.nuevaCantidad = null;
  }

  eliminarProducto(id: number) {
    this.productos = this.productos.filter(p => p.id !== id);
  }
}
