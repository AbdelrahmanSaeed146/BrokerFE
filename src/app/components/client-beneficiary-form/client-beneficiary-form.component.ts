import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { TranslocoPipe } from '@ngneat/transloco';

@Component({
    selector: 'app-client-beneficiary-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslocoPipe],
    templateUrl: './client-beneficiary-form.component.html',
    styleUrls: ['./client-beneficiary-form.component.scss']
})
export class ClientBeneficiaryFormComponent implements OnInit {
    private destroyRef = inject(DestroyRef);
    clientBeneficiaryForm!: FormGroup;
    submitted = false;
    errorMessage = '';
    successMessage = '';
    loading = false;

    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
        this.clientBeneficiaryForm = this.formBuilder.group({
            Name: ['', Validators.required],
            Address: ['', Validators.required],
            Sector: ['', Validators.required],
            SourceOfFund: ['', Validators.required],
            TypeOfGoods: ['', Validators.required],
            AccountNo: ['', Validators.required, Validators.pattern(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/)],
            BankName: ['', Validators.required],
            BankBranch: ['', Validators.required],
            BankSwiftCode: ['', Validators.required, Validators.pattern(/^[A-Z]{4}[-]{0,1}[A-Z]{2}[-]{0,1}[A-Z0-9]{2}[-]{0,1}[0-9]{3}$/)],
            IsCustomer: [true],
            IsBeneficiary: [false]
        });
    }

    get f() {
        return this.clientBeneficiaryForm.controls;
    }

    onSubmit(): void {
        this.submitted = true;
        this.errorMessage = '';
        this.successMessage = '';

        if (this.clientBeneficiaryForm.invalid) {
            return;
        }

        this.loading = true;
        const formData = new FormData();

        // Add each form field to the FormData object
        Object.keys(this.clientBeneficiaryForm.value).forEach(key => {
            formData.append(key, this.clientBeneficiaryForm.value[key]);
        });

        this.apiService.createClientBeneficiary(formData).subscribe({
            next: (response) => {
                this.loading = false;
                this.successMessage = 'Client/Beneficiary created successfully!';
                this.clientBeneficiaryForm.reset();
                this.submitted = false;
            },
            error: (error) => {
                this.loading = false;
                this.errorMessage = error.message || 'An error occurred. Please try again.';
                console.error('Error creating client/beneficiary:', error);
            }
        });
    }

    nDestroy = this.destroyRef.onDestroy( () => {
        this.clientBeneficiaryForm.reset();
    })
} 