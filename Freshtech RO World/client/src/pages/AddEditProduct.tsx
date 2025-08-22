import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Cancel,
  Add,
  Delete,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useProducts } from '@/hooks/useProducts';
import { useAppDispatch } from '@/store';
import { addNotification } from '@/store/slices/uiSlice';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { routes } from '@/constants/config';

interface AddEditProductProps {
  mode: 'add' | 'edit';
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  images: string[];
  specifications: Record<string, string>;
}

const productSchema = yup.object().shape({
  name: yup
    .string()
    .required('Product name is required')
    .min(3, 'Product name must be at least 3 characters')
    .max(100, 'Product name must be less than 100 characters'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  price: yup
    .number()
    .required('Price is required')
    .positive('Price must be positive')
    .min(0, 'Price cannot be negative'),
  category: yup
    .string()
    .required('Category is required'),
  inStock: yup
    .boolean()
    .required(),
  images: yup
    .array()
    .of(yup.string().url('Must be a valid URL'))
    .min(1, 'At least one image is required'),
  specifications: yup
    .object()
    .test('has-specs', 'At least one specification is required', (value) => {
      return value && Object.keys(value).length > 0;
    }),
});

const categories = [
  'RO Systems',
  'Water Filters',
  'Accessories',
  'Maintenance',
  'Spare Parts',
];

const AddEditProduct: React.FC<AddEditProductProps> = ({ mode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentProduct, isLoading, error, loadProduct, addProduct, editProduct } = useProducts();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      inStock: true,
      images: [''],
      specifications: {},
    },
  });

  const watchedSpecs = watch('specifications');

  useEffect(() => {
    if (mode === 'edit' && id) {
      console.log('AddEditProduct: Loading product with ID:', id);
      loadProduct(id);
    }
  }, [mode, id]); // Remove loadProduct from dependency array to prevent infinite loop

  useEffect(() => {
    if (mode === 'edit' && currentProduct) {
      reset({
        name: currentProduct.name,
        description: currentProduct.description,
        price: currentProduct.price,
        category: currentProduct.category,
        inStock: currentProduct.inStock,
        images: currentProduct.images,
        specifications: currentProduct.specifications,
      });
    }
  }, [mode, currentProduct, reset]);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      if (mode === 'add') {
        await addProduct(data);
        dispatch(
          addNotification({
            type: 'success',
            message: 'Product created successfully!',
          })
        );
      } else {
        if (id) {
          await editProduct(id, data);
          dispatch(
            addNotification({
              type: 'success',
              message: 'Product updated successfully!',
            })
          );
        }
      }
      navigate(`${routes.admin.dashboard}/products`);
    } catch (error) {
      dispatch(
        addNotification({
          type: 'error',
          message: mode === 'add' ? 'Failed to create product' : 'Failed to update product',
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddImage = () => {
    const currentImages = watch('images');
    setValue('images', [...currentImages, '']);
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = watch('images');
    const newImages = currentImages.filter((_, i) => i !== index);
    setValue('images', newImages);
  };

  const handleAddSpecification = () => {
    if (specKey && specValue) {
      const currentSpecs = watch('specifications');
      setValue('specifications', {
        ...currentSpecs,
        [specKey]: specValue,
      });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const handleRemoveSpecification = (key: string) => {
    const currentSpecs = watch('specifications');
    const newSpecs = { ...currentSpecs };
    delete newSpecs[key];
    setValue('specifications', newSpecs);
  };

  console.log('AddEditProduct: mode:', mode, 'id:', id, 'isLoading:', isLoading, 'currentProduct:', currentProduct);
  
  // Show loading only if we're in edit mode and don't have the product yet
  if (mode === 'edit' && isLoading && !currentProduct) {
    return <LoadingSpinner message="Loading product..." />;
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(`${routes.admin.dashboard}/products`)} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {mode === 'add' ? 'Add New Product' : 'Edit Product'}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Product Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.category}>
                    <InputLabel>Category</InputLabel>
                    <Select {...field} label="Category">
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Price"
                    type="number"
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    InputProps={{
                      startAdornment: '$',
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="inStock"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    }
                    label="In Stock"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            {/* Images */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Product Images
              </Typography>
              <Controller
                name="images"
                control={control}
                render={({ field }) => (
                  <Box>
                    {field.value.map((image, index) => (
                      <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <TextField
                          fullWidth
                          label={`Image URL ${index + 1}`}
                          value={image}
                          onChange={(e) => {
                            const newImages = [...field.value];
                            newImages[index] = e.target.value;
                            field.onChange(newImages);
                          }}
                          error={!!errors.images?.[index]}
                          helperText={errors.images?.[index]?.message}
                        />
                        {field.value.length > 1 && (
                          <IconButton
                            onClick={() => handleRemoveImage(index)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                    <Button
                      startIcon={<Add />}
                      onClick={handleAddImage}
                      variant="outlined"
                    >
                      Add Image
                    </Button>
                  </Box>
                )}
              />
            </Grid>

            {/* Specifications */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Specifications
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      label="Specification Key"
                      value={specKey}
                      onChange={(e) => setSpecKey(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      label="Specification Value"
                      value={specValue}
                      onChange={(e) => setSpecValue(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleAddSpecification}
                      disabled={!specKey || !specValue}
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              <Controller
                name="specifications"
                control={control}
                render={({ field }) => (
                  <Box>
                    {Object.entries(field.value).map(([key, value]) => (
                      <Chip
                        key={key}
                        label={`${key}: ${value}`}
                        onDelete={() => handleRemoveSpecification(key)}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                    {errors.specifications && (
                      <Typography color="error" variant="body2">
                        {errors.specifications.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />
            </Grid>

            {/* Actions */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`${routes.admin.dashboard}/products`)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : mode === 'add' ? 'Create Product' : 'Update Product'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddEditProduct;
