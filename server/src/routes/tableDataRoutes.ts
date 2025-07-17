import { Router } from 'express';
import { TableDataController } from '../controllers/TableDataController';

const router = Router();
const tableDataController = new TableDataController();

// Get table data samples
router.get('/:tableId/data', (req, res) => tableDataController.getTableData(req, res));

// Store table data samples
router.post('/:tableId/data', (req, res) => tableDataController.storeTableData(req, res));

// Delete a single row of data
router.delete('/:tableId/data/:rowId', (req, res) => tableDataController.deleteTableDataRow(req, res));

// Delete all data for a table
router.delete('/:tableId/data', (req, res) => tableDataController.deleteAllTableData(req, res));

export default router; 