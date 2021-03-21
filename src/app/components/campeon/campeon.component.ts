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
import { Aspecto } from "../../models/aspecto.model";

//servicios
import { CampeonService } from "../../services/campeon.service";
//import { AspectoService } from "../../services/aspecto.service";

//constantes
import {
  aspectos_aatrox,
  LISTADO_CAMPEONES,
  LISTADO_ASPECTOS,
  LISTADO_IMAGENES
} from "../../models/listado.global";

//CONSTANTE no relacional con todos los datos
import { todosLosCampeones } from "../../models/datos.model";

@Component({
  selector: "app-campeon",
  templateUrl: "./campeon.component.html",
  styleUrls: ["./campeon.component.css"]
})

//COMPONENTE CREADO PARA IMPLEMENTAR UN MODELO NO RELACIONAL DE DATOS
export class CampeonComponent implements OnInit {
  public titulo_0 = "Titulo del app-campeon";
  public titulo = "Listado de Campeones y Aspectos";
  //hay que importar la clase Campeon de "./models/campeon.model";

  //Para mostrar los botones iniciales
  public mostrarEnviar: boolean = true; //siempre se muestra pero se ocultará
  public mostrarFormatear: boolean = false; //siempre se muestra pero se ocultará

  //enviar o borrar datos estaticos (LISTADO_CAMPEONES) a Firebase
  public enviarDatos: boolean = false;
  public borrarDatos: boolean = false;

  //hay que leer los campeones de la constante --> LISTADO_CAMPEONES
  public listado_nombres: any = LISTADO_CAMPEONES;
  public listado_imagenes: any = LISTADO_IMAGENES;
  public total_nombres: number = LISTADO_CAMPEONES.length;
  //array de campeones
  public allCampeones: any = [];

  //(I) Array que contendrá los datos de firebase
  public campeones: any[] = []; //no se usa Campeon[]
  public cant_campeones: number;
  //(II) atributos para editar productos
  public documentId = null;

  public todos_campeones: any[] = todosLosCampeones; //datos.model.ts

  /*La app maneja 2 estados, currentStatus = 0 -> la app se encuentra en modo de creación?? de documentos, ó currentStatus = 1 -> la app se encuentra en modo de edición?? de documentos. */
  public currentStatus = 1;
  public newCampeonForm = new FormGroup({
    nombre: new FormControl("", Validators.required),
    url: new FormControl("", Validators.required),
    id: new FormControl("")
    //al enviar los datos del formulario, hay que agregar los CONTADORES
  });

  //formulario de nuevo aspecto
  public currentStatus_skin = 1;
  public newAspectoForm = new FormGroup({
    nombre: new FormControl("", Validators.required),
    url: new FormControl("", Validators.required),
    id: new FormControl("")
    //al enviar los datos del formulario, hay que modificar los CONTADORES
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

  constructor(
    private _campeonService: CampeonService /*,
    private _aspectoService: AspectoService*/
  ) {
    //funcion con los datos que trae el servicio
    this.newCampeonForm.setValue({
      id: "",
      nombre: "",
      url: ""
    });
    this.newAspectoForm.setValue({
      id: "",
      nombre: "",
      url: ""
    });
  }

  ngOnInit() {
    console.log("ngOnInit()");
    //el ngOnInit es el que invoca al servicio para LEER datos de BDD
    this.lecturaDatosFirebase();

    //formatear la coleccion de campeones en firebase
    //this.formatearBDD();
    //como no hay datos en FB, no hay campeones en la aplicacion
    //this.campeones = [];

    /*console.log("antes de lectura:");
    this.contarCampeones();*/
    /*console.log("despues de lectura:");
    this.contarCampeones();*/
  }

  /*###### FUNCIONES ######*/

  //Funcion que lee los datos de FB y los almacena en la variable campeones[]
  lecturaDatosFirebase() {
    console.log("lecturaDatosFirebase()");
    //en esta llamada al servicio, si no hay datos en firebase
    //entonces this.campeones es undefined
    this._campeonService.getCampeones().subscribe(
      campeonesSnapshot => {
        //inicializa el arreglo de campeones como vacio
        this.campeones = [];
        //itera por cada campeon en firebase
        campeonesSnapshot.forEach((campeonData: any) => {
          //agrega el campeon al arreglo
          this.campeones.push({
            id: campeonData.payload.doc.id, //documentId del documento
            data: campeonData.payload.doc.data() //datos del data
          });
        });
      },
      err => {
        console.log(err);
      }
    );
    if (this.campeones == null) {
      console.log("campeones es null");
      //this.mostrarEnviar = true;
      //this.mostrarFormatear = false;
    } else {
      if (this.campeones.length > 0) {
        console.log("campeones leidos de firebase:", this.campeones.length);
        //this.mostrarEnviar = false;
        //this.mostrarFormatear = true;
      }
    }
  }

  //Este metodo cambia a true el booleano y elimina datos estaticos enviados, pero que se encuentran en this.campeones
  formatearBDD() {
    this.borrarDatos = true;
    console.log("Formateando BDD");
    //no es necesario enviar los campeones, es solo la orden
    //console.log("que estoy enviando al servicio??", this.campeones);
    this._campeonService.formatearBDD(this.campeones);
    this.enviarDatos = false;
    console.log("ya no se eliminan datos.");
    this.lecturaDatosFirebase();
    this.mostrarEnviar = true;
    this.mostrarFormatear = false;
  }

  /*  CODIGO PARA EL GETCAMPEONBYID
    let temp_camp;
    let docid: string = "QNJhFRh9xC5aDEsfRvYD";
    for (let i = 0; i < this.campeones.length; i++) {
      if (this.campeones[i].id == docid) {
        temp_camp = this.campeones[i];
        console.log("campeon encontrado: ", temp_camp);
      }
    }*/

  //(Pre-A) Funcion que cuenta los campeones habidos en firebase
  contarCampeones() {
    this.cant_campeones = this._campeonService.contarCampeones();
    console.log("Cantidad actual de campeones: ", this.cant_campeones);
  }

  //A. Este metodo cambia a true el booleano y envia los datos ESTATICOS a firebase
  enviarDatosBDD() {
    console.log("Cant. estática de campeones: ", this.listado_nombres.length);
    //la primera vez es true
    if (this.enviarDatos) {
      this._campeonService.enviarDatos(
        this.listado_nombres,
        this.listado_imagenes
      );
      this.enviarDatos = false;
      console.log("ya no se envian datos.");
    }
    this.mostrarEnviar = false;
    this.mostrarFormatear = true;
  }

  //CRUD DE CAMPEON
  public newCampeon(form, documentId = this.documentId) {
    console.log(`Status: ${this.currentStatus}`);
    if (this.currentStatus == 1) {
      //CREACION DE DOCUMENTOS
      let data = {
        //datos del formulario
        nombre: <string>form.nombre,
        url: <string>form.url,
        aspectos: {},
        cont_obtenible: 0,
        cont_posesion: 0,
        cont_botin: 0
      };
      this._campeonService.createCampeon(data).then(
        () => {
          console.log("Documento creado exitosamente.");
          //reiniciar formulario
          this.newCampeonForm.setValue({
            nombre: "",
            url: "",
            id: ""
          });
          //si la bdd está vacia y agrego el primer campeon
          this.mostrarEnviar = false; //no deberia enviar
          this.mostrarFormatear = true; //permito formatear
        },
        error => {
          console.error(error);
        }
      );
    } else {
      //EDICION DE DOCUMENTOS (solo implica modificar nombre y/o url)
      let data = {
        nombre: <string>form.nombre,
        url: <string>form.url
      };
      this._campeonService.updateCampeon(documentId, data).then(
        () => {
          this.currentStatus = 1;
          this.newCampeonForm.setValue({
            nombre: "",
            url: "",
            id: ""
          });
          console.log("Documento editado exitosamente.");
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

  //CRUD DE ASPECTO
  public newAspecto(form, documentId = this.documentId) {
    console.log(`Status: ${this.currentStatus_skin}`);
    if (this.currentStatus_skin == 1) {
      //CREACION DE DOCUMENTOS
      let data = {
        //datos del formulario
        nombre: <string>form.nombre,
        url: <string>form.url,
        aspectos: {},
        cont_obtenible: 0,
        cont_posesion: 0,
        cont_botin: 0
      };
      this._campeonService.createCampeon(data).then(
        () => {
          console.log("Documento creado exitosamente.");
          //reiniciar formulario
          this.newCampeonForm.setValue({
            nombre: "",
            url: "",
            id: ""
          });
          //si la bdd está vacia y agrego el primer campeon
          this.mostrarEnviar = false; //no deberia enviar
          this.mostrarFormatear = true; //permito formatear
        },
        error => {
          console.error(error);
        }
      );
    } else {
      //EDICION DE DOCUMENTOS (solo implica modificar nombre y/o url)
      let data = {
        nombre: <string>form.nombre,
        url: <string>form.url
      };
      this._campeonService.updateCampeon(documentId, data).then(
        () => {
          this.currentStatus_skin = 1;
          this.newCampeonForm.setValue({
            nombre: "",
            url: "",
            id: ""
          });
          console.log("Documento editado exitosamente.");
        },
        error => {
          console.log(error);
        }
      );
    }
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
