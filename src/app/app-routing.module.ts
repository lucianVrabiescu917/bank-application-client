import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImporterComponent } from './importer/importer.component';
import {BankComponent} from "./bank/bank.component";
import {ExporterComponent} from "./exporter/exporter.component";

const routes: Routes = [
	{ path: 'importer', component: ImporterComponent },
	{ path: 'bank', component: BankComponent },
	{ path: 'exporter', component: ExporterComponent },
	{ path: '', redirectTo: '/importer', pathMatch: 'full' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
