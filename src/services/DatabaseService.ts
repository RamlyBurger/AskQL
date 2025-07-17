import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface Attribute {
    id: number;
    name: string;
    data_type: string;
    is_nullable: boolean;
    is_primary_key: boolean;
    is_foreign_key: boolean;
    table_id: number;
    created_at: string;
    updated_at: string;
}

export interface Table {
    id: number;
    name: string;
    description: string;
    database_id: number;
    attributes: Attribute[];
    created_at: string;
    updated_at: string;
}

export interface Database {
    id: number;
    name: string;
    description: string;
    database_type: string;
    tables: Table[];
    created_at: string;
    updated_at: string;
}

export interface TableFormData {
    name: string;
    description: string;
    attributes: {
        name: string;
        data_type: string;
        is_nullable: boolean;
        is_primary_key: boolean;
        is_foreign_key: boolean;
    }[];
}

export interface TableData {
    id: number;
    table_id: number;
    row_data: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface TableDataPagination {
    data: TableData[];
    total: number;
    page: number;
    pageSize: number;
}

export class DatabaseService {
    static async getDatabaseById(id: string): Promise<Database> {
        const response = await axios.get(`${API_URL}/databases/${id}`);
        return response.data.data;
    }

    static async createTable(databaseId: string, data: TableFormData): Promise<Table> {
        const response = await axios.post(`${API_URL}/tables/database/${databaseId}`, data);
        return response.data.data;
    }

    static async updateTable(tableId: number, data: TableFormData): Promise<Table> {
        const response = await axios.put(`${API_URL}/tables/${tableId}`, data);
        return response.data.data;
    }

    static async deleteTable(tableId: number): Promise<void> {
        await axios.delete(`${API_URL}/tables/${tableId}`);
    }

    static async insertTableData(tableId: number, data: Record<string, any>): Promise<any> {
        try {
            console.log('Sending insert request to:', `${API_URL}/tables/${tableId}/data`);
            console.log('Data:', data);
            
            const response = await axios.post(`${API_URL}/tables/${tableId}/data`, data);
            console.log('Insert response:', response.data);
            
            return response.data.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error('Insert request failed:', {
                    url: `${API_URL}/tables/${tableId}/data`,
                    error: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
            } else {
                console.error('Unknown error:', error);
            }
            throw error;
        }
    }

    static async getAllDatabases(): Promise<Database[]> {
        const response = await fetch(`${API_URL}/databases`);
        if (!response.ok) throw new Error('Failed to fetch databases');
        return response.json();
    }

    static async createDatabase(data: { name: string; description: string; databaseType: string }): Promise<Database> {
        const response = await fetch(`${API_URL}/databases`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create database');
        return response.json();
    }

    static async updateDatabase(id: number, data: { name: string; description: string; databaseType: string }): Promise<Database> {
        const response = await fetch(`${API_URL}/databases/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update database');
        return response.json();
    }

    static async deleteDatabase(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/databases/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete database');
    }

    static async getTableData(tableId: number, page: number = 1, pageSize: number = 10): Promise<TableDataPagination> {
        const response = await fetch(`${API_URL}/tables/${tableId}/data?page=${page}&pageSize=${pageSize}`);
        if (!response.ok) throw new Error('Failed to fetch table data');
        return response.json();
    }

    static async deleteTableRow(tableId: number, rowId: number): Promise<void> {
        const response = await fetch(`${API_URL}/tables/${tableId}/data/${rowId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete table row');
    }

    static async deleteAllTableData(tableId: number): Promise<void> {
        const response = await fetch(`${API_URL}/tables/${tableId}/data`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete all table data');
    }
} 