import { useState } from 'react';
import type { Table } from '../services/DatabaseService';

interface InsertDataModalProps {
    table: Table;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Record<string, any>) => Promise<void>;
}

const InsertDataModal = ({ table, isOpen, onClose, onSubmit }: InsertDataModalProps) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            setIsLoading(true);
            await onSubmit(formData);
            setFormData({});
            onClose();
        } catch (err) {
            console.error('Error inserting data:', err);
            setError('Failed to insert data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (attributeName: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [attributeName]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-2xl w-full mx-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Insert Data into {table.name}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {table.attributes.map(attr => (
                        <div key={attr.id}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {attr.name}
                                {!attr.isNullable && <span className="text-rose-600 dark:text-rose-400 ml-1">*</span>}
                            </label>
                            <input
                                type="text"
                                value={formData[attr.name] || ''}
                                onChange={(e) => handleInputChange(attr.name, e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder={`Enter ${attr.name}`}
                                required={!attr.isNullable}
                            />
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Type: {attr.dataType}
                            </p>
                        </div>
                    ))}

                    {error && (
                        <div className="text-rose-600 dark:text-rose-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
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
                                    Inserting...
                                </>
                            ) : (
                                'Insert Data'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InsertDataModal; 