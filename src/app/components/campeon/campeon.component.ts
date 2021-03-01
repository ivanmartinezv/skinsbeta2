import { Component, OnInit } from "@angular/core";
//formularios
import {
  FormControl,
  FormGroup,
  Validators /*, FormBuilder*/
} from "@angular/forms";
//import {FormsModule,ReactiveFormsModule} from '@angular/forms';
//modelos
import { Campeon } from "../../models/campeon.model";
//servicios
import { CampeonService } from "../../services/campeon.service";

//import { Aspecto } from "../../models/aspecto.model";
import {
  aspectos_aatrox,
  LISTADO_CAMPEONES,
  LISTADO_ASPECTOS
} from "../../models/listado.global";
import { Aspecto } from "../../models/aspecto.model";

@Component({
  selector: "app-campeon",
  templateUrl: "./campeon.component.html",
  styleUrls: ["./campeon.component.css"]
})

//COMPONENTE CREADO PARA IMPLEMENTAR UN MODELO NO RELACIONAL DE DATOS
export class CampeonComponent implements OnInit {
  public titulo_0 = "Titulo del app-campeon";
  public titulo = "Listado de Campeones";
  //hay que importar la clase Campeon de "./models/campeon.model";
  //enviar o borrar datos estaticos (LISTADO_CAMPEONES) a Firebase
  public enviarDatos: boolean = false;
  public mostrarEnviar: boolean = true;
  public borrarDatos: boolean = false;
  public mostrarFormatear: boolean = false;
  //hay que leer los campeones de la constante --> LISTADO_CAMPEONES
  public listado_nombres: any = LISTADO_CAMPEONES;
  public total_nombres: number = LISTADO_CAMPEONES.length;
  //array de campeones
  public allCampeones: any = [];

  //(I) Array que contendrá los datos de firebase
  public campeones: any[] = []; //no se usa Campeon[]
  //(II) atributos para editar productos
  public documentId = null;

  /*La app maneja 2 estados, currentStatus = 0 -> la app se encuentra en modo de creación?? de documentos, ó currentStatus = 1 -> la app se encuentra en modo de edición?? de documentos. */
  public currentStatus = 1;
  public newCampeonForm = new FormGroup({
    nombre: new FormControl("", Validators.required),
    url: new FormControl("", Validators.required),
    id: new FormControl("")
    //al enviar los datos del formulario, hay que agregar los CONTADORES
  });

  /*CHALLA*/
  public aspectos_de_aatrox: {} = aspectos_aatrox;
  public listado_aspectos = LISTADO_ASPECTOS;

  //CONTADORES TOTALES
  public total_aspectos: number = this.listado_aspectos.length;
  public total_obtenibles: number = 0;
  public total_posesion: number = 0;
  public total_botin: number = 0;
  /*FIN CHALLA*/

  constructor(private _campeonService: CampeonService) {
    //funcion con los datos que trae el servicio
    this.newCampeonForm.setValue({
      id: "",
      nombre: "",
      url: ""
    });
  }

  ngOnInit() {
    console.log("hola oninit");
    //el ngOnInit es el que invoca al servicio para LEER datos de BDD
    this.lecturaDatosFirebase();
  }

  //Alfa. Cargar datos de firebase en la variables campeones[]
  lecturaDatosFirebase() {
    this._campeonService.getCampeones().subscribe(campeonesSnapshot => {
      this.campeones = [];
      campeonesSnapshot.forEach((campeonData: any) => {
        this.campeones.push({
          id: campeonData.payload.doc.id, //documentId del documento
          data: campeonData.payload.doc.data() //datos del data
        });
      });
    });
    if ((this.campeones.length = 0)) {
      this.mostrarEnviar = true;
      this.mostrarFormatear = false;
    } else {
      this.mostrarEnviar = false;
      this.mostrarFormatear = true;
    }
  }

  //A. Este metodo cambia a true el booleano y envia los datos ESTATICOS a firebase
  enviarDatosBDD() {
    this.enviarDatos = true;
    console.log("listado_nombres: ", this.listado_nombres.length);
    if (this.enviarDatos) {
      this._campeonService.enviarDatos(this.listado_nombres);
      this.enviarDatos = false;
      console.log("ya no se envian datos.");
    }
    this.mostrarEnviar = false;
    this.mostrarFormatear = true;
  }

  //B. Este metodo cambia a true el booleano y elimina datos enviados por A. pero que se encuentran en this.campeones
  formatearBDD() {
    this.borrarDatos = true;
    console.log("formateando BDD");
    if (this.borrarDatos) {
      console.log("que estoy enviando??", this.campeones);
      this._campeonService.formatearBDD(this.campeones);
      this.enviarDatos = false;
      console.log("ya no se eliminan datos.");
      this.lecturaDatosFirebase();
    }
    this.mostrarEnviar = true;
    this.mostrarFormatear = false;
  }

  public newCampeon(form, documentId = this.documentId) {
    console.log(`Status: ${this.currentStatus}`);
    if (this.currentStatus == 1) {
      //CREACION DE DOCUMENTOS
      let data = {
        //datos del formulario
        nombre: form.nombre,
        url: form.url,
        aspectos: []
      };
      this._campeonService.createCampeon(data).then(
        () => {
          console.log("Documento creado exitósamente!");
          this.newCampeonForm.setValue({
            nombre: "",
            url: "",
            id: ""
          });
        },
        error => {
          console.error(error);
        }
      );
    } else {
      //EDICION DE DOCUMENTOS
      let data = {
        nombre: form.nombre,
        url: form.url
      };
      this._campeonService.updateCampeon(documentId, data).then(
        () => {
          this.currentStatus = 1;
          this.newCampeonForm.setValue({
            nombre: "",
            url: "",
            id: ""
          });
          console.log("Documento editado exitósamente");
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  public editCampeon(documentId) {
    let editSubscribe = this._campeonService
      .getCampeon(documentId)
      .subscribe(campeon => {
        this.currentStatus = 2;
        this.documentId = documentId;
        this.newCampeonForm.setValue({
          id: documentId,
          nombre: campeon.payload.data()["nombre"],
          url: campeon.payload.data()["url"]
        });
        editSubscribe.unsubscribe();
      });
  }

  public deleteCampeon(documentId) {
    console.log("se eliminara el doc_id: ", documentId);
    this._campeonService.deleteCampeon(documentId).then(
      () => {
        console.log("Documento eliminado!");
      },
      error => {
        console.error(error);
      }
    );
  }

  //FIN METODOS UTILES

  ngOnInit_antiguo() {
    //carga IDs y nombres de los campeones
    this.cargaID_Nombres();

    //cargar datos de aatrox
    //this.cargaAatrox(this.aspectos_de_aatrox);

    //cargar aspectos
    this.cargaAspectos(this.listado_aspectos);

    //funcion de prueba
    /*this.nuevoAspecto(
      "Sin imagen",
      "Hugo Odisea",
      "Epica",
      1350,
      false,
      false,
      false,
      false,
      0
    );*/
  }

  cargaID_Nombres() {
    console.log("length: ", this.listado_nombres.length);
    for (let i = 0; i < this.listado_nombres.length; i++) {
      //cada campeon del array recibe el nombre del listado y el nuevo array de Aspectos
      //console.log("name: ", this.listado[i]);
      let id_temp: number = i + 1;
      let nombre_aspecto_temp: string = this.listado_nombres[i];
      let aspectos_temp: [] = [];
      this.campeones[i] = new Campeon(
        id_temp,
        nombre_aspecto_temp,
        aspectos_temp
      );
      /*if (i < 2) {
        console.log(
          "this.campeones[" + i + "]:",
          this.campeones[i],
          "id: ",
          this.campeones[i].id,
          "nombre: ",
          this.campeones[i].nombre,
          "aspecto: ",
          this.campeones[i].aspectos
        );
      }*/
    }
  }

  cargaAatrox(skinsAA: any) {
    //EL ID DE AATROX ES 1 PERO SU UBICACION EN EL ARREGLO DE CAMPEONES ES 0, ADEMAS EL ID DE SU NOMBRE EN CADA ASPECTO TAMBIEN ES 1
    let id_aatrox = skinsAA[0].idc - 1;
    let cant_aspectos_aatrox = skinsAA.length;
    //recorrer los N aspectos de aatrox
    console.log("skinsAA.length: ", cant_aspectos_aatrox);
    for (let i = 0; i < cant_aspectos_aatrox; i++) {
      //asignar cada atributo del aspecto al nuevo aspecto
      let nasp = new Aspecto();
      /*skinsAA[i].i,
        skinsAA[i].na,
        skinsAA[i].t,
        skinsAA[i].p,
        skinsAA[i].l,
        skinsAA[i].o,
        skinsAA[i].po,
        skinsAA[i].b,
        skinsAA[i].idc*/
      //console.log("array: ", this.campeones[id_aatrox].aspectos);
      //añade Aspecto al array de aspectos del i-esimo campeon
      this.campeones[id_aatrox].aspectos[i] = nasp;
      //console.log("cada aspecto: ", nasp);
    }
    //console.log("array fuera for: ", this.campeones[id_aatrox].aspectos);
  }

  cargaAspectos(allSkins: any) {
    //el total de aspectos en el array allSkins es el tope de iteraciones
    let total_aspectos = allSkins.length;
    console.log("allSkins.length: ", total_aspectos);
    //recorrer todos los aspectos del arreglo
    for (let i = 0; i < total_aspectos; i++) {
      //se crea un Aspecto cuyos atributos vienen del array de aspectos
      let nasp = new Aspecto();
      /*allSkins[i].i,
        allSkins[i].na,
        allSkins[i].t,
        allSkins[i].p,
        allSkins[i].l,
        allSkins[i].o,
        allSkins[i].po,
        allSkins[i].b,
        allSkins[i].idc*/
      //console.log("cada aspecto: ", nasp);
      //el ID de cada campeon es correlativo a partir de 1, pero
      //la ubicacion del campeon en el array Campeones es ID-1
      //ademas, cada aspecto posee el ID del campeon pero que no es su posicion en el array Campeones
      let index_champ = allSkins[i].idc - 1;

      //estos IF actualizan los contadores de Obtenible, Posesion y Botin de cada aspecto del campeon
      if (allSkins[i].o) {
        this.campeones[index_champ].cont_obtenible++;
        this.total_obtenibles++;
      }
      if (allSkins[i].po) {
        this.campeones[index_champ].cont_posesion++;
        this.total_posesion++;
      }
      if (allSkins[i].b) {
        this.campeones[index_champ].cont_botin++;
        this.total_botin++;
      }
      //console.log("array (se espera vacio): ", this.campeones[index_champ].aspectos);
      //añade el i-esimo Aspecto del json al array de aspectos del Campeon
      this.campeones[index_champ].aspectos.push(nasp); //se evita usar el .size() para conocer el tamaño actual
    }
    //console.log("array fuera for: ", this.campeones[index_champ].aspectos);
  }

  //funcion de prueba
  nuevoAspecto(i, na, t, p, l, o, po, b, idc) {
    //nuevo aspecto
    let nuevoAspecto: Aspecto = new Aspecto(/*i, na, t, p, l, o, po, b, idc*/);
    //se añade al array de aspectos (que ya existe para cada campeon)
    let nuevosAspectos: Array<Aspecto> = [];
    //nuevosAspectos[0] = nuevoAspecto;
    nuevosAspectos.push(nuevoAspecto);
    //se agrega el nuevo array al nuevo campeon (que ya existe)
    let nuevoCampeon: Campeon = new Campeon(-1, "Hugo", nuevosAspectos);
    //console.log("nuevoCampeon:", nuevoCampeon);
  }

  /*cargaID_Nombres() {
    console.log("length: ", this.listado_nombres.length);
    for (let i = 0; i < this.listado_nombres.length; i++) {
      //cada campeon del array recibe el nombre del listado y el nuevo array de Aspectos
      //console.log("name: ", this.listado[i]);
      let id_temp: number = i + 1;
      let nombre_aspecto_temp: string = this.listado_nombres[i];
      let aspectos_temp: Aspecto[] = [];
      this.campeones[i] = new Campeon(
        id_temp,
        nombre_aspecto_temp,
        aspectos_temp
      );
      /*if (i < 2) {
        console.log(
          "this.campeones[" + i + "]:",
          this.campeones[i],
          "id: ",
          this.campeones[i].id,
          "nombre: ",
          this.campeones[i].nombre,
          "aspecto: ",
          this.campeones[i].aspectos
        );
      }*/
  /*}
  }*/
}
