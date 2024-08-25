import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientesService } from '../../services/clientes.service';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent {

  clientes: Cliente[] = [];
  clienteForm: FormGroup;
  selectedCliente: Cliente | null = null;

  constructor(
    private clienteService: ClientesService,
    private fb: FormBuilder
  ) {
    this.clienteForm = this.fb.group({
      id_cliente: [''],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clienteService.obtenerClientes().subscribe(data => {
      this.clientes = data;
    });
  }

  crearCliente(): void {
    if (this.clienteForm.valid) {
      const cliente = this.clienteForm.value;
      if (!cliente.id_cliente) {
        // En creación, se debe omitir `id_cliente`
        delete cliente.id_cliente;
      }
      this.clienteService.crearCliente(cliente).subscribe(() => {
        this.cargarClientes();
        this.clienteForm.reset();
      });
    }
  }

  editarCliente(cliente: Cliente): void {
    this.selectedCliente = cliente;
    this.clienteForm.setValue({
      id_cliente: cliente.id_cliente,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      dni: cliente.dni
    });
  }

  actualizarCliente(): void {
    if (this.clienteForm.valid && this.selectedCliente) {
      const id = this.clienteForm.value.id_cliente;
      this.clienteService.editarCliente(id, this.clienteForm.value).subscribe(() => {
        this.cargarClientes();
        this.clienteForm.reset();
        this.selectedCliente = null;
      });
    }
  }

  eliminarCliente(id: number): void {
    this.clienteService.eliminarCliente(id).subscribe(() => {
      this.cargarClientes();
    });
  }
}
