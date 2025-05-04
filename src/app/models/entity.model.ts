export interface Entity {
    id: string;
    name: string;
    address: string;
    sector: string;
    sourceOfFund: string;
    typeOfGoods: string;
    accountNo: string;
    bankName: string;
    bankBranch: string;
    bankSwiftCode: string;
    isCustomer: boolean;
    isBeneficiary: boolean;
}

export interface PagedResult<T> {
    items: T[];
    pageNumber?: number;
    pageSize?: number;
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
    totalCount?: number;
} 