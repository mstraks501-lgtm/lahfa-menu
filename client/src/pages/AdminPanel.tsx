import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Trash2, Edit2, Plus, Save, X, LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  nameAr: string;
  nameEn: string;
  price: number;
  description: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
}

interface Category {
  id: string;
  name: string;
  nameAr: string;
  nameEn: string;
  image: string;
}

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');
  const [searchTerm, setSearchTerm] = useState('');

  const getItems = trpc.menu.getItems.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const getCategories = trpc.menu.getCategories.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const updateItemMutation = trpc.menu.updateItem.useMutation({
    onSuccess: () => {
      toast.success('✅ تم تحديث المنتج بنجاح');
      getItems.refetch();
      setEditingItem(null);
    },
    onError: (error) => {
      toast.error(`❌ خطأ: ${error.message}`);
    },
  });

  const deleteItemMutation = trpc.menu.deleteItem.useMutation({
    onSuccess: () => {
      toast.success('✅ تم حذف المنتج بنجاح');
      getItems.refetch();
    },
    onError: (error) => {
      toast.error(`❌ خطأ: ${error.message}`);
    },
  });

  useEffect(() => {
    if (getItems.data) {
      setItems(getItems.data);
    }
  }, [getItems.data]);

  useEffect(() => {
    if (getCategories.data) {
      setCategories(getCategories.data);
    }
  }, [getCategories.data]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'lahfa2024') {
      setIsAuthenticated(true);
      toast.success('✅ تم تسجيل الدخول بنجاح');
    } else {
      toast.error('❌ كلمة المرور غير صحيحة');
    }
  };

  const handleSaveItem = async (item: MenuItem) => {
    setIsLoading(true);
    try {
      await updateItemMutation.mutateAsync(item);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      setIsLoading(true);
      try {
        await deleteItemMutation.mutateAsync({ id: itemId });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredItems = items.filter(item =>
    item.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A] text-foreground flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-[#1A1A1A] border-[#D4A574]/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#D4A574] mb-2">لوحة التحكم</h1>
            <p className="text-muted-foreground">LAHFA Admin Panel</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">كلمة المرور</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="w-full bg-[#0F0F0F] border-[#D4A574]/30 text-foreground"
              />
            </div>
            <Button type="submit" className="w-full bg-[#D4A574] hover:bg-[#C17A5C] text-black font-semibold">
              دخول
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A] text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#D4A574]">إدارة المينو</h1>
            <p className="text-muted-foreground mt-1">LAHFA Maison Boutique Kafe</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setIsAuthenticated(false);
              setPassword('');
            }}
            className="border-[#D4A574] text-[#D4A574] hover:bg-[#D4A574]/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            تسجيل الخروج
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-[#D4A574]/20">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'items'
                ? 'text-[#D4A574] border-b-2 border-[#D4A574]'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            المنتجات ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'categories'
                ? 'text-[#D4A574] border-b-2 border-[#D4A574]'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            الفئات ({categories.length})
          </button>
        </div>

        {/* Items Tab */}
        {activeTab === 'items' && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-[#1A1A1A] border-[#D4A574]/30 text-foreground"
              />
              <Button className="bg-[#D4A574] hover:bg-[#C17A5C] text-black font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                منتج جديد
              </Button>
            </div>

            {/* Items Grid */}
            {filteredItems.length === 0 ? (
              <Card className="p-12 text-center bg-[#1A1A1A] border-[#D4A574]/20">
                <p className="text-muted-foreground text-lg">لا توجد منتجات</p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="p-4 bg-[#1A1A1A] border-[#D4A574]/20 hover:border-[#D4A574]/50 transition-all"
                  >
                    {editingItem?.id === item.id ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <Input
                          value={editingItem.nameAr || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              nameAr: e.target.value,
                            })
                          }
                          placeholder="الاسم بالعربية"
                          className="text-sm bg-[#0F0F0F] border-[#D4A574]/30"
                        />
                        <Input
                          value={editingItem.nameEn || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              nameEn: e.target.value || '',
                            })
                          }
                          placeholder="الاسم بالإنجليزية"
                          className="text-sm bg-[#0F0F0F] border-[#D4A574]/30"
                        />
                        <Input
                          type="number"
                          value={editingItem.price || 0}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              price: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="السعر"
                          className="text-sm bg-[#0F0F0F] border-[#D4A574]/30"
                        />
                        <textarea
                          value={editingItem.descriptionAr || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              descriptionAr: e.target.value || '',
                            })
                          }
                          placeholder="الوصف بالعربية"
                          className="w-full text-sm p-2 bg-[#0F0F0F] border border-[#D4A574]/30 rounded text-foreground"
                        />
                        <Input
                          value={editingItem.image || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              image: e.target.value || '',
                            })
                          }
                          placeholder="رابط الصورة"
                          className="text-sm bg-[#0F0F0F] border-[#D4A574]/30"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveItem(editingItem as MenuItem)}
                            disabled={isLoading}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            حفظ
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingItem(null)}
                            className="flex-1 border-[#D4A574]/30"
                          >
                            <X className="w-4 h-4 mr-2" />
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="space-y-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.nameAr}
                            className="w-full h-32 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-lg">{item.nameAr}</p>
                          <p className="text-sm text-muted-foreground">{item.nameEn}</p>
                        </div>
                        <p className="text-2xl font-bold text-[#D4A574]">{item.price} ₺</p>
                        {item.descriptionAr && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.descriptionAr}
                          </p>
                        )}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingItem(item)}
                            className="flex-1 border-[#D4A574]/30 text-[#D4A574]"
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            تعديل
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={isLoading}
                            className="flex-1"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            حذف
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <Button className="bg-[#D4A574] hover:bg-[#C17A5C] text-black font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              فئة جديدة
            </Button>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="p-4 bg-[#1A1A1A] border-[#D4A574]/20 hover:border-[#D4A574]/50 transition-all"
                >
                  {category.image && (
                    <img
                      src={category.image}
                      alt={category.nameAr}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                  )}
                  <p className="font-semibold text-lg mb-1">{category.nameAr}</p>
                  <p className="text-sm text-muted-foreground mb-4">{category.nameEn}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-[#D4A574]/30 text-[#D4A574]"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      حذف
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
