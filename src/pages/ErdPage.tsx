import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as joint from 'jointjs';

interface DatabaseInfo {
    name: string;
    description: string;
    sqlScript: string;
}

const ErdPage = () => {
    const location = useLocation();
    const erdCanvasRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<joint.dia.Graph | null>(null);
    const paperRef = useRef<joint.dia.Paper | null>(null);
    const [databaseInfo, setDatabaseInfo] = useState<DatabaseInfo | null>(null);

    useEffect(() => {
        // Get database info from navigation state
        const state = location.state as { database?: DatabaseInfo };
        if (state?.database) {
            setDatabaseInfo(state.database);
            // Here you would parse the SQL script and generate the ERD
            console.log('Received database:', state.database);
        }
    }, [location]);

    useEffect(() => {
        // Initialize AOS
        const AOS = (window as any).AOS;
        AOS?.init({
            duration: 800,
            once: true
        });

        // Initialize JointJS graph with dark mode support
        const isDarkMode = document.documentElement.classList.contains('dark');
        
        if (erdCanvasRef.current) {
            graphRef.current = new joint.dia.Graph();
            paperRef.current = new joint.dia.Paper({
                el: erdCanvasRef.current,
                model: graphRef.current,
                width: '100%',
                height: '100%',
                gridSize: 10,
                drawGrid: true,
                background: {
                    color: isDarkMode ? '#1f2937' : 'white'
                }
            });

            // If we have database info, generate the ERD
            if (databaseInfo?.sqlScript) {
                // Here you would implement the SQL parsing and ERD generation
                // For now, we'll just create a sample table
                const table = new joint.shapes.erd.Entity({
                    position: { x: 100, y: 100 },
                    size: { width: 150, height: 60 },
                    attrs: {
                        text: {
                            text: databaseInfo.name,
                            fill: isDarkMode ? '#fff' : '#000',
                        },
                        '.outer': {
                            fill: isDarkMode ? '#374151' : '#fff',
                            stroke: isDarkMode ? '#4B5563' : '#E5E7EB',
                        }
                    }
                });

                graphRef.current.addCell(table);
            }

            // Handle dark mode changes
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        const isDarkMode = document.documentElement.classList.contains('dark');
                        if (paperRef.current) {
                            paperRef.current.options.background = {
                                color: isDarkMode ? '#1f2937' : 'white'
                            };
                            paperRef.current.drawBackground();
                        }
                    }
                });
            });

            observer.observe(document.documentElement, {
                attributes: true
            });

            // Cleanup
            return () => {
                observer.disconnect();
                graphRef.current?.clear();
                paperRef.current?.remove();
            };
        }
    }, [databaseInfo]);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-72 bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                        {databaseInfo?.name || 'ERD Editor'}
                    </h2>
                    
                    {databaseInfo && (
                        <div className="mb-6">
                            <p className="text-sm text-gray-600 dark:text-gray-300">{databaseInfo.description}</p>
                        </div>
                    )}

                    {/* Tools Section */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">Tools</h3>
                        <div className="space-y-2">
                            <button className="w-full flex items-center text-left px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-150">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                </svg>
                                Add Table
                            </button>
                            <button className="w-full flex items-center text-left px-4 py-3 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors duration-150">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                                </svg>
                                Add Relationship
                            </button>
                            <button className="w-full flex items-center text-left px-4 py-3 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors duration-150">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                </svg>
                                Add Column
                            </button>
                        </div>
                    </div>

                    {/* Properties Section */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">Properties</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Name</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:text-white transition-colors duration-150"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Data Type</label>
                                <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:text-white transition-colors duration-150">
                                    <option>VARCHAR</option>
                                    <option>INTEGER</option>
                                    <option>DATETIME</option>
                                    <option>BOOLEAN</option>
                                    <option>DECIMAL</option>
                                    <option>TEXT</option>
                                    <option>JSON</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Primary Key</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Nullable</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Auto Increment</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-150 flex items-center justify-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            <span>Save Changes</span>
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-150">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                </svg>
                                <span>Export</span>
                            </button>
                            <button className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-150">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                                <span>SQL</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-gray-100 dark:bg-gray-800/50 p-6 transition-colors duration-200">
                {/* ERD Canvas */}
                <div 
                    ref={erdCanvasRef}
                    className="w-full h-full bg-white dark:bg-gray-800 rounded-xl shadow-inner transition-colors duration-200"
                />
            </div>
        </div>
    );
};

export default ErdPage; 