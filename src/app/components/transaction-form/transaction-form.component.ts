import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { TranslocoPipe } from '@ngneat/transloco';

@Component({
    selector: 'app-transaction-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslocoPipe],
    templateUrl: './transaction-form.component.html',
    styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit {
    transactionForm!: FormGroup;
    submitted = false;
    errorMessage = '';
    successMessage = '';
    loading = false;

    // UUID Regex pattern for validation
    uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
        this.transactionForm = this.formBuilder.group({
            ClientId: ['', [Validators.required, Validators.pattern(this.uuidPattern)]],
            BeneficiaryId: ['', [Validators.required, Validators.pattern(this.uuidPattern)]],
            TemplateId: ['', [Validators.required, Validators.pattern(this.uuidPattern)]],
            Amount: ['', [Validators.required, Validators.min(0)]],
            Currency: ['', Validators.required],
            PurposeOfTransfer: [''],
            SourceOfFund: [''],
            TypeOfGoods: ['']
        });
    }

    get f() {
        return this.transactionForm.controls;
    }

    onSubmit(): void {
        this.submitted = true;
        this.errorMessage = '';
        this.successMessage = '';

        if (this.transactionForm.invalid) {
            return;
        }

        this.loading = true;
        const formData = new FormData();

        // Add each form field to the FormData object
        Object.keys(this.transactionForm.value).forEach(key => {
            formData.append(key, this.transactionForm.value[key]);
        });

        this.apiService.createTransaction(formData).subscribe({
            next: (response) => {
                this.loading = false;
                this.successMessage = 'Transaction created successfully! PDF has been generated.';
                this.transactionForm.reset();
                this.submitted = false;
            },
            error: (error) => {
                this.loading = false;
                this.errorMessage = error.message || 'An error occurred. Please try again.';
                console.error('Error creating transaction:', error);
            }
        });
    }
} 