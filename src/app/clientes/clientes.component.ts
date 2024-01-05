import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { map } from 'rxjs';
import Swal from 'sweetalert2';
import { tap } from 'rxjs';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit{

 public clientes:Cliente[];

constructor(private clienteService:ClienteService){}

  ngOnInit(){
    this.clienteService.getAll().pipe(
      tap( clientes => {
        console.log('ClienteComponent: tap 3:')
        clientes.forEach( cliente => {
          console.log(cliente.nombre);
        })
      })
    )
    .subscribe(
      clientes=> this.clientes = clientes
    );
  }

  delete(cliente: Cliente) :void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Esta seguro?",
      text: `Seguro que desea eliminar al cliente ${(cliente.nombre)} ${(cliente.apellido)}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, Eliminar!",
      cancelButtonText: "No, cancelar!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        this.clienteService.delete(cliente.id).subscribe(
          response => {

            this.clientes = this.clientes.filter(cli => cli !== cliente) 

            swalWithBootstrapButtons.fire({
              title: "Cliente Eliminado",
              text: `Cliente ${(cliente.nombre)} Eliminado con Éxito.`,
              icon: "success"
            });
          })
      } 
    });
  }

}
