import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ApiService } from '../../services/api.service';
import { Entity, PagedResult } from '../../models/entity.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-entity-list',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslocoModule, ReactiveFormsModule],
    templateUrl: './entity-list.component.html',
    styleUrls: ['./entity-list.component.scss']
})
export class EntityListComponent implements OnInit {
    clients: Entity[] = [];
    beneficiaries: Entity[] = [];
    activeTab: 'client' | 'beneficiary' = 'client';
    loading = false;
    private translocoService = inject(TranslocoService);
    private toastrService = inject(ToastrService);
    currentLang = toSignal(this.translocoService.langChanges$);
    translateService = inject(TranslocoService);
    Math = Math;
    clientsPage = 1;
    clientsPageSize = 10;
    clientsTotalItems = 0;
    clientsTotalPages = 0;

    beneficiariesPage = 1;
    beneficiariesPageSize = 10;
    beneficiariesTotalItems = 0;
    beneficiariesTotalPages = 0;

    activeEntityId: string | null = null;

    showDeleteModal = false;
    entityToDelete: Entity | null = null;

    constructor(
        private apiService: ApiService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadClients();
        this.loadBeneficiaries();
    }

    loadClients(): void {
        this.loading = true;
        this.apiService.getPagedClients(this.clientsPage, this.clientsPageSize).subscribe({
            next: (response) => {
                this.clients = response.items;
                this.clientsTotalItems = response.totalCount || 0;
                this.clientsTotalPages = response.totalPages || 1;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading clients', error);
                this.loading = false;
            }
        });
    }

    loadBeneficiaries(): void {
        this.loading = true;
        this.apiService.getPagedBeneficiaries(this.beneficiariesPage, this.beneficiariesPageSize).subscribe({
            next: (response) => {
                this.beneficiaries = response.items;
                this.beneficiariesTotalItems = response.totalCount || 0;
                this.beneficiariesTotalPages = response.totalPages || 1;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading beneficiaries', error);
                this.loading = false;
            }
        });
    }

    setActiveTab(tab: 'client' | 'beneficiary'): void {
        this.activeTab = tab;
    }

    changePage(page: number): void {
        if (this.activeTab === 'client') {
            this.clientsPage = page;
            this.loadClients();
        } else {
            this.beneficiariesPage = page;
            this.loadBeneficiaries();
        }
    }

    editEntity(entity: Entity): void {
        const entityType = entity.isCustomer ? 'client' : 'beneficiary';
        this.router.navigate(['/client-beneficiary'], {
            queryParams: {
                id: entity.id,
                type: entityType
            }
        });
    }

    get currentEntities(): Entity[] {
        return this.activeTab === 'client' ? this.clients : this.beneficiaries;
    }

    get currentPage(): number {
        return this.activeTab === 'client' ? this.clientsPage : this.beneficiariesPage;
    }

    get totalPages(): number {
        return this.activeTab === 'client' ? this.clientsTotalPages : this.beneficiariesTotalPages;
    }

    getPageNumbers(): number[] {
        const pages = [];
        for (let i = 1; i <= this.totalPages; i++) {
            pages.push(i);
        }
        return pages;
    }

    toggleActionMenu(entityId: string): void {
        if (this.activeEntityId === entityId) {
            this.activeEntityId = null;
        } else {
            this.activeEntityId = entityId;
        }
    }

    confirmDelete(entity: Entity): void {
        this.entityToDelete = entity;
        this.showDeleteModal = true;
        this.activeEntityId = null;
    }

    cancelDelete(): void {
        this.showDeleteModal = false;
        this.entityToDelete = null;
    }

    deleteEntity(entity: Entity): void {
        this.loading = true;
        this.apiService.deleteEntity(entity.id).subscribe({
            next: () => {
                this.showDeleteModal = false;
                this.entityToDelete = null;

                if (this.activeTab === 'client') {
                    this.loadClients();
                } else {
                    this.loadBeneficiaries();
                }
                this.toastrService.success(this.translateService.translate('MESSAGES.SUCCESS.ENTITY_DELETED'));
            },
            error: (error) => {
                console.error('Error deleting entity', error);
                this.loading = false;
                this.showDeleteModal = false;
                this.entityToDelete = null;
            }
        });
    }
} 