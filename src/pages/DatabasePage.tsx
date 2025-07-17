import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Database {
    id: number;
    name: string;
    description: string;
    database_type: string;
    tables: { id: number }[];
    created_at: string;
    updated_at: string;
}

interface DatabaseFormData {
    name: string;
    description: string;
    database_type: string;
}

const API_URL = 'http://localhost:3000/api';

const DatabasePage = () => {
    const navigate = useNavigate();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [databases, setDatabases] = useState<Database[]>([]);
    const [selectedDatabase, setSelectedDatabase] = useState<Database | null>(null);
    const [formData, setFormData] = useState<DatabaseFormData>({
        name: '',
        description: '',
        database_type: 'postgresql'
    });

    useEffect(() => {
        // Initialize AOS
        const AOS = (window as any).AOS;
        AOS?.init({
            duration: 800,
            once: true
        });

        // Fetch databases
        fetchDatabases();
    }, []);

    const fetchDatabases = async () => {
        try {
            const response = await fetch(`${API_URL}/databases`);
            const data = await response.json();
            if (data.success) {
                setDatabases(data.data);
            }
        } catch (error) {
            console.error('Error fetching databases:', error);
        }
    };

    const handleCreateDatabase = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await fetch(`${API_URL}/databases`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            
            if (data.success) {
                // Refresh the database list
                await fetchDatabases();
                setIsCreateModalOpen(false);
                // Reset form data
                setFormData({
                    name: '',
                    description: '',
                    database_type: 'postgresql'
                });
            }
        } catch (error) {
            console.error('Error creating database:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditDatabase = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await fetch(`${API_URL}/databases/${selectedDatabase?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            
            if (data.success) {
                // Refresh the database list
                await fetchDatabases();
                setIsEditModalOpen(false);
                setSelectedDatabase(null);
            }
        } catch (error) {
            console.error('Error updating database:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteDatabase = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this database?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/databases/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            
            if (data.success) {
                // Refresh the database list
                await fetchDatabases();
            }
        } catch (error) {
            console.error('Error deleting database:', error);
        }
    };

    // Format the date to a relative time string
    const getRelativeTime = (date: string) => {
        const now = new Date();
        const updated = new Date(date);
        const diffInHours = Math.abs(now.getTime() - updated.getTime()) / 36e5;
        
        if (diffInHours < 1) return 'just now';
        if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
        return `${Math.floor(diffInHours / 24)} days ago`;
    };

    return (
        <main className="container mx-auto px-4 py-8 mt-16">
            {/* Header Section */}
            <div className="mb-8 text-center" data-aos="fade-up">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Database Management</h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Create, manage, and analyze your databases with powerful tools and intuitive interfaces.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" data-aos="fade-up" data-aos-delay="100">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
                            <i className="fas fa-database text-blue-600 dark:text-blue-400 text-xl"></i>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Databases</h3>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{databases.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
                            <i className="fas fa-table text-green-600 dark:text-green-400 text-xl"></i>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Tables</h3>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {databases.reduce((sum, db) => sum + db.tables.length, 0)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3">
                            <i className="fas fa-clock text-purple-600 dark:text-purple-400 text-xl"></i>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Last Updated</h3>
                            <p className="text-lg text-purple-600 dark:text-purple-400">
                                {databases.length > 0 ? getRelativeTime(databases[0].updated_at) : 'Never'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Database List Section */}
            <section className="mb-12" data-aos="fade-up">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Databases</h2>
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200"
                        >
                            <i className="fas fa-plus mr-2"></i>New Database
                        </button>
                    </div>

                    {/* Database List */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 px-4">Name</th>
                                    <th className="text-left py-3 px-4">Description</th>
                                    <th className="text-center py-3 px-4">Tables</th>
                                    <th className="text-center py-3 px-4">Type</th>
                                    <th className="text-center py-3 px-4">Last Updated</th>
                                    <th className="text-right py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {databases.map((db) => (
                                    <tr key={db.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="py-3 px-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{db.name}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="text-gray-600 dark:text-gray-300 truncate max-w-xs">{db.description}</div>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-1 px-2 rounded">
                                                {db.tables.length} tables
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 py-1 px-2 rounded">
                                                {db.database_type}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <div className="text-gray-600 dark:text-gray-300">{getRelativeTime(db.updated_at)}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => navigate(`/database/${db.id}`)}
                                                    className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 rounded"
                                                    title="View Database"
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsEditModalOpen(true);
                                                        setSelectedDatabase(db);
                                                        setFormData({
                                                            name: db.name,
                                                            description: db.description || '',
                                                            database_type: db.database_type
                                                        });
                                                    }}
                                                    className="text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 p-2 rounded"
                                                    title="Edit Database"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDatabase(db.id)}
                                                    className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 p-2 rounded"
                                                    title="Delete Database"
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {databases.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col items-center">
                                                <i className="fas fa-database text-4xl mb-2"></i>
                                                <p>No databases created yet</p>
                                                <button
                                                    onClick={() => setIsCreateModalOpen(true)}
                                                    className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                    Create your first database
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Create/Edit Modal */}
            {(isCreateModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-2xl w-full mx-4">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            {isEditModalOpen ? 'Edit Database' : 'Create New Database'}
                        </h3>
                        <form onSubmit={isEditModalOpen ? handleEditDatabase : handleCreateDatabase}>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Database Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Enter database name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Enter database description"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Database Type
                                    </label>
                                    <select
                                        required
                                        value={formData.database_type}
                                        onChange={(e) => setFormData({...formData, database_type: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="postgresql">PostgreSQL</option>
                                        <option value="mysql">MySQL</option>
                                        <option value="mssql">Microsoft SQL Server</option>
                                        <option value="oracle">Oracle</option>
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCreateModalOpen(false);
                                            setIsEditModalOpen(false);
                                            setSelectedDatabase(null);
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
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {isEditModalOpen ? 'Updating...' : 'Creating...'}
                                            </>
                                        ) : isEditModalOpen ? 'Update Database' : 'Create Database'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default DatabasePage; 