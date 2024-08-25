import { Cliente } from './cliente.model';
import { Producto } from './producto.model';

export interface Venta {
  id_venta?: number;
  fecha_venta: string; // Usa string para manejar fechas en formato ISO
  total: number;
  cliente: Cliente;
  listaProductos: Producto[];
}
