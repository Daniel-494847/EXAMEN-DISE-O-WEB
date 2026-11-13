import { Component } from '@angular/core';
import { ProductosComponent } from './productos/productos';

@Component({
  imports: [ProductosComponent],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {}
