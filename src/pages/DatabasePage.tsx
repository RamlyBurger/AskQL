import { useEffect } from 'react';

interface DatabaseCard {
    name: string;
    tables: number;
    records: number;
    lastModified: string;
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
    useEffect(() => {
        // Initialize AOS
        const AOS = (window as any).AOS;
        AOS?.init({
            duration: 800,
            once: true
        });
    }, []);

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
                    {/* Create/Select Database */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-colors group">
                        <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                            <i className="fas fa-plus text-blue-600 dark:text-blue-400 text-xl"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Create/Select Database</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">Start from scratch or choose an existing database</p>
                        <button className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors w-full">
                            Get Started
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

                    {/* SQL to ERD */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-purple-500 dark:hover:border-purple-400 cursor-pointer transition-colors group">
                        <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-4 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                            <i className="fas fa-database text-purple-600 dark:text-purple-400 text-xl"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">SQL to ERD</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">Convert SQL schema to ERD</p>
                        <button className="bg-purple-600 dark:bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors w-full">
                            Convert SQL
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
        </main>
    );
};

export default DatabasePage; 