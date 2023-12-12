import { Injectable } from '@angular/core';
import { CLIENTES } from './cliente.json';
import { Cliente } from './cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor() { }

  getAll(): Cliente[]{
    return CLIENTES
  }
}
