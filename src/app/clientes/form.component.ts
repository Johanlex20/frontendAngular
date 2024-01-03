import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit{

  public cliente: Cliente = new Cliente();
  public titulo: string = "Crear Cliente"; 

  private errores:string[];

  constructor(private clienteService:ClienteService, private router:Router, private activateRouter:ActivatedRoute){}

  ngOnInit(): void {
    this.cargarCliente()
  }

  cargarCliente(){
    this.activateRouter.params.subscribe(params => {
      let id = params ['id']
      if(id){
        this.clienteService.getCliente(id).subscribe( (cliente) => this.cliente = cliente)
      }
    });
  }

  create(): void{
      //console.log("click");
      //console.log(this.cliente);
      this.clienteService.create(this.cliente)
      .subscribe(
        cliente => {
          this.router.navigate(['/clientes'])
          Swal.fire('Nuevo Cliente',`Cliente ${this.cliente.nombre } creado con éxito!`, 'success')
        },
        err =>{
          this.errores = err.error.errors as string[];
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        }
      );
  }

  update(): void{
    this.clienteService.update(this.cliente)
    .subscribe( cliente => {
        this.router.navigate(['/clientes'])
        Swal.fire('Cliente Actualizado', `Cliente ${this.cliente.nombre} actualizado con éxito`, 'success')
      },
      err =>{
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }

}
