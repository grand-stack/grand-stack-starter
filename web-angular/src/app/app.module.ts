import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { GraphQLModule } from './graphql/graphql.module';
import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BusinessesComponent } from './businesses/businesses.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    BusinessesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule,
    GraphQLModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
