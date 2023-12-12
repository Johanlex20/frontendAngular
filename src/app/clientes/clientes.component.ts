import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit{

 public clientes:Cliente[];

constructor(private clienteService:ClienteService){}

ngOnInit(){
  this.clienteService.getAll().subscribe(
    clientes=> this.clientes = clientes
  )
}


}
