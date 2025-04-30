import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiBaseUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) { }

    /**
     * Creates a new client/beneficiary
     * @param formData The client/beneficiary data as FormData
     * @returns Observable with the response
     */
    createClientBeneficiary(formData: FormData): Observable<any> {
        return this.http.post(`${this.apiBaseUrl}/api/ClientBeneficiary/CreateClientBeneficiary`, formData);
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
        return this.http.get(`${this.apiBaseUrl}/api/Transaction/GetAllTransactions`);
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