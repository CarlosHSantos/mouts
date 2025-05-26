import { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Switch,
  FormControlLabel
} from '@mui/material';
import type { Sale } from '../domain/Sale';

interface UpdateSaleRequest {
  id: string;
  saleDate: string; // ISO 8601 UTC timestamp
  saleNumber: string;
  customer: string;
  branch: string;
  isCancelled: boolean;
  products: UpdateSaleItemDto[];
}

interface UpdateSaleItemDto {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  isCancelled: boolean;
}

interface UpdateSaleDialogProps {
  open: boolean;
  sale: Sale | null;
  onClose: () => void;
  onSave: (sale: UpdateSaleRequest) => Promise<void>;
}

interface SaleItemForm extends UpdateSaleItemDto {
  discount: number;
  total: number;
  originalQuantity: number;
  originalUnitPrice: number;
  originalIsCancelled: boolean;
}

export function UpdateSaleDialog({ open, sale, onClose, onSave }: UpdateSaleDialogProps) {
  const [formData, setFormData] = useState({
    saleNumber: '',
    saleDate: '',
    saleTime: '',
    customer: '',
    branch: '',
    isCancelled: false
  });

  const [items, setItems] = useState<SaleItemForm[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Carregar dados do sale quando o dialog abrir
  useEffect(() => {
    if (open && sale) {
      const saleDateTime = new Date(sale.saleDate);
      const localDate = saleDateTime.toISOString().split('T')[0];
      const localTime = saleDateTime.toTimeString().split(' ')[0].substring(0, 5);

      setFormData({
        saleNumber: sale.saleNumber,
        saleDate: localDate,
        saleTime: localTime,
        customer: sale.customer,
        branch: sale.branch,
        isCancelled: sale.isCancelled
      });

      const saleItems: SaleItemForm[] = sale.products.map(product => {
        const discount = calculateDiscount(product.quantity, product.unitPrice);
        const total = calculateItemTotal(product.quantity, product.unitPrice);
        
        return {
          id: product.id,
          productName: product.productName,
          quantity: product.quantity,
          unitPrice: product.unitPrice,
          isCancelled: product.isCancelled,
          discount,
          total,
          originalQuantity: product.quantity,
          originalUnitPrice: product.unitPrice,
          originalIsCancelled: product.isCancelled
        };
      });

      setItems(saleItems);
    }
  }, [open, sale]);

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
    return items
      .filter(item => !item.isCancelled)
      .reduce((total, item) => total + item.total, 0);
  };

  const handleItemChange = (itemId: string, field: keyof SaleItemForm, value: any) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          
          // Recalcular discount e total se quantity ou unitPrice mudaram
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.discount = calculateDiscount(updatedItem.quantity, updatedItem.unitPrice);
            updatedItem.total = calculateItemTotal(updatedItem.quantity, updatedItem.unitPrice);
          }
          
          return updatedItem;
        }
        return item;
      })
    );
  };

  const createUTCTimestamp = (dateStr: string, timeStr: string): string => {
    const localDateTime = new Date(`${dateStr}T${timeStr}:00`);
    const utcTimestamp = localDateTime.toISOString();
    console.log(`Converting: ${dateStr} ${timeStr} -> ${utcTimestamp}`);
    return utcTimestamp;
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    
    try {
      if (!sale) return;

      const utcSaleDate = createUTCTimestamp(formData.saleDate, formData.saleTime);
      
      const updateRequest: UpdateSaleRequest = {
        id: sale.id,
        saleDate: utcSaleDate,
        saleNumber: formData.saleNumber,
        customer: formData.customer,
        branch: formData.branch,
        isCancelled: formData.isCancelled,
        products: items.map(item => ({
          id: item.id,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          isCancelled: item.isCancelled
        }))
      };

      console.log('Sending update request:', JSON.stringify(updateRequest, null, 2));
      
      await onSave(updateRequest);
      handleClose();
    } catch (error: any) {
      console.error('Error updating sale:', error);
      
      let errorMessage = 'Failed to update sale. ';
      
      if (error.response?.status === 500) {
        errorMessage += 'Server error occurred. Please check the server logs.';
      } else if (error.response?.status === 400) {
        errorMessage += 'Invalid data provided.';
      } else if (error.response?.status === 404) {
        errorMessage += 'Sale not found.';
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
      saleDate: '',
      saleTime: '',
      customer: '',
      branch: '',
      isCancelled: false
    });
    setItems([]);
    setError('');
    onClose();
  };

  const hasChanges = () => {
    if (!sale) return false;
    
    // Verificar mudanças nos dados principais
    const saleDateTime = new Date(sale.saleDate);
    const originalDate = saleDateTime.toISOString().split('T')[0];
    const originalTime = saleDateTime.toTimeString().split(' ')[0].substring(0, 5);
    
    if (formData.saleNumber !== sale.saleNumber ||
        formData.saleDate !== originalDate ||
        formData.saleTime !== originalTime ||
        formData.customer !== sale.customer ||
        formData.branch !== sale.branch ||
        formData.isCancelled !== sale.isCancelled) {
      return true;
    }
    
    // Verificar mudanças nos produtos
    return items.some(item => 
      item.quantity !== item.originalQuantity ||
      item.unitPrice !== item.originalUnitPrice ||
      item.isCancelled !== item.originalIsCancelled
    );
  };

  if (!sale) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Update Sale
          <Chip
            label={formData.isCancelled ? 'Cancelled' : 'Active'}
            color={formData.isCancelled ? 'error' : 'success'}
            size="small"
          />
        </Box>
      </DialogTitle>
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

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isCancelled}
                  onChange={(e) => setFormData({ ...formData, isCancelled: e.target.checked })}
                  disabled={saving}
                />
              }
              label="Cancel Sale"
            />
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

          {/* Items Table */}
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Discount</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Cancel Item</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow 
                    key={item.id}
                    sx={{ 
                      opacity: item.isCancelled ? 0.6 : 1,
                      bgcolor: item.isCancelled ? 'error.light' : 'inherit'
                    }}
                  >
                    <TableCell>
                      <TextField
                        value={item.productName}
                        onChange={(e) => handleItemChange(item.id, 'productName', e.target.value)}
                        size="small"
                        disabled={saving || item.isCancelled}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                        size="small"
                        inputProps={{ min: 1, max: 20 }}
                        disabled={saving || item.isCancelled}
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                        size="small"
                        inputProps={{ min: 0, step: 0.01 }}
                        disabled={saving || item.isCancelled}
                        sx={{ width: 100 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="body2" 
                        color={item.discount > 0 ? 'success.main' : 'text.secondary'}
                        sx={{ fontWeight: item.discount > 0 ? 'bold' : 'normal' }}
                      >
                        ${item.discount.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        ${item.total.toFixed(2)}
                      </Typography>
                    </TableCell>
                                        <TableCell align="center">
                      <Chip
                        label={item.isCancelled ? 'Cancelled' : 'Active'}
                        color={item.isCancelled ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={item.isCancelled}
                        onChange={(e) => handleItemChange(item.id, 'isCancelled', e.target.checked)}
                        disabled={saving}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} sx={{ fontWeight: 'bold' }}>
                    Total Amount (Active Items):
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    ${calculateTotalAmount().toFixed(2)}
                  </TableCell>
                  <TableCell colSpan={2} />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Changes Summary */}
          {hasChanges() && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Changes Detected:
              </Typography>
              <Typography variant="body2">
                You have unsaved changes. Click "Update Sale" to save them.
              </Typography>
            </Box>
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
          disabled={!formData.saleNumber || !formData.customer || !formData.branch || !hasChanges() || saving}
          startIcon={saving ? <CircularProgress size={20} /> : null}
        >
          {saving ? 'Updating...' : 'Update Sale'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
