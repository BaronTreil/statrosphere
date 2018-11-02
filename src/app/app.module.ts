import { DataProviderService } from "./services/data-provider.service";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { WorldMapComponent } from "./world-map/world-map.component";
import { TableComponent } from "./table/table.component";
import { Routes, RouterModule } from "@angular/router";
import { ClickStopPropagationDirective } from './click-stop-propagation.directive';

const appRoutes: Routes = [
  { path: "table", component: TableComponent },
  { path: "worldmap", component: WorldMapComponent },
  { path: "", redirectTo: 'worldmap', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WorldMapComponent,
    TableComponent,
    ClickStopPropagationDirective
  ],
  imports: [
    BrowserModule,
     RouterModule.forRoot(appRoutes)],
  providers: [DataProviderService],
  bootstrap: [AppComponent]
})
export class AppModule {}
