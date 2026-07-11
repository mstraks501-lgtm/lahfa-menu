import { useState } from 'react';
import { useMenuStorage } from '@/hooks/useMenuStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, Edit2, Plus, LogOut, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export function AdminDashboard() {
  const { data, isLoaded, addProduct, updateProduct, deleteProduct, updateCategory, resetData } =
    useMenuStorage();
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
  });

  if (!isLoaded || !data) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem('lahfa_admin_authenticated');
    navigate('/');
    toast.success('تم تسجيل الخروج');
  };

  const handleAddProduct = () => {
    if (!selectedCategory || !newProduct.name || newProduct.price === 0) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    addProduct(selectedCategory, {
      name: newProduct.name,
      description: newProduct.description || null,
      price: newProduct.price,
      image: newProduct.image || null,
    });

    setNewProduct({ name: '', description: '', price: 0, image: '' });
    toast.success('تم إضافة المنتج بنجاح');
  };

  const handleUpdateProduct = () => {
    if (!selectedCategory || !editingProduct) return;

    updateProduct(selectedCategory, editingProduct.id, {
      name: editingProduct.name,
      description: editingProduct.description,
      price: editingProduct.price,
      image: editingProduct.image,
    });

    setEditingProduct(null);
    toast.success('تم تحديث المنتج بنجاح');
  };

  const handleDeleteProduct = (productId: number) => {
    if (!selectedCategory) return;

    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      deleteProduct(selectedCategory, productId);
      toast.success('تم حذف المنتج بنجاح');
    }
  };

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من إعادة تعيين جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء')) {
      resetData();
      setSelectedCategory(null);
      toast.success('تم إعادة تعيين البيانات');
    }
  };

  const categoryProducts = selectedCategory ? data.products[selectedCategory] || [] : [];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-accent">لوحة التحكم</h1>
            <p className="text-muted-foreground">Admin Dashboard</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="gap-2 border-border hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>

        <Tabs defaultValue="products" className="space-y-4">
          <TabsList className="bg-card border-border">
            <TabsTrigger value="products">المنتجات</TabsTrigger>
            <TabsTrigger value="categories">الفئات</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category List */}
              <div className="md:col-span-1">
                <Card className="bg-card border-border p-4">
                  <h3 className="font-semibold mb-4">الفئات</h3>
                  <div className="space-y-2">
                    {data.categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setEditingProduct(null);
                          setNewProduct({ name: '', description: '', price: 0, image: '' });
                        }}
                        className={`w-full text-left p-2 rounded transition-colors ${
                          selectedCategory === cat.id
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-secondary'
                        }`}
                      >
                        <p className="text-sm font-medium">{cat.name_ar}</p>
                        <p className="text-xs text-muted-foreground">
                          ({categoryProducts.length} منتج)
                        </p>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Products List and Editor */}
              <div className="md:col-span-3 space-y-4">
                {selectedCategory && (
                  <>
                    {/* Add New Product */}
                    <Card className="bg-card border-border p-4">
                      <h3 className="font-semibold mb-4">إضافة منتج جديد</h3>
                      <div className="space-y-3">
                        <Input
                          placeholder="اسم المنتج"
                          value={newProduct.name}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, name: e.target.value })
                          }
                          className="bg-input border-border"
                        />
                        <Textarea
                          placeholder="الوصف (اختياري)"
                          value={newProduct.description}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, description: e.target.value })
                          }
                          className="bg-input border-border"
                          rows={2}
                        />
                        <Input
                          type="number"
                          placeholder="السعر (TL)"
                          value={newProduct.price}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
                          }
                          className="bg-input border-border"
                        />
                        <Input
                          placeholder="رابط الصورة (اختياري)"
                          value={newProduct.image}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, image: e.target.value })
                          }
                          className="bg-input border-border"
                        />
                        <Button
                          onClick={handleAddProduct}
                          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          إضافة المنتج
                        </Button>
                      </div>
                    </Card>

                    {/* Products List */}
                    <div className="space-y-2">
                      {categoryProducts.map((product) => (
                        <Card
                          key={product.id}
                          className="bg-card border-border p-4 hover:bg-secondary transition-colors"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-foreground">{product.name}</h4>
                              {product.description && (
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {product.description}
                                </p>
                              )}
                              <p className="text-sm text-accent font-semibold mt-1">
                                {product.price} TL
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingProduct(product)}
                                className="p-2 hover:bg-secondary rounded transition-colors"
                              >
                                <Edit2 className="h-4 w-4 text-accent" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 hover:bg-secondary rounded transition-colors"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card className="bg-card border-border p-4">
              <h3 className="font-semibold mb-4">الفئات</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.categories.map((cat) => (
                  <Card key={cat.id} className="bg-secondary border-border p-4">
                    <h4 className="font-semibold text-foreground mb-2">{cat.name_ar}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{cat.name_en}</p>
                    <p className="text-xs text-muted-foreground">
                      عدد المنتجات: {(data.products[cat.id] || []).length}
                    </p>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-card border-border p-4">
              <h3 className="font-semibold mb-4">الإعدادات</h3>
              <div className="space-y-4">
                <div className="p-4 bg-secondary rounded">
                  <h4 className="font-semibold text-foreground mb-2">إعادة تعيين البيانات</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    استعادة جميع البيانات إلى الحالة الافتراضية. لا يمكن التراجع عن هذا الإجراء.
                  </p>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="gap-2 border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <RotateCcw className="h-4 w-4" />
                    إعادة تعيين
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>تعديل المنتج</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <Input
                placeholder="اسم المنتج"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
                className="bg-input border-border"
              />
              <Textarea
                placeholder="الوصف"
                value={editingProduct.description || ''}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, description: e.target.value })
                }
                className="bg-input border-border"
                rows={3}
              />
              <Input
                type="number"
                placeholder="السعر (TL)"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })
                }
                className="bg-input border-border"
              />
              <Input
                placeholder="رابط الصورة"
                value={editingProduct.image || ''}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, image: e.target.value })
                }
                className="bg-input border-border"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleUpdateProduct}
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  حفظ التعديلات
                </Button>
                <Button
                  onClick={() => setEditingProduct(null)}
                  variant="outline"
                  className="flex-1 border-border"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
