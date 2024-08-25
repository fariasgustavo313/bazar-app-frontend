import { Component } from '@angular/core';
import { Venta } from '../../models/venta.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VentasService } from '../../services/ventas.service';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/producto.model';
import { ProductosService } from '../../services/productos.service';
import { ClientesService } from '../../services/clientes.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.scss'
})
export class VentasComponent {

  ventas: Venta[] = [];
  ventaForm: FormGroup;
  productos: Producto[] = [];
  clientes: Cliente[] = [];
  productosSeleccionados: Producto[] = [];

  constructor(
    private ventaService: VentasService,
    private productoService: ProductosService, // Asegúrate de tener este servicio
    private clienteService: ClientesService, // Asegúrate de tener este servicio
    private fb: FormBuilder
  ) {
    this.ventaForm = this.fb.group({
      id_venta: [''],
      fecha_venta: ['', Validators.required],
      total: [0, [Validators.required, Validators.min(0)]],
      cliente: [null, Validators.required],  // Cliente debe ser de tipo Cliente
      listaProductos: [[]]
    });
  }

  ngOnInit(): void {
    this.cargarVentas();
    this.cargarProductos();
    this.cargarClientes();
  }

  cargarVentas(): void {
    this.ventaService.obtenerVentas().subscribe(data => {
      this.ventas = data;
    });
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe(data => {
      this.productos = data;
    });
  }

  cargarClientes(): void {
    this.clienteService.obtenerClientes().subscribe(data => {
      this.clientes = data;
    });
  }

  crearVenta(): void {
    if (this.ventaForm.valid) {
      const venta: Venta = this.ventaForm.value;
      venta.listaProductos = this.productosSeleccionados; // Agregar productos seleccionados a la venta
      if (!venta.id_venta) {
        delete venta.id_venta;
      }
      this.ventaService.crearVenta(venta).subscribe(() => {
        this.cargarVentas();
        this.ventaForm.reset();
        this.productosSeleccionados = [];
      });
    }
  }

  agregarProducto(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const idProducto = Number(target.value);
    const producto = this.productos.find(p => p.id_producto === idProducto);
    if (producto) {
      this.productosSeleccionados.push(producto);
      this.ventaForm.patchValue({ total: this.calcularTotal() });
    }
  }

  removerProducto(id_producto: number): void {
    this.productosSeleccionados = this.productosSeleccionados.filter(p => p.id_producto !== id_producto);
    this.ventaForm.patchValue({ total: this.calcularTotal() });
  }

  calcularTotal(): number {
    return this.productosSeleccionados.reduce((acc, producto) => acc + producto.costo, 0);
  }
}
