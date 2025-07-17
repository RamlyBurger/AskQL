import { Router } from 'express';
import { TableController } from '../controllers/TableController';

const router = Router();
const tableController = new TableController();

// Get tables by database ID
router.get('/database/:databaseId', (req, res) => tableController.getTablesByDatabaseId(req, res));

// Get table by ID
router.get('/:id', (req, res) => tableController.getTableById(req, res));

// Create table in database
router.post('/database/:databaseId', (req, res) => tableController.createTable(req, res));

// Update table
router.put('/:id', (req, res) => tableController.updateTable(req, res));

// Delete table
router.delete('/:id', (req, res) => tableController.deleteTable(req, res));

export default router; 