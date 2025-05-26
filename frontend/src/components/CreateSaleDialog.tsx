import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

interface CreateSaleRequest {
  saleDate: string; // ISO 8601 UTC timestamp
  saleNumber: string;
  customer: string;
  branch: string;
  products: CreateSaleItemDto[];
}

interface CreateSaleItemDto {
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface CreateSaleDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (sale: CreateSaleRequest) => Promise<void>;
}

interface SaleItemForm extends CreateSaleItemDto {
  tempId: string;
  discount: number;
  total: number;
}

export function CreateSaleDialog({ open, onClose, onSave }: CreateSaleDialogProps) {
  const [formData, setFormData] = useState({
    saleNumber: '',
    saleDate: new Date().toISOString().split('T')[0], // Local date for input
    saleTime: new Date().toTimeString().split(' ')[0].substring(0, 5), // Local time for input
    customer: '',
    branch: ''
  });

  const [items, setItems] = useState<SaleItemForm[]>([]);
  const [newItem, setNewItem] = useState({
    productName: '',
    quantity: 1,
    unitPrice: 0
  });
  const [quantityError, setQuantityError] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const calculateDiscount = (quantity: number, unitPrice: number): number => {
    if (quantity >= 10) {
      return quantity * unitPrice * 0.20;
    } else if (quantity >= 4) {
      return quantity * unitPrice * 0.10;
    } else {
      return 0;
    }
  };

  const calculateItemTotal = (quantity: number, unitPrice: number): number => {
    const discount = calculateDiscount(quantity, unitPrice);
    return (quantity * unitPrice) - discount;
  };

  const calculateTotalAmount = () => {
    return items.reduce((total, item) => total + item.total, 0);
  };

  const handleQuantityChange = (quantity: number) => {
    if (quantity > 20) {
      setQuantityError(`Cannot sell more than 20 units of product '${newItem.productName || 'this product'}'`);
    } else {
      setQuantityError('');
    }
    setNewItem({ ...newItem, quantity });
  };

  const handleAddItem = () => {
    if (!newItem.productName) return;
    if (newItem.quantity > 20) return;

    const discount = calculateDiscount(newItem.quantity, newItem.unitPrice);
    const total = calculateItemTotal(newItem.quantity, newItem.unitPrice);
    
    const item: SaleItemForm = {
      tempId: Date.now().toString(),
      productName: newItem.productName,
      quantity: newItem.quantity,
      unitPrice: newItem.unitPrice,
      discount,
      total
    };

    setItems([...items, item]);
    setNewItem({
      productName: '',
      quantity: 1,
      unitPrice: 0
    });
    setQuantityError('');
  };

  const handleRemoveItem = (tempId: string) => {
    setItems(items.filter(item => item.tempId !== tempId));
  };

  // Função para converter data e hora local para UTC ISO string
  const createUTCTimestamp = (dateStr: string, timeStr: string): string => {
    // Criar data local
    const localDateTime = new Date(`${dateStr}T${timeStr}:00`);
    
    // Converter para UTC ISO string
    const utcTimestamp = localDateTime.toISOString();
    
    console.log(`Converting: ${dateStr} ${timeStr} -> ${utcTimestamp}`);
    return utcTimestamp;
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    
    try {
      // Converter data e hora para UTC timestamp
      const utcSaleDate = createUTCTimestamp(formData.saleDate, formData.saleTime);
      
      // Criar o objeto que o backend espera
      const saleRequest: CreateSaleRequest = {
        saleDate: utcSaleDate, // Timestamp UTC completo
        saleNumber: formData.saleNumber,
        customer: formData.customer,
        branch: formData.branch,
        products: items.map(item => ({
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      };

      console.log('Sending sale request:', JSON.stringify(saleRequest, null, 2));
      
      await onSave(saleRequest);
      handleClose();
    } catch (error: any) {
      console.error('Error creating sale:', error);
      
      let errorMessage = 'Failed to create sale. ';
      
      if (error.response?.status === 500) {
        errorMessage += 'Server error occurred. Please check the server logs.';
      } else if (error.response?.status === 400) {
        errorMessage += 'Invalid data provided.';
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Unknown error occurred.';
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (saving) return;
    
    setFormData({
      saleNumber: '',
      saleDate: new Date().toISOString().split('T')[0],
      saleTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
      customer: '',
      branch: ''
    });
    setItems([]);
    setNewItem({
      productName: '',
      quantity: 1,
      unitPrice: 0
    });
    setQuantityError('');
    setError('');
    onClose();
  };

  const currentDiscount = calculateDiscount(newItem.quantity, newItem.unitPrice);
  const currentTotal = calculateItemTotal(newItem.quantity, newItem.unitPrice);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>Create New Sale</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Sale Information */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Sale Number"
                value={formData.saleNumber}
                onChange={(e) => setFormData({ ...formData, saleNumber: e.target.value })}
                required
                disabled={saving}
                sx={{ flex: '1 1 200px', minWidth: '150px' }}
              />
              <TextField
                label="Sale Date"
                type="date"
                value={formData.saleDate}
                onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
                disabled={saving}
                sx={{ flex: '1 1 200px', minWidth: '150px' }}
              />
              <TextField
                label="Sale Time"
                type="time"
                value={formData.saleTime}
                onChange={(e) => setFormData({ ...formData, saleTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
                disabled={saving}
                sx={{ flex: '1 1 150px', minWidth: '120px' }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Customer"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                required
                disabled={saving}
                sx={{ flex: '1 1 300px', minWidth: '200px' }}
              />
              <TextField
                label="Branch"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                required
                disabled={saving}
                sx={{ flex: '1 1 300px', minWidth: '200px' }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Sale Items
          </Typography>

          {/* Discount Rules Info */}
          <Box sx={{ mb: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Automatic Discount Rules:
            </Typography>
            <Typography variant="body2">
              • 10+ units: 20% discount | 4-9 units: 10% discount | 1-3 units: No discount
            </Typography>
            <Typography variant="body2" color="error">
              • Maximum 20 units per product
            </Typography>
          </Box>

          {/* Add Item Form */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <TextField
                label="Product Name"
                value={newItem.productName}
                onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
                size="small"
                disabled={saving}
                sx={{ flex: '1 1 200px', minWidth: '150px' }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                  label="Quantity"
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  size="small"
                  inputProps={{ min: 1, max: 20 }}
                  sx={{ flex: '0 1 100px', minWidth: '80px' }}
                  error={!!quantityError}
                  disabled={saving}
                />
                {quantityError && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {quantityError}
                  </Typography>
                )}
              </Box>
              <TextField
                label="Unit Price"
                type="number"
                value={newItem.unitPrice}
                onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
                sx={{ flex: '0 1 120px', minWidth: '100px' }}
                disabled={saving}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '150px' }}>
                {currentDiscount > 0 && (
                  <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
                    Discount: ${currentDiscount.toFixed(2)}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Total: ${currentTotal.toFixed(2)}
                </Typography>
                <IconButton
                  color="primary"
                  onClick={handleAddItem}
                  disabled={!newItem.productName || newItem.quantity > 20 || newItem.unitPrice <= 0 || saving}
                  size="small"
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Items Table */}
          {items.length > 0 && (
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Discount</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.tempId}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <Typography 
                          variant="body2" 
                          color={item.discount > 0 ? 'success.main' : 'text.secondary'}
                          sx={{ fontWeight: item.discount > 0 ? 'bold' : 'normal' }}
                        >
                          ${item.discount.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">${item.total.toFixed(2)}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleRemoveItem(item.tempId)}
                          disabled={saving}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} sx={{ fontWeight: 'bold' }}>
                      Total Amount:
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      ${calculateTotalAmount().toFixed(2)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Timestamp Preview */}
          {formData.saleDate && formData.saleTime && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                <strong>UTC Timestamp:</strong> {createUTCTimestamp(formData.saleDate, formData.saleTime)}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!formData.saleNumber || !formData.customer || !formData.branch || items.length === 0 || saving}
          startIcon={saving ? <CircularProgress size={20} /> : null}
        >
          {saving ? 'Creating...' : 'Create Sale'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
