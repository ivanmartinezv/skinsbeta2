import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
//importar modulo de formularios
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
//modulos
//import { AppRoutingModule } from "./app-routing.module";
//firebase
import { AngularFireModule } from "@angular/fire";
// if we want to add certain services
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { environment } from "../environments/environment";
//componentes
import { CampeonComponent } from "./components/campeon/campeon.component";
import { AspectoComponent } from "./components/aspecto/aspectos.component";
//servicios para BDD
import { CampeonService } from "./services/campeon.service";
import { AspectoService } from "./services/aspecto.service";
//import { CampeonAddComponent } from "./components/campeon/listacampeonadd.component";

@NgModule({
  declarations: [
    AppComponent,
    //componentes
    CampeonComponent /*,
    CampeonAddComponent*/,
    AspectoComponent
  ],
  imports: [
    BrowserModule,
    //AppRoutingModule, //no está este
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule, //formularios
    ReactiveFormsModule, //formularios
    AngularFirestoreModule
  ],
  providers: [
    //servicios
    CampeonService,
    AspectoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
