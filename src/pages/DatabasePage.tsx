import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DatabaseCard {
    name: string;
    tables: number;
    records: number;
    lastModified: string;
}

interface DatabaseFormData {
    name: string;
    description: string;
    sqlScript: string;
}

const databases: DatabaseCard[] = [
    {
        name: "Customer Database",
        tables: 12,
        records: 10000,
        lastModified: "2 hours ago"
    },
    {
        name: "Inventory System",
        tables: 8,
        records: 5000,
        lastModified: "1 day ago"
    }
];

const DatabasePage = () => {
    const navigate = useNavigate();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<DatabaseFormData>({
        name: '',
        description: '',
        sqlScript: ''
    });

    useEffect(() => {
        // Initialize AOS
        const AOS = (window as any).AOS;
        AOS?.init({
            duration: 800,
            once: true
        });
    }, []);

    const handleCreateDatabase = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // Here you would typically make an API call to create the database
            // For now, we'll simulate a delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Navigate to ERD page with the new database info
            navigate('/erd', { 
                state: { 
                    database: {
                        name: formData.name,
                        description: formData.description,
                        sqlScript: formData.sqlScript
                    }
                }
            });
        } catch (error) {
            console.error('Error creating database:', error);
            // Handle error (show error message to user)
        } finally {
            setIsLoading(false);
            setIsCreateModalOpen(false);
        }
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
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</p>
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
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">48</p>
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
                            <p className="text-lg text-purple-600 dark:text-purple-400">2 hours ago</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Database List Section */}
            <section className="mb-12" data-aos="fade-up" data-aos-delay="200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Databases</h2>
                    <div className="flex space-x-4">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search databases..." 
                                className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            />
                            <i className="fas fa-search absolute left-3 top-3 text-gray-400 dark:text-gray-500"></i>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200">
                            <i className="fas fa-plus mr-2"></i>New Database
                        </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {databases.map((db, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{db.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{db.tables} tables • {db.records.toLocaleString()} records</p>
                                </div>
                                <div className="dropdown relative">
                                    <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                                        <i className="fas fa-ellipsis-v"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                                <i className="fas fa-clock mr-2"></i>
                                Last modified: {db.lastModified}
                            </div>
                            <div className="flex space-x-2">
                                <button className="flex-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 px-3 py-2 rounded transition-colors">
                                    <i className="fas fa-eye mr-1"></i> View
                                </button>
                                <button className="flex-1 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 px-3 py-2 rounded transition-colors">
                                    <i className="fas fa-edit mr-1"></i> Edit
                                </button>
                                <button className="flex-1 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 px-3 py-2 rounded transition-colors">
                                    <i className="fas fa-trash-alt mr-1"></i> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Create New Database Section */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-12 border border-gray-200 dark:border-gray-700" data-aos="fade-up" data-aos-delay="300">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Database</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* SQL to ERD */}
                    <div 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-purple-500 dark:hover:border-purple-400 cursor-pointer transition-colors group"
                    >
                        <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-4 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                            <i className="fas fa-database text-purple-600 dark:text-purple-400 text-xl"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">SQL to ERD</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">Convert SQL schema to ERD</p>
                        <button className="bg-purple-600 dark:bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors w-full">
                            Convert SQL
                        </button>
                    </div>

                    {/* Upload CSV */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-green-500 dark:hover:border-green-400 cursor-pointer transition-colors group">
                        <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                            <i className="fas fa-file-csv text-green-600 dark:text-green-400 text-xl"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Upload CSV</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">Generate ERD from your CSV files</p>
                        <button className="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors w-full">
                            Upload Files
                        </button>
                    </div>

                    {/* Connect External DB */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-orange-500 dark:hover:border-orange-400 cursor-pointer transition-colors group">
                        <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-4 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                            <i className="fas fa-plug text-orange-600 dark:text-orange-400 text-xl"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Connect External DB</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">Connect to your existing database</p>
                        <button className="bg-orange-600 dark:bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors w-full">
                            Connect Now
                        </button>
                    </div>

                    {/* RPA Scraper */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-indigo-500 dark:hover:border-indigo-400 cursor-pointer transition-colors group">
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-4 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                            <i className="fas fa-robot text-indigo-600 dark:text-indigo-400 text-xl"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">RPA Scraper</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">Extract data using RPA automation</p>
                        <button className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors w-full">
                            Setup Scraper
                        </button>
                    </div>
                </div>
            </section>

            {/* Create Database Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-2xl w-full mx-4">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Database</h3>
                        <form onSubmit={handleCreateDatabase}>
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
                                        SQL Script
                                    </label>
                                    <textarea
                                        required
                                        value={formData.sqlScript}
                                        onChange={(e) => setFormData({...formData, sqlScript: e.target.value})}
                                        rows={8}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                                        placeholder="Enter your SQL schema script..."
                                    />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
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
                                                Creating...
                                            </>
                                        ) : 'Create Database'}
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