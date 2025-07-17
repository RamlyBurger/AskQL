import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { TableData } from '../entities/TableData';
import { Table } from '../entities/Table';

export class TableDataController {
    private tableDataRepository = AppDataSource.getRepository(TableData);
    private tableRepository = AppDataSource.getRepository(Table);

    // Get data samples for a table
    async getTableData(req: Request, res: Response) {
        try {
            const { tableId } = req.params;
            const { limit = 100, offset = 0 } = req.query;

            const data = await this.tableDataRepository.find({
                where: { table_id: parseInt(tableId) },
                order: { created_at: 'DESC' },
                take: Math.min(parseInt(limit as string), 1000), // Maximum 1000 rows
                skip: parseInt(offset as string)
            });

            const total = await this.tableDataRepository.count({
                where: { table_id: parseInt(tableId) }
            });

            return res.json({
                success: true,
                data,
                metadata: {
                    total,
                    limit: parseInt(limit as string),
                    offset: parseInt(offset as string)
                }
            });
        } catch (error) {
            console.error('Error fetching table data:', error);
            return res.status(500).json({
                success: false,
                message: 'Error fetching table data'
            });
        }
    }

    // Store data samples for a table
    async storeTableData(req: Request, res: Response) {
        try {
            const { tableId } = req.params;
            const { data } = req.body;

            // Validate input
            if (!Array.isArray(data)) {
                return res.status(400).json({
                    success: false,
                    message: 'Data must be an array of records'
                });
            }

            const table = await this.tableRepository.findOne({
                where: { id: parseInt(tableId) }
            });

            if (!table) {
                return res.status(404).json({
                    success: false,
                    message: 'Table not found'
                });
            }

            // Create table data entries
            const tableDataEntries = data.map(row_data => 
                this.tableDataRepository.create({
                    table,
                    row_data
                })
            );

            await this.tableDataRepository.save(tableDataEntries);

            return res.status(201).json({
                success: true,
                message: `${tableDataEntries.length} records stored successfully`
            });
        } catch (error) {
            console.error('Error storing table data:', error);
            return res.status(500).json({
                success: false,
                message: 'Error storing table data'
            });
        }
    }

    // Delete a single row of data by ID
    async deleteTableDataRow(req: Request, res: Response) {
        try {
            const { tableId, rowId } = req.params;

            const row = await this.tableDataRepository.findOne({
                where: { 
                    id: parseInt(rowId),
                    table_id: parseInt(tableId)
                }
            });

            if (!row) {
                return res.status(404).json({
                    success: false,
                    message: 'Data row not found'
                });
            }

            await this.tableDataRepository.remove(row);

            return res.json({
                success: true,
                message: 'Data row deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting table data row:', error);
            return res.status(500).json({
                success: false,
                message: 'Error deleting table data row'
            });
        }
    }

    // Delete all data for a table
    async deleteAllTableData(req: Request, res: Response) {
        try {
            const { tableId } = req.params;

            const result = await this.tableDataRepository.delete({ table_id: parseInt(tableId) });

            return res.json({
                success: true,
                message: `${result.affected || 0} records deleted successfully`
            });
        } catch (error) {
            console.error('Error deleting table data:', error);
            return res.status(500).json({
                success: false,
                message: 'Error deleting table data'
            });
        }
    }
} 