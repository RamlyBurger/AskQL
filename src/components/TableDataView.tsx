import { useEffect, useState } from 'react';
import type { Table, TableData, TableDataPagination } from '../services/DatabaseService';
import { DatabaseService } from '../services/DatabaseService';

interface TableDataViewProps {
    table: Table;
    onError: (error: string) => void;
}

const TableDataView = ({ table, onError }: TableDataViewProps) => {
    const [tableData, setTableData] = useState<TableDataPagination | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        fetchTableData();
    }, [table.id, page]);

    const fetchTableData = async () => {
        try {
            setIsLoading(true);
            const data = await DatabaseService.getTableData(table.id, page, pageSize);
            setTableData(data);
        } catch (err) {
            console.error('Error fetching table data:', err);
            onError('Failed to load table data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteRow = async (rowId: number) => {
        if (!window.confirm('Are you sure you want to delete this row?')) {
            return;
        }

        try {
            setIsLoading(true);
            await DatabaseService.deleteTableRow(table.id, rowId);
            await fetchTableData(); // Refresh data after deletion
        } catch (err) {
            console.error('Error deleting row:', err);
            onError('Failed to delete row');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAllData = async () => {
        if (!window.confirm('Are you sure you want to delete all data from this table? This action cannot be undone.')) {
            return;
        }

        try {
            setIsLoading(true);
            await DatabaseService.deleteAllTableData(table.id);
            setPage(1); // Reset to first page
            await fetchTableData();
        } catch (err) {
            console.error('Error deleting all data:', err);
            onError('Failed to delete all data');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !tableData) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!tableData?.data.length) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No data available</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleDeleteAllData}
                    className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 px-4 py-2 rounded-lg"
                >
                    <i className="fas fa-trash-alt mr-2"></i>
                    Delete All Data
                </button>
            </div>

            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                    <tr>
                        {table.attributes.map(attr => (
                            <th
                                key={attr.id}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                                {attr.name}
                            </th>
                        ))}
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {tableData.data.map((row: TableData) => (
                        <tr key={row.id}>
                            {table.attributes.map(attr => (
                                <td
                                    key={attr.id}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                                >
                                    {row.data[attr.name]?.toString() || '-'}
                                </td>
                            ))}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                <button
                                    onClick={() => handleDeleteRow(row.id)}
                                    className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 p-2 rounded"
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, tableData.total)} of {tableData.total} results
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={page * pageSize >= tableData.total}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TableDataView; 