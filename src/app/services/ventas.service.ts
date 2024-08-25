import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../models/venta.model';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  private apiUrl = 'http://localhost:8080/ventas'; // URL del backend

  constructor(private http: HttpClient) { }

  obtenerVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl);
  }

  crearVenta(venta: Venta): Observable<void> {
    return this.http.post<void>(this.apiUrl, venta);
  }

  editarVenta(id: number, venta: Venta): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, venta);
  }

  eliminarVenta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
