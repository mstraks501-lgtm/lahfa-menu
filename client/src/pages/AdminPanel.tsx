import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Trash2, Edit2, Plus, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  nameAr: string;
  nameEn: string;
  price: number;
  description?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  image?: string;
}

interface Category {
  id: string;
  name: string;
  nameAr: string;
  nameEn: string;
  image?: string;
}

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({});
  const [isLoading, setIsLoading] = useState(false);

  const getItems = trpc.menu.getItems.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const getCategories = trpc.menu.getCategories.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const updateItemMutation = trpc.menu.updateItem.useMutation({
    onSuccess: () => {
      toast.success('تم تحديث المنتج بنجاح');
      getItems.refetch();
      setEditingItem(null);
    },
    onError: (error) => {
      toast.error(`خطأ: ${error.message}`);
    },
  });

  const deleteItemMutation = trpc.menu.deleteItem.useMutation({
    onSuccess: () => {
      toast.success('تم حذف المنتج بنجاح');
      getItems.refetch();
    },
    onError: (error) => {
      toast.error(`خطأ: ${error.message}`);
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
      toast.success('تم تسجيل الدخول بنجاح');
    } else {
      toast.error('كلمة المرور غير صحيحة');
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-card border-border">
          <h1 className="text-3xl font-bold mb-6 text-center">لوحة التحكم</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">كلمة المرور</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              دخول
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">إدارة المينو</h1>
          <Button
            variant="outline"
            onClick={() => {
              setIsAuthenticated(false);
              setPassword('');
            }}
          >
            تسجيل الخروج
          </Button>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">المنتجات ({items.length})</h2>

          {items.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              لا توجد منتجات
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="p-4 bg-card border-border hover:border-accent transition-colors"
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
                        className="text-sm"
                      />
                      <Input
                        value={editingItem.nameEn || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            nameEn: e.target.value,
                          })
                        }
                        placeholder="الاسم بالإنجليزية"
                        className="text-sm"
                      />
                      <Input
                        type="number"
                        value={editingItem.price || 0}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            price: parseFloat(e.target.value),
                          })
                        }
                        placeholder="السعر"
                        className="text-sm"
                      />
                      <textarea
                        value={editingItem.descriptionAr || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            descriptionAr: e.target.value,
                          })
                        }
                        placeholder="الوصف بالعربية"
                        className="w-full text-sm p-2 bg-background border border-border rounded"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveItem(editingItem as MenuItem)}
                          disabled={isLoading}
                          className="flex-1"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          حفظ
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingItem(null)}
                          className="flex-1"
                        >
                          <X className="w-4 h-4 mr-2" />
                          إلغاء
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="space-y-2">
                      <div>
                        <p className="font-semibold text-lg">{item.nameAr}</p>
                        <p className="text-sm text-muted-foreground">{item.nameEn}</p>
                      </div>
                      <p className="text-xl font-bold text-accent">{item.price} ₺</p>
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
                          className="flex-1"
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
      </div>
    </div>
  );
}
