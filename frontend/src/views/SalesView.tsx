import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { container } from '../app/container';
import { SaleViewModel } from '../viewmodels/SaleViewModel';
import type { Sale } from '../domain/Sale';
import { CreateSaleDialog } from '../components/CreateSaleDialog';
import { UpdateSaleDialog } from '../components/UpdateSaleDialog';
import type { CreateSaleRequest } from '../data/repositories/requests/CreateSaleRequest';
import type { UpdateSaleRequest } from '../data/repositories/requests/UpdateSaleRequest';

export function SalesView() {
  const [vm] = useState(() => container.resolve<SaleViewModel>('saleViewModel'));
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState<Sale[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  
  const [saleToDelete, setSaleToDelete] = useState<string | null>(null);
  const [saleToUpdate, setSaleToUpdate] = useState<Sale | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info'
  });
 
  const hasLoadedRef = useRef(false);

  // Função para normalizar os dados da venda
  const normalizeSaleData = (sale: any): Sale => {
    return {
      ...sale,
      products: Array.isArray(sale.products) ? sale.products : [],
      totalAmount: Number(sale.totalAmount) || 0
    };
  };

  // Função para calcular o total de uma venda (agora usa o valor do backend)
  const getSaleTotal = (sale: Sale): number => {
    // Usar o totalAmount que vem do backend
    if (sale.totalAmount && !isNaN(Number(sale.totalAmount))) {
      return Number(sale.totalAmount);
    }
    
    // Fallback: calcular se não vier do backend
    const products = Array.isArray(sale.products) ? sale.products : [];
    
    if (products.length === 0) {
      return 0;
    }
    
    return products
      .filter(product => product && !product.isCancelled)
      .reduce((total, product) => {
        const quantity = Number(product.quantity) || 0;
        const unitPrice = Number(product.unitPrice) || 0;
        const discount = Number(product.discount) || 0;
        
        if (product.total && !isNaN(Number(product.total))) {
          return total + Number(product.total);
        }
        
        const productTotal = (quantity * unitPrice) - discount;
        return total + Math.max(0, productTotal);
      }, 0);
  };

  // Função para obter estatísticas dos produtos
  const getProductsStats = (sale: Sale) => {
    const products = Array.isArray(sale.products) ? sale.products : [];
    
    const total = products.length;
    const active = products.filter(product => product && !product.isCancelled).length;
    const cancelled = total - active;
    
    return { active, total, cancelled };
  };

  // Função para formatar valores monetários
  const formatCurrency = (value: number): string => {
    if (isNaN(value)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const debugSaleData = (sales: Sale[]) => {
    console.log('🔍 DEBUG: Sales data structure:', {
      salesCount: sales.length,
      sales: sales.map(sale => ({
        id: sale.id,
        saleNumber: sale.saleNumber,
        products: sale.products,
        productsType: typeof sale.products,
        productsIsArray: Array.isArray(sale.products),
        productsLength: sale.products?.length,
        totalAmount: sale.totalAmount,
        rawSale: sale
      }))
    });
  };

  useEffect(() => {
    async function load() {
      if (hasLoadedRef.current) return;
      hasLoadedRef.current = true;
      
      try {
        console.log('🔄 Loading sales data...');
        setLoading(true);
        const salesData = await vm.fetchSales();
        console.log('📊 Raw sales data received:', salesData);
        
        // Normalizar os dados antes de definir no state
        const normalizedSales = (salesData || []).map(normalizeSaleData);
        
        // Debug detalhado
        debugSaleData(normalizedSales);
        
        setSales(normalizedSales);
        console.log('✅ Sales data loaded successfully');
      } catch (error) {
        console.error('❌ Error loading sales:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load sales data',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
    
    load();
  }, [vm]);

  const handleDeleteClick = (id: string) => {
    setSaleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      console.log('🔄 Refreshing sales data...');
      const salesData = await vm.fetchSales();
      
      // Normalizar os dados antes de definir no state
      const normalizedSales = (salesData || []).map(normalizeSaleData);
      
      setSales(normalizedSales);
      setSnackbar({
        open: true,
        message: 'Sales data refreshed',
        severity: 'success'
      });
    } catch (error) {
      console.error('❌ Failed to refresh sales:', error);
      setSnackbar({
        open: true,
        message: 'Failed to refresh sales',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!saleToDelete) return;
    
    try {
      await vm.deleteSale(saleToDelete);
      const updatedSales = await vm.fetchSales();
      setSales(updatedSales || []);
      setSnackbar({
        open: true,
        message: 'Sale deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting sale:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete sale',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSaleToDelete(null);
    }
  };

  const handleCreateSale = async (saleRequest: CreateSaleRequest) => {
    try {
      await vm.createSale(saleRequest);
      const updatedSales = await vm.fetchSales();
      setSales(updatedSales || []);
      setCreateDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Sale created successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    }
  };

  const handleUpdateClick = (sale: Sale) => {
    setSaleToUpdate(sale);
    setUpdateDialogOpen(true);
  };

  const handleUpdateSale = async (updateRequest: UpdateSaleRequest) => {
    try {
      await vm.updateSale(updateRequest);
      const updatedSales = await vm.fetchSales();
      setSales(updatedSales || []);
      setUpdateDialogOpen(false);
      setSaleToUpdate(null);
      setSnackbar({
        open: true,
        message: 'Sale updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating sale:', error);
      throw error;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.default',
          zIndex: 1000
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading sales...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'background.default',
        overflow: 'auto',
        p: 3
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Sales Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Sale
          </Button>
        </Box>
      </Box>

      {sales.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No sales found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first sale to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create First Sale
          </Button>
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 200px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                  Sale Number
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                  Customer
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                  Branch
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'primary.contrastText' }}
                >
                  Products
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'primary.contrastText' }}
                >
                  Total Amount
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'primary.contrastText' }}
                >
                  Status
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'primary.contrastText' }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales
                .filter(sale => sale != null) // Filter out null/undefined sales first
                .map((sale) => {
                  // Debug: log da estrutura da venda
                  console.log('🔍 Processing sale:', {
                    id: sale.id,
                    saleNumber: sale.saleNumber,
                    products: sale.products,
                    productsLength: sale.products?.length || 0,
                    totalAmount: sale.totalAmount
                  });

                  const productsStats = getProductsStats(sale);
                  const totalAmount = getSaleTotal(sale);
                 
                  return (
                    <TableRow
                      key={sale.id}
                      sx={{
                        opacity: sale.isCancelled ? 0.6 : 1,
                        bgcolor: sale.isCancelled ? 'error.light' : 'inherit',
                        '&:hover': {
                          bgcolor: sale.isCancelled ? 'error.light' : 'action.hover'
                        }
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {sale.saleNumber || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(sale.saleDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {sale.customer || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {sale.branch || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {productsStats.active}/{productsStats.total}
                          </Typography>
                          {productsStats.cancelled > 0 && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              ({productsStats.cancelled} cancelled)
                            </Typography>
                          )}
                          {productsStats.total === 0 && (
                            <Typography variant="caption" color="warning.main" display="block">
                              No products
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: totalAmount > 0 ? 'text.primary' : 'text.secondary' }}>
                            {formatCurrency(totalAmount)}
                          </Typography>
                          {sale.totalAmount && sale.totalAmount !== totalAmount && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              (Original: {formatCurrency(sale.totalAmount)})
                            </Typography>
                          )}
                          {totalAmount === 0 && productsStats.total > 0 && (
                            <Typography variant="caption" color="warning.main" display="block">
                              Check products
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={sale.isCancelled ? 'Cancelled' : 'Active'}
                          color={sale.isCancelled ? 'error' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title={sale.isCancelled ? "Cannot edit cancelled sale" : "Edit Sale"}>
                            <span>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleUpdateClick(sale)}
                                disabled={sale.isCancelled}
                              >
                                <EditIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Delete Sale">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(sale.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Sale Dialog */}
      <CreateSaleDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreateSale}
      />

      {/* Update Sale Dialog */}
      <UpdateSaleDialog
        open={updateDialogOpen}
        sale={saleToUpdate}
        onClose={() => {
          setUpdateDialogOpen(false);
          setSaleToUpdate(null);
        }}
        onSave={handleUpdateSale}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this sale? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
