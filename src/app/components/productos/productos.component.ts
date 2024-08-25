import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../models/producto.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {

  productos: Producto[] = [];
  productoForm: FormGroup;
  selectedProducto: Producto | null = null;

  constructor(
    private productoService: ProductosService,
    private fb: FormBuilder
  ) {
    this.productoForm = this.fb.group({
      id_producto: [''],
      nombre: ['', Validators.required],
      marca: ['', Validators.required],
      costo: [0, [Validators.required, Validators.min(0)]],
      cantidad_disponible: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe(data => {
      this.productos = data;
    });
  }

  crearProducto(): void {
    if (this.productoForm.valid) {
      const producto = this.productoForm.value;
      if (!producto.id_producto) {
        // En creación, se debe omitir `id_producto`
        delete producto.id_producto;
      }
      this.productoService.crearProducto(producto).subscribe(() => {
        this.cargarProductos();
        this.productoForm.reset();
      });
      this.cargarProductos();
    }
  }

  editarProducto(producto: Producto): void {
    this.selectedProducto = producto;
    this.productoForm.setValue({
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      marca: producto.marca,
      costo: producto.costo,
      cantidad_disponible: producto.cantidad_disponible
    });
  }

  actualizarProducto(): void {
    if (this.productoForm.valid && this.selectedProducto) {
      const id = this.productoForm.value.id_producto;
      this.productoService.editarProducto(id, this.productoForm.value).subscribe(() => {
        this.cargarProductos();
        this.productoForm.reset();
        this.selectedProducto = null;
      });
    }
  }

  eliminarProducto(id: number): void {
    this.productoService.eliminarProducto(id).subscribe(() => {
      this.cargarProductos();
    });
  }

}
