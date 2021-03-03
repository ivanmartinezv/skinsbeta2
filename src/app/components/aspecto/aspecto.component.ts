import { Component } from "@angular/core";

import {
  aspectos_aatrox,
  LISTADO_CAMPEONES,
  LISTADO_ASPECTOS
} from "../../models/listado.global";

@Component({
  selector: "app-aspecto",
  templateUrl:
    "./aspecto.component.html" /*,
  styleUrls: ["./aspectos.component.css"]*/
})
export class AspectoComponent {
  public titulo_0 = "Titulo del app-aspecto";
  public titulo = "Listado de Aspectos";

  //https://es.stackoverflow.com/questions/229721/angular-firebase-comparar-ids-de-colecciones-distintas-y-si-es-igual-mostrar?rq=1

  //hay que leer los aspectos de la constante --> LISTADO_ASPECTOS
  public skin_aatrox: {
    na: string;
    t: string;
    p: number;
    o: boolean;
    po: boolean;
    b: boolean;
    idc: number;
  }[] = aspectos_aatrox;
  public total_aspectos_aatrox: number = aspectos_aatrox.length; //tiene 7
}
