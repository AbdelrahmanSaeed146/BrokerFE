import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
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
    private destroyRef = inject(DestroyRef);
    transactionForm!: FormGroup;
    submitted = false;
    errorMessage = '';
    successMessage = '';
    loading = false;
    clients = signal<any>([])
    beneficiaries = signal<any>([])
    templates = signal<any>([])

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
            ClientId: ['', [Validators.required]],
            BeneficiaryId: ['', [Validators.required]],
            TemplateId: ['', [Validators.required]],
            Amount: ['', [Validators.required, Validators.min(0)]],
            Currency: ['', Validators.required],
            PurposeOfTransfer: ['', Validators.required],
            SourceOfFund: ['', Validators.required],
            TypeOfGoods: ['', Validators.required]
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
                window.open(response.value.filePath, '_blank'); // Open the PDF in a new tab
            },
            error: (error) => {
                this.loading = false;
                this.errorMessage = error.message || 'An error occurred. Please try again.';
                console.error('Error creating transaction:', error);
            }
        });
    }

    getClients(): void {
        this.apiService.getAllClients().subscribe({
            next: (response) => {
                // Handle the response as needed
                this.clients.set(response.items)
            },
            error: (error) => {
                console.error('Error fetching clients:', error);
            }
        });
    }
    getBeneficiaries(): void {
        this.apiService.getAllBeneficiaries().subscribe({
            next: (response) => {
                // Handle the response as needed
                this.beneficiaries.set(response.items)
            },
            error: (error) => {
                console.error('Error fetching clients:', error);
            }
        });
    }
    getTemplates(): void {
        this.apiService.getAllTemplates().subscribe({
            next: (response) => {
                // Handle the response as needed
                this.templates.set(response)
            },
            error: (error) => {
                console.error('Error fetching clients:', error);
            }
        });
    }
    
    nDestroy = this.destroyRef.onDestroy( () => {
        this.transactionForm.reset();
    })
} 