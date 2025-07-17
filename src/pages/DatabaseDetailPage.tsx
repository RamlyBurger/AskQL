import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Database, Table, TableFormData, Attribute } from '../services/DatabaseService';
import { DatabaseService } from '../services/DatabaseService';
import InsertDataModal from '../components/InsertDataModal';
import TableDataView from '../components/TableDataView';

interface TableForm extends TableFormData {
    id?: number;
}

const DatabaseDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [database, setDatabase] = useState<Database | null>(null);
    const [expandedTables, setExpandedTables] = useState<number[]>([]);
    const [isCreateTableModalOpen, setIsCreateTableModalOpen] = useState(false);
    const [isEditTableModalOpen, setIsEditTableModalOpen] = useState(false);
    const [isInsertDataModalOpen, setIsInsertDataModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<TableForm>({
        name: '',
        description: '',
        attributes: []
    });
    const [error, setError] = useState<string | null>(null);

    // Add data type options
    const dataTypeOptions = [
        'INTEGER',
        'BIGINT',
        'DECIMAL',
        'NUMERIC',
        'REAL',
        'DOUBLE PRECISION',
        'SMALLINT',
        'VARCHAR(255)',
        'TEXT',
        'CHAR(1)',
        'BOOLEAN',
        'DATE',
        'TIME',
        'TIMESTAMP',
        'JSON',
        'JSONB',
        'UUID'
    ];

    useEffect(() => {
        fetchDatabaseDetails();
    }, [id]);

    const fetchDatabaseDetails = async () => {
        try {
            if (!id) return;
            setIsLoading(true);
            const data = await DatabaseService.getDatabaseById(id);
            setDatabase(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching database details:', err);
            setError('Failed to load database details');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTableExpansion = (tableId: number) => {
        setExpandedTables(prev =>
            prev.includes(tableId)
                ? prev.filter(id => id !== tableId)
                : [...prev, tableId]
        );
    };

    const handleCreateTable = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        try {
            setIsLoading(true);
            await DatabaseService.createTable(id, formData);
            await fetchDatabaseDetails();
            setIsCreateTableModalOpen(false);
            setFormData({
                name: '',
                description: '',
                attributes: []
            });
            setError(null);
        } catch (err) {
            console.error('Error creating table:', err);
            setError('Failed to create table');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditTable = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTable) return;

        try {
            setIsLoading(true);
            await DatabaseService.updateTable(selectedTable.id, formData);
            await fetchDatabaseDetails();
            setIsEditTableModalOpen(false);
            setSelectedTable(null);
            setFormData({
                name: '',
                description: '',
                attributes: []
            });
            setError(null);
        } catch (err) {
            console.error('Error updating table:', err);
            setError('Failed to update table');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTable = async (tableId: number) => {
        if (!window.confirm('Are you sure you want to delete this table?')) {
            return;
        }

        try {
            setIsLoading(true);
            await DatabaseService.deleteTable(tableId);
            await fetchDatabaseDetails();
            setError(null);
        } catch (err) {
            console.error('Error deleting table:', err);
            setError('Failed to delete table');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddAttribute = () => {
        setFormData(prev => ({
            ...prev,
            attributes: [
                ...prev.attributes,
                {
                    name: '',
                    data_type: 'VARCHAR(255)',
                    is_nullable: false,
                    is_primary_key: false,
                    is_foreign_key: false
                }
            ]
        }));
    };

    const handleRemoveAttribute = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attributes: prev.attributes.filter((_, i) => i !== index)
        }));
    };

    const handleAttributeChange = (index: number, field: keyof TableForm['attributes'][0], value: any) => {
        setFormData(prev => ({
            ...prev,
            attributes: prev.attributes.map((attr, i) =>
                i === index ? { ...attr, [field]: value } : attr
            )
        }));
    };

    const handleInsertData = async (data: Record<string, any>) => {
        if (!selectedTable) return;
        
        try {
            setIsLoading(true);
            // TODO: Implement the API call to insert data
            await DatabaseService.insertTableData(selectedTable.id, data);
            setError(null);
        } catch (err) {
            console.error('Error inserting data:', err);
            setError('Failed to insert data');
            throw err; // Re-throw to let the modal handle the error state
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !database) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (error && !database) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
                    <button
                        onClick={fetchDatabaseDetails}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!database) {
        return null;
    }

    return (
        <main className="container mx-auto px-4 py-8 mt-16">
            {/* Header Section */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/database')}
                    className="mb-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Back to Databases
                </button>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{database.name}</h1>
                        <p className="text-gray-600 dark:text-gray-300">{database.description}</p>
                    </div>
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 py-1 px-3 rounded-full">
                        {database.database_type}
                    </span>
                </div>
            </div>

            {/* Tables Section */}
            <section className="mb-12">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tables</h2>
                        <button
                            onClick={() => setIsCreateTableModalOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200"
                        >
                            <i className="fas fa-plus mr-2"></i>New Table
                        </button>
                    </div>

                    {/* Table List */}
                    <div className="space-y-4">
                        {database.tables.map(table => (
                            <div
                                key={table.id}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                            >
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {table.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {table.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedTable(table);
                                                setIsInsertDataModalOpen(true);
                                            }}
                                            className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 p-2 rounded"
                                            title="Insert Data"
                                        >
                                            <i className="fas fa-plus-circle"></i>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedTable(table);
                                                setFormData({
                                                    id: table.id,
                                                    name: table.name,
                                                    description: table.description,
                                                    attributes: table.attributes.map(attr => ({
                                                        name: attr.name,
                                                        data_type: attr.data_type,
                                                        is_nullable: attr.is_nullable,
                                                        is_primary_key: attr.is_primary_key,
                                                        is_foreign_key: attr.is_foreign_key
                                                    }))
                                                });
                                                setIsEditTableModalOpen(true);
                                            }}
                                            className="text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 p-2 rounded"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTable(table.id)}
                                            className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 p-2 rounded"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                        <button
                                            onClick={() => toggleTableExpansion(table.id)}
                                            className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded"
                                        >
                                            <i className={`fas fa-chevron-${expandedTables.includes(table.id) ? 'up' : 'down'}`}></i>
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Attributes Section */}
                                {expandedTables.includes(table.id) && (
                                    <div className="p-4 space-y-6">
                                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                Table Structure
                                            </h4>
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="text-left">
                                                        <th className="pb-2 text-gray-600 dark:text-gray-400">Name</th>
                                                        <th className="pb-2 text-gray-600 dark:text-gray-400">Data Type</th>
                                                        <th className="pb-2 text-gray-600 dark:text-gray-400">Nullable</th>
                                                        <th className="pb-2 text-gray-600 dark:text-gray-400">Key Type</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {table.attributes.map(attr => (
                                                        <tr key={attr.id} className="border-t border-gray-100 dark:border-gray-700">
                                                            <td className="py-2 text-gray-900 dark:text-white">{attr.name}</td>
                                                            <td className="py-2 text-gray-900 dark:text-white">{attr.data_type}</td>
                                                            <td className="py-2">
                                                                {attr.is_nullable ? (
                                                                    <span className="text-green-600 dark:text-green-400">Yes</span>
                                                                ) : (
                                                                    <span className="text-rose-600 dark:text-rose-400">No</span>
                                                                )}
                                                            </td>
                                                            <td className="py-2">
                                                                {attr.is_primary_key ? (
                                                                    <span className="text-blue-600 dark:text-blue-400">Primary Key</span>
                                                                ) : attr.is_foreign_key ? (
                                                                    <span className="text-purple-600 dark:text-purple-400">Foreign Key</span>
                                                                ) : (
                                                                    <span className="text-gray-400">-</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                Table Data
                                            </h4>
                                            <TableDataView
                                                table={table}
                                                onError={setError}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {database.tables.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-500 dark:text-gray-400 mb-4">No tables created yet</p>
                                <button
                                    onClick={() => setIsCreateTableModalOpen(true)}
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Create your first table
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Create/Edit Table Modal */}
            {(isCreateTableModalOpen || isEditTableModalOpen) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-2xl w-full mx-4">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            {isEditTableModalOpen ? 'Edit Table' : 'Create New Table'}
                        </h3>
                        <form onSubmit={isEditTableModalOpen ? handleEditTable : handleCreateTable}>
                            <div className="space-y-6">
                                {/* Table Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Table Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Enter table name"
                                        required
                                    />
                                </div>

                                {/* Table Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Enter table description"
                                    />
                                </div>

                                {/* Attributes Section */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Attributes
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleAddAttribute}
                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500"
                                        >
                                            <i className="fas fa-plus mr-1"></i>
                                            Add Attribute
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {formData.attributes.map((attr, index) => (
                                            <div key={index} className="flex items-center space-x-4">
                                                <input
                                                    type="text"
                                                    value={attr.name}
                                                    onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    placeholder="Attribute name"
                                                    required
                                                />
                                                <select
                                                    value={attr.data_type}
                                                    onChange={(e) => handleAttributeChange(index, 'data_type', e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    required
                                                >
                                                    <option value="">Select Data Type</option>
                                                    {dataTypeOptions.map((type) => (
                                                        <option key={type} value={type}>
                                                            {type}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="flex items-center space-x-4">
                                                    <label className="text-sm text-gray-600 dark:text-gray-400">
                                                        <input
                                                            type="checkbox"
                                                            checked={attr.is_nullable}
                                                            onChange={(e) => handleAttributeChange(index, 'is_nullable', e.target.checked)}
                                                            className="mr-2"
                                                        />
                                                        Nullable
                                                    </label>
                                                    <label className="text-sm text-gray-600 dark:text-gray-400">
                                                        <input
                                                            type="checkbox"
                                                            checked={attr.is_primary_key}
                                                            onChange={(e) => handleAttributeChange(index, 'is_primary_key', e.target.checked)}
                                                            className="mr-2"
                                                        />
                                                        Primary Key
                                                    </label>
                                                    <label className="text-sm text-gray-600 dark:text-gray-400">
                                                        <input
                                                            type="checkbox"
                                                            checked={attr.is_foreign_key}
                                                            onChange={(e) => handleAttributeChange(index, 'is_foreign_key', e.target.checked)}
                                                            className="mr-2"
                                                        />
                                                        Foreign Key
                                                    </label>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveAttribute(index)}
                                                    className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-500"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-rose-600 dark:text-rose-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCreateTableModalOpen(false);
                                            setIsEditTableModalOpen(false);
                                            setSelectedTable(null);
                                            setFormData({
                                                name: '',
                                                description: '',
                                                attributes: []
                                            });
                                            setError(null);
                                        }}
                                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    >
                                        {isLoading ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin mr-2"></i>
                                                {isEditTableModalOpen ? 'Updating...' : 'Creating...'}
                                            </>
                                        ) : (
                                            isEditTableModalOpen ? 'Update Table' : 'Create Table'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Insert Data Modal */}
            {isInsertDataModalOpen && selectedTable && (
                <InsertDataModal
                    table={selectedTable}
                    isOpen={isInsertDataModalOpen}
                    onClose={() => {
                        setIsInsertDataModalOpen(false);
                        setSelectedTable(null);
                    }}
                    onSubmit={handleInsertData}
                />
            )}
        </main>
    );
};

export default DatabaseDetailPage; 