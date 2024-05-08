import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ImporterComponent } from './importer/importer.component';
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import { BankComponent } from './bank/bank.component';
import { ExporterComponent } from './exporter/exporter.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { GlobalErrorComponent } from './global-error/global-error.component';
import { TransactionFormComponent } from './shared/transaction-form/transaction-form.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [
    AppComponent,
    ImporterComponent,
    BankComponent,
    ExporterComponent,
    GlobalErrorComponent,
    TransactionFormComponent,
  ],
  providers: [GlobalErrorComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
