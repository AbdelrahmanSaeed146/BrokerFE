import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-transaction-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslocoPipe],
    templateUrl: './transaction-form.component.html',
    styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit {
    private destroyRef = inject(DestroyRef);
    private translocoService = inject(TranslocoService);
    currentLang = toSignal(this.translocoService.langChanges$);

    transactionForm!: FormGroup;
    submitted = false;
    errorMessage = '';
    successMessage = '';
    loading = false;
    clients = signal<any>([])
    beneficiaries = signal<any>([])
    templates = signal<any>([])
    private toastrService = inject(ToastrService);
    translateService = inject(TranslocoService);

    uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.getClients();
        this.getBeneficiaries();
        this.getTemplates();
    }

    initForm(): void {
        this.transactionForm = this.formBuilder.group({
            ClientId: ['', [Validators.required]],
            BeneficiaryId: ['', [Validators.required]],
            TemplateId: ['', [Validators.required]],
            Amount: ['', [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]*$/)]],
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

        Object.keys(this.transactionForm.value).forEach(key => {
            formData.append(key, this.transactionForm.value[key]);
        });

        this.apiService.createTransaction(formData).subscribe({
            next: (response) => {
                this.loading = false;
                this.successMessage = 'Transaction created successfully! PDF has been generated.';
                this.transactionForm.reset();
                this.submitted = false;
                window.open(response.value.filePath, '_blank');
                this.toastrService.success(this.translateService.translate('MESSAGES.SUCCESS.TRANSACTION_CREATED'));
            }
        });
    }

    getClients(): void {
        this.apiService.getAllClients().subscribe({
            next: (response) => {
                this.clients.set(response.items)
            }
        });
    }
    getBeneficiaries(): void {
        this.apiService.getAllBeneficiaries().subscribe({
            next: (response) => {
                this.beneficiaries.set(response.items)
            }
        });
    }
    getTemplates(): void {
        this.apiService.getAllTemplates().subscribe({
            next: (response) => {
                this.templates.set(response)
            },
            error: (error) => {
                console.error('Error fetching clients:', error);
            }
        });
    }

    nDestroy = this.destroyRef.onDestroy(() => {
        this.transactionForm.reset();
    })
    currencies = [
        { code: 'USD', nameEn: 'US Dollar', nameAr: 'دولار أمريكي' },
        { code: 'EUR', nameEn: 'Euro', nameAr: 'يورو' },
        { code: 'EGP', nameEn: 'Egyptian Pound', nameAr: 'جنيه مصري' },
        { code: 'GBP', nameEn: 'British Pound', nameAr: 'جنيه إسترليني' },
        { code: 'AUD', nameEn: 'Australian Dollar', nameAr: 'دولار أسترالي' },
        { code: 'CAD', nameEn: 'Canadian Dollar', nameAr: 'دولار كندي' },
        { code: 'CHF', nameEn: 'Swiss Franc', nameAr: 'فرنك سويسري' },
        { code: 'CNY', nameEn: 'Chinese Yuan', nameAr: 'يوان صيني' },
    ];
}