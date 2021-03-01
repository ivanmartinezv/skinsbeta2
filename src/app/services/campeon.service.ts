import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root"
})

//CONEXION BDD Y CRUD
export class CampeonService {
  //constructor
  constructor(private afs: AngularFirestore) {
    //vacio
  }

  //A. Enviar nombres de campeones a firebase
  public enviarDatos(nombres_campeones: any) {
    let allNombres = nombres_campeones; //ACA VOY, NO SE SI
    for (let i = 0; i < allNombres.length; i++) {
      if (i < 4) {
        console.log(i + 1, ": ", allNombres[i]);
      }
      let data_temp: {
        id: number;
        nombre: string;
        url: string;
        aspectos: any[];
        cont_obtenible: number;
        cont_posesion: number; //cuantas tengo
        //cuantas no tengo se puede calcular (total-tengo)
        cont_botin: number; //cuantas hay en cont_botin
      } = {
        id: i + 1, //necesito el id correlativo para hacer match con los aspectos
        nombre: allNombres[i],
        url: "",
        aspectos: [],
        cont_obtenible: 0,
        cont_posesion: 0,
        //cuantas no tengo se puede calcular (total-tengo)
        cont_botin: 0
      };
      this.afs.collection("campeones").add(data_temp);
    }
    console.log("servicio: datos enviados a firebase");
  }

  //B. Formatear collection "campeones_temp"
  public formatearBDD(campeones: any) {
    console.log("que estoy recibiendo??", campeones);
    console.log("campeones.length: ", campeones.length);
    //por cada coincidencia en el documentId del campeon, lo elimina
    console.log("campeones[0] tiene id y data? ?:", campeones[0]);
    console.log("campeones[1] tiene id y data? ?:", campeones[1]);
    console.log("campeones[2] tiene id y data? ?:", campeones[2]);
    for (let i = 0; i < campeones.length; i++) {
      if (i < 5) {
        console.log("nombre a borrar: ", campeones[i].data.nombre);
        console.log("id a borrar: ", campeones[i].id);
      }
      this.afs
        .collection("campeones")
        .doc(campeones[i].id)
        .delete();
    }
    console.log("Coleccion campeones vacía...");
  }

  //(1) Crea un nuevo campeon
  public createCampeon(data: { nombre: string; url: string; aspectos: any[];  }) {
    return this.afs.collection("campeones").add(data);
  }

  //(2) Obtiene un campeon
  public getCampeon(documentId: string) {
    return this.afs
      .collection("campeones")
      .doc(documentId)
      .snapshotChanges();
  }

  //(3) Obtiene todos los campeones
  public getCampeones() {
    return this.afs.collection("campeones").snapshotChanges();
  }

  //(4) Actualiza un campeon
  public updateCampeon(documentId: string, data: any) {
    return this.afs
      .collection("campeones")
      .doc(documentId)
      .set(data);
  }

  //(5) Elimina un campeon
  public deleteCampeon(documentId: string) {
    return this.afs
      .collection("campeones")
      .doc(documentId)
      .delete();
  }
}
