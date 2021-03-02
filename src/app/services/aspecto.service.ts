import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root"
})

//CONEXION BDD Y CRUD
export class AspectosService {
  //constructor
  constructor(private afs: AngularFirestore) {
    //vacio
  }

  //pendiente para el 1 de marzo

  //DECIDIR SI VOY A TRABAJAR CON 2 COLECCIONES SEPARADAS (RELACIONAL)
  //O 1 DENTRO DE LA OTRA (NO RELACIONAL?)

  //servicios similares a los de campeon.service.ts
}
