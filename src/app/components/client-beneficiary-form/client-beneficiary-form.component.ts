import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Entity } from '../../models/entity.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-client-beneficiary-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslocoModule, RouterModule],
    templateUrl: './client-beneficiary-form.component.html',
    styleUrls: ['./client-beneficiary-form.component.scss']
})
export class ClientBeneficiaryFormComponent implements OnInit {
    clientBeneficiaryForm!: FormGroup;
    submitted = false;
    loading = false;
    successMessage = '';
    errorMessage = '';
    private toastrService = inject(ToastrService);
    translateService = inject(TranslocoService);

    isEditMode = false;
    entityId: string | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.initializeForm();
        this.checkForEditMode();
    }

    initializeForm(): void {
        this.clientBeneficiaryForm = this.formBuilder.group({
            Id: [''],
            Name: ['', Validators.required],
            Address: ['', Validators.required],
            Sector: ['', Validators.required],
            // SourceOfFund: ['', Validators.required],
            // TypeOfGoods: ['', Validators.required],
            AccountNo: ['', Validators.required],
            BankName: ['', Validators.required],
            BankBranch: ['', Validators.required],
            BankSwiftCode: ['', Validators.required],
            IsCustomer: [true],
            IsBeneficiary: [false]
        });
    }

    checkForEditMode(): void {
        this.route.queryParams.subscribe(params => {
            this.entityId = params['id'];
            if (this.entityId) {
                this.isEditMode = true;
                this.loadEntityData(this.entityId);
            }
        });
    }

    loadEntityData(id: string): void {
        this.loading = true;

        this.route.queryParams.subscribe(params => {
            const type = params['type'];
            if (type === 'client') {
                this.apiService.getClientById(id).subscribe({
                    next: (data: Entity) => this.patchFormWithData(data),
                    error: (error) => {
                        console.error('Error loading client data', error);
                        this.errorMessage = 'Error loading client data';
                        this.loading = false;
                    }
                });
            } else if (type === 'beneficiary') {
                this.apiService.getBeneficiaryById(id).subscribe({
                    next: (data: Entity) => this.patchFormWithData(data),
                    error: (error) => {
                        console.error('Error loading beneficiary data', error);
                        this.errorMessage = 'Error loading beneficiary data';
                        this.loading = false;
                    }
                });
            }
        });
    }

    patchFormWithData(data: Entity): void {
        this.clientBeneficiaryForm.patchValue({
            Id: data.id,
            Name: data.name,
            Address: data.address,
            Sector: data.sector,
            // SourceOfFund: data.sourceOfFund,
            // TypeOfGoods: data.typeOfGoods,
            AccountNo: data.accountNo,
            BankName: data.bankName,
            BankBranch: data.bankBranch,
            BankSwiftCode: data.bankSwiftCode,
            IsCustomer: data.isCustomer,
            IsBeneficiary: data.isBeneficiary
        });
        this.loading = false;
    }

    onSubmit(): void {
        this.submitted = true;
        this.successMessage = '';
        this.errorMessage = '';

        if (this.clientBeneficiaryForm.valid) {
            this.loading = true;

            const formData = new FormData();

            Object.keys(this.clientBeneficiaryForm.controls).forEach(key => {
                const control = this.clientBeneficiaryForm.get(key);
                if (control) {
                    const value = control.value;
                    formData.append(key, typeof value === 'boolean' ? value.toString() : value);
                }
            });

            if (this.isEditMode) {
                this.apiService.editClientBeneficiary(formData).subscribe({
                    next: () => {

                        this.loading = false;
                        this.successMessage = 'MESSAGES.SUCCESS.ENTITY_UPDATED';
                        this.toastrService.success(this.translateService.translate('MESSAGES.SUCCESS.ENTITY_UPDATED'));
                        setTimeout(() => {
                            this.router.navigate(['/entity-management']);
                        }, 1000);

                    }
                });
            } else {
                this.apiService.createClientBeneficiary(formData).subscribe({
                    next: () => {
                        this.loading = false;
                        this.successMessage = 'MESSAGES.SUCCESS.ENTITY_CREATED';
                        this.toastrService.success(this.translateService.translate('MESSAGES.SUCCESS.ENTITY_CREATED'));
                        this.resetForm();
                        setTimeout(() => {
                            this.router.navigate(['/entity-management']);
                        }, 1000);
                    }

                });
            }
        }
    }

    resetForm(): void {
        this.clientBeneficiaryForm.reset();
        this.clientBeneficiaryForm.patchValue({
            IsCustomer: false,
            IsBeneficiary: false
        });
        this.submitted = false;
    }

    get f() {
        return this.clientBeneficiaryForm.controls;
    }
} 