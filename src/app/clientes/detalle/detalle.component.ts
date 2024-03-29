import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';


@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit{
  @Input() cliente:Cliente;
  titulo:string = "Detalle del cliente";
  fotoSeleccionada: File;
  progreso: number = 0;


  constructor(private clienteService:ClienteService, 
     public modalService:ModalService){}


  ngOnInit(): void {

  }

  seleccionarFoto(event){
      this.fotoSeleccionada = event.target.files[0];
      this.progreso =0;
      console.log(this.fotoSeleccionada);
      if(this.fotoSeleccionada.type.indexOf('image') < 0){
        Swal.fire('error seleccionar imagen:','El archivo debe ser del tipo imagen', 'error');
        this.fotoSeleccionada =null;
      }
  }

  subirFoto(){
    if(!this.fotoSeleccionada){
      Swal.fire('error upload:','ERROR : debe seleccionar una foto', 'error');
    }else{
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
      .subscribe(event=>{
        if(event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded/event.total)*100);
        }else if(event.type === HttpEventType.Response){
          let response: any = event.body;
          this.cliente = response.cliente as Cliente;
          
          this.modalService.notificarUpload.emit(this.cliente);
          Swal.fire('La foto se ha subido completamente!',response.mensaje, 'success')
        }   
      });
    }
  }

  cerrarModal(){
    this.modalService.cerrarModal(); 
    this.fotoSeleccionada = null;
    this.progreso =0;
  }

}
