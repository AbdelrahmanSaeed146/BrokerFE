import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiBaseUrl = environment.apiBaseUrl;

    // Pagination state
    currentPage = signal(1);
    pageSize = signal(10);
    totalItems = signal(0);
    totalPages = signal(0);

    constructor(private http: HttpClient) { }

    /**
     * Creates a new client/beneficiary
     * @param formData The client/beneficiary data as FormData
     * @returns Observable with the response
     */
    createClientBeneficiary(formData: FormData): Observable<any> {
        return this.http.post(`${this.apiBaseUrl}/api/ClientBeneficiary/CreateClientBeneficiary`, formData);
    }
    deleteEntity(id: string): Observable<any> {
        return this.http.delete(`${this.apiBaseUrl}/api/ClientBeneficiary/SoftDeleteClientBeneficiary/${id}`);
    }

    /**
     * Edits an existing client/beneficiary
     * @param formData The client/beneficiary data as FormData including Id
     * @returns Observable with the response
     */
    editClientBeneficiary(formData: FormData): Observable<any> {
        return this.http.put(`${this.apiBaseUrl}/api/ClientBeneficiary/EditClientBeneficiary`, formData);
    }

    /**
     * Gets a client by its ID
     * @param id The UUID of the client
     * @returns Observable with the client data
     */
    getClientById(id: string): Observable<any> {
        return this.http.get(`${this.apiBaseUrl}/api/ClientBeneficiary/GetClientById/${id}`);
    }

    /**
     * Gets a beneficiary by its ID
     * @param id The UUID of the beneficiary
     * @returns Observable with the beneficiary data
     */
    getBeneficiaryById(id: string): Observable<any> {
        return this.http.get(`${this.apiBaseUrl}/api/ClientBeneficiary/GetBeneficiaryById/${id}`);
    }

    /**
     * Creates a new transaction and generates PDF
     * @param formData The transaction data as FormData
     * @returns Observable with the response
     */
    createTransaction(formData: FormData): Observable<any> {
        return this.http.post(`${this.apiBaseUrl}/api/Transaction/CreateTransaction`, formData);
    }

    getAllTemplates(): Observable<any> {
        return this.http.get(`${this.apiBaseUrl}/api/Template/GetAllTemplates`);
    }


    getAllTransactions(): Observable<any> {
        return this.http.get(`${this.apiBaseUrl}/api/Transaction/GetPagedTransactions?PageNumber=1&PageSize=10000&SortBy=createdDate&IsDescending=true`);
    }

    getPagedTransactions(pageNumber: number, pageSize: number): Observable<any> {
        return this.http.get(`${this.apiBaseUrl}/api/Transaction/GetPagedTransactions?PageNumber=${pageNumber}&PageSize=${pageSize}&SortBy=createdDate&IsDescending=true`);
    }

    /**
     * Gets all clients with pagination
     * @param pageNumber The page number to retrieve
     * @param pageSize Number of items per page
     * @param sortBy Field to sort by
     * @param isDescending Sort direction
     * @returns Observable with paginated clients
     */
    getPagedClients(pageNumber: number = 1, pageSize: number = 10, sortBy: string = 'id', isDescending: boolean = true): Observable<any> {
        const formData = new FormData();
        formData.append('PageNumber', pageNumber.toString());
        formData.append('PageSize', pageSize.toString());
        formData.append('SortBy', sortBy);
        formData.append('IsDescending', isDescending.toString());
        return this.http.post(`${this.apiBaseUrl}/api/ClientBeneficiary/GetAllClients`, formData);
    }


    /**
     * Gets all beneficiaries with pagination
     * @param pageNumber The page number to retrieve
     * @param pageSize Number of items per page
     * @param sortBy Field to sort by
     * @param isDescending Sort direction
     * @returns Observable with paginated beneficiaries
     */
    getPagedBeneficiaries(pageNumber: number = 1, pageSize: number = 10, sortBy: string = 'id', isDescending: boolean = true): Observable<any> {
        const formData = new FormData();
        formData.append('PageNumber', pageNumber.toString());
        formData.append('PageSize', pageSize.toString());
        formData.append('SortBy', sortBy);
        formData.append('IsDescending', isDescending.toString());
        return this.http.post(`${this.apiBaseUrl}/api/ClientBeneficiary/GetAllBeneficiaries`, formData);
    }

    getAllClients(): Observable<any> {
        const formData = new FormData();
        formData.append('PageNumber', '0');
        formData.append('PageSize', '10000');
        formData.append('SortBy', 'id');
        formData.append('IsDescending', 'true');
        return this.http.post(`${this.apiBaseUrl}/api/ClientBeneficiary/GetAllClients`, formData);
    }

    getAllBeneficiaries(): Observable<any> {
        const formData = new FormData();
        formData.append('PageNumber', '0');
        formData.append('PageSize', '10000');
        formData.append('SortBy', 'id');
        formData.append('IsDescending', 'true');
        return this.http.post(`${this.apiBaseUrl}/api/ClientBeneficiary/GetAllBeneficiaries`, formData);
    }
} 