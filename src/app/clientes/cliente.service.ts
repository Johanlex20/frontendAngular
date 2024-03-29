import { Injectable, OnInit} from '@angular/core';
import { CLIENTES } from './cliente.json';
import { Cliente } from './cliente';
import { Observable,map,of,catchError,throwError,tap } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { formatDate, DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ClienteService implements OnInit{

  private urlEndPoint: string = "http://localhost:8080/api/clientes";

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient, private router:Router) { }

  ngOnInit(): void {
  }

  getAll(page:number): Observable<any[]> {
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint+'/page/' +page).pipe(
      
      tap((response:any) => {
        console.log('ClienteService: tap 1:');
        (response.content as Cliente[]).forEach( cliente => {
          console.log(cliente.nombre);
        });
      }),


      map((response:any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          //let datePipe = new DatePipe('en-US');
          //cliente.fecha =  datePipe.transform(cliente.fecha, 'dd-MM-yyyy');//FullDay //formatDate(cliente.fecha, 'dd-MM-yyyy','en-US');
          return cliente;
        });
        return response;
      }),

      
      tap(response => {
        console.log('ClienteService: tap 2:');
        (response.content as Cliente[]).forEach( cliente => {
          console.log(cliente.nombre);
        })
      }),


    );
  }

  create(cliente: Cliente) : Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      map((response:any) => response.cliente as Cliente),
      catchError( e=> {

        if(e.status==400){
          return throwError(e);
        }

        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

  getCliente(id):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError( e=> {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

  update(cliente: Cliente) :Observable<Cliente>{
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError( e=>{

        if(e.status==400){
          return throwError(e);
        }

        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

  delete(id:number) : Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers:this.httpHeaders}).pipe(
      catchError( e=> {
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

  subirFoto(archivo: File, id):Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);//mismo nombre que le pusimos en el backend
    formData.append("id",id);


    const req = new HttpRequest('POST',`${this.urlEndPoint}/upload`, formData,{
      reportProgress:true
    });

    return this.http.request(req);
  }

}