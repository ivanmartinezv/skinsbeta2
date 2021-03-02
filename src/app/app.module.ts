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
import { AspectosComponent } from "./components/aspecto/aspecto.component";
//servicios para BDD
import { CampeonService } from "./services/campeon.service";
import { AspectosService } from "./services/aspecto.service";
//import { CampeonAddComponent } from "./components/campeon/listacampeonadd.component";

@NgModule({
  declarations: [
    AppComponent,
    //componentes
    CampeonComponent /*,
    CampeonAddComponent*/,
    AspectosComponent
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
    AspectosService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
