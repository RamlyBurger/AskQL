import { Router } from 'express';
import { AttributeController } from '../controllers/AttributeController';

const router = Router();
const attributeController = new AttributeController();

// Get attributes by table ID
router.get('/table/:tableId', (req, res) => attributeController.getAttributesByTableId(req, res));

// Create attribute in table
router.post('/table/:tableId', (req, res) => attributeController.createAttribute(req, res));

// Update attribute
router.put('/:id', (req, res) => attributeController.updateAttribute(req, res));

// Delete attribute
router.delete('/:id', (req, res) => attributeController.deleteAttribute(req, res));

export default router; 