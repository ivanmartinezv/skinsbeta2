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

  //Servicio que formatea la coleccion Campeones en FB
  public formatearBDD(campeones: any) {
    console.log("que estoy recibiendo del componente??:", campeones);
    console.log("campeones.length: ", campeones.length);
    //por cada coincidencia en el documentId del campeon, lo elimina
    console.log("campeones[0] tiene id y data? ?:", campeones[0]);
    for (let i = 0; i < campeones.length; i++) {
      this.afs
        .collection("campeones")
        .doc(campeones[i].id)
        .delete();
    }
    console.log("Coleccion campeones vacía...");
  }

  //(Pre-A) Servicio que cuenta los campeones habidos en firebase
  public contarCampeones(): number {
    this.afs
      .collection("campeones")
      .valueChanges()
      .subscribe(cantidad => {
        //console.log("hay ", cantidad.length, " campeones");
        return cantidad.length;
      });
    return 0;
  }

  verificaNombre(nombre: string): boolean {
    /*hacer el getCampeonbyNombre*/

    if (true) {
      //si el nombre ya existe
      return false; //no se agrega
    } else {
      //si no existe
      return true; //se agrega
    }
  }

  //A. Enviar nombres de campeones a firebase
  public enviarDatos(nombres_campeones: any) {
    let allNombres = nombres_campeones; //ACA VOY, NO SE SI
    for (let i = 0; i < allNombres.length; i++) {
      /*VERIFICAR SI EL NOMBRE YA SE ENCUENTRA Y EVITAR AGREGAR DUPLICADOS*/

      if (this.verificaNombre(allNombres[i])) {
        if (i < 5) {
          console.log(i + 1, ":", allNombres[i]);
        }
        /*AQUI POR CADA CAMPEON, SE PODRIA RECORRER TODO EL ARRAY DE ASPECTOS Y TRAER LOS QUE LE PERTENECEN Y ASIGNARLO AL ARRAY aspectos CON EL push()*/
        let data_temp: {
          id: number;
          nombre: string;
          url: string;
          aspectos: any[]; //coleccion de aspectos
          cont_obtenible: number;
          cont_posesion: number; //cuantas tengo
          //cuantas no tengo se puede calcular (total-tengo)
          cont_botin: number; //cuantas hay en cont_botin
        } = {
          id: i + 1, //id correlativo para hacer match con los aspectos
          nombre: allNombres[i],
          url: "",
          aspectos: [], //new collection() --> algo asi
          cont_obtenible: 0,
          cont_posesion: 0,
          //cuantas no tengo se puede calcular (total-tengo)
          cont_botin: 0
        };
        this.afs.collection("campeones").add(data_temp);
      }
    }
    console.log("servicio: datos enviados a firebase");
  }

  //(1) Crea un nuevo campeon en firebase
  public createCampeon(data: {
    nombre: string;
    url: string;
    aspectos: {}; //era any[], queda RESUELTO
    cont_obtenible: number;
    cont_posesion: number;
    cont_botin: number;
  }) {
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
    let champs = this.afs.collection("campeones").snapshotChanges();
    //console.log("servicio: getcampeones() -->", champs);
    return champs;
  }

  //(4) Actualiza un campeon
  //en primera instancia borra los datos diferentes al nombre y url
  public updateCampeon(documentId: string, data: any) {
    let campeonActual = this.getCampeon(documentId);
    console.log("campeon actual:", campeonActual);
    console.log("se actualiza:", data);
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
