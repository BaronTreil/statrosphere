import { DataProviderService } from "./services/data-provider.service";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { WorldMapComponent } from "./world-map/world-map.component";
import { TableComponent } from "./table/table.component";
import { Routes, RouterModule } from "@angular/router";
import { ClickStopPropagationDirective } from "./click-stop-propagation.directive";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { GridStackDirective } from "./directives/grid-stack.directive";
import { GridStackItemDirective } from "./directives/grid-stack-item.directive";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";

const appRoutes: Routes = [
  { path: "dashboard", component: TableComponent },
  { path: "worldmap", component: WorldMapComponent },
  { path: "", redirectTo: "worldmap", pathMatch: "full" },
  { path: "**", redirectTo: "worldmap" }
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes)
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    WorldMapComponent,
    TableComponent,
    ClickStopPropagationDirective,
    GridStackDirective,
    GridStackItemDirective
  ],
  providers: [
    DataProviderService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
