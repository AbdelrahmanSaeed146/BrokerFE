import { Routes } from '@angular/router';
import { ClientBeneficiaryFormComponent } from './components/client-beneficiary-form/client-beneficiary-form.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';

export const routes: Routes = [
    { path: '', redirectTo: 'client-beneficiary', pathMatch: 'full' },
    { path: 'client-beneficiary', component: ClientBeneficiaryFormComponent, title: 'Manage Entities | PDF Wizard' },
    { path: 'transaction', component: TransactionFormComponent, title: 'Generate PDF | PDF Wizard' },
    { path: '**', redirectTo: 'client-beneficiary' }
];
