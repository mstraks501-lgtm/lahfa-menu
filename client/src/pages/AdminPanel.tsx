import { useEffect, useId, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Trash2, Edit2, Plus, Save, X, LogOut, Search, FolderPlus, ImagePlus, Loader2 } from 'lucide-react';
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

interface ImagePickerProps {
  value: string;
  onChange: (imageUrl: string) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  className?: string;
}

const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('تعذر قراءة الصورة'));
      }
    };
    reader.onerror = () => reject(new Error('تعذر قراءة الصورة'));
    reader.readAsDataURL(file);
  });
}

function ImagePicker({ value, onChange, onUploadingChange, className = '' }: ImagePickerProps) {
  const inputId = useId();
  const [isUploading, setIsUploading] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const uploadImageMutation = trpc.menu.uploadImage.useMutation();

  useEffect(() => {
    setPreviewFailed(false);
  }, [value]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error('اختر صورة بصيغة JPG أو PNG أو WEBP');
      input.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error('حجم الصورة يجب ألا يتجاوز 15 ميجابايت');
      input.value = '';
      return;
    }

    setIsUploading(true);
    onUploadingChange?.(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const result = await uploadImageMutation.mutateAsync({ dataUrl });
      onChange(result.url);
      toast.success('تم رفع الصورة بنجاح');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'تعذر رفع الصورة';
      toast.error(`خطأ: ${message}`);
    } finally {
      setIsUploading(false);
      onUploadingChange?.(false);
      input.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {value && !previewFailed && (
        <img
          src={value}
          alt="معاينة الصورة"
          className="h-32 w-full rounded-md border border-[#D4A574]/30 object-cover"
          onError={() => setPreviewFailed(true)}
        />
      )}
      {value && previewFailed && (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-center text-xs text-red-300">
          تعذر عرض معاينة الصورة الحالية
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <label
          htmlFor={inputId}
          aria-disabled={isUploading}
          className={`inline-flex min-h-10 cursor-pointer items-center justify-center rounded-md bg-[#D4A574] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#C17A5C] ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
        >
          {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImagePlus className="mr-2 h-4 w-4" />}
          {isUploading ? 'جاري رفع الصورة...' : 'اختر صورة'}
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={isUploading}
          className="sr-only"
        />
        {value && (
          <Button
            type="button"
            variant="outline"
            onClick={() => onChange('')}
            disabled={isUploading}
            className="min-h-10 border-red-500/40 text-red-300 hover:bg-red-500/10 hover:text-red-200"
          >
            <X className="mr-2 h-4 w-4" />
            إزالة الصورة
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">JPG أو PNG أو WEBP — الحد الأقصى 15 ميجابايت</p>
    </div>
  );
}

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newItem, setNewItem] = useState({
    categoryId: '',
    name: '',
    nameAr: '',
    nameEn: '',
    price: 0,
    description: '',
    descriptionAr: '',
    descriptionEn: '',
    image: '',
  });
  const [newCategory, setNewCategory] = useState({
    name: '',
    nameAr: '',
    nameEn: '',
    image: '',
  });

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

  const addItemMutation = trpc.menu.addItem.useMutation({
    onSuccess: () => {
      toast.success('تم إضافة المنتج بنجاح');
      getItems.refetch();
      setShowAddItem(false);
      setNewItem({ categoryId: '', name: '', nameAr: '', nameEn: '', price: 0, description: '', descriptionAr: '', descriptionEn: '', image: '' });
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

  const updateCategoryMutation = trpc.menu.updateCategory.useMutation({
    onSuccess: () => {
      toast.success('تم تحديث الفئة بنجاح');
      getCategories.refetch();
      setEditingCategory(null);
    },
    onError: (error) => {
      toast.error(`خطأ: ${error.message}`);
    },
  });

  const addCategoryMutation = trpc.menu.addCategory.useMutation({
    onSuccess: () => {
      toast.success('تم إضافة الفئة بنجاح');
      getCategories.refetch();
      setShowAddCategory(false);
      setNewCategory({ name: '', nameAr: '', nameEn: '', image: '' });
    },
    onError: (error) => {
      toast.error(`خطأ: ${error.message}`);
    },
  });

  const deleteCategoryMutation = trpc.menu.deleteCategory.useMutation({
    onSuccess: () => {
      toast.success('تم حذف الفئة بنجاح');
      getCategories.refetch();
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
      const cleanedItem = {
        id: item.id,
        categoryId: item.categoryId,
        name: item.name || '',
        nameAr: item.nameAr || '',
        nameEn: item.nameEn || '',
        price: item.price || 0,
        description: item.description || '',
        descriptionAr: item.descriptionAr || '',
        descriptionEn: item.descriptionEn || '',
        image: item.image || '',
      };
      await updateItemMutation.mutateAsync(cleanedItem);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.categoryId) {
      toast.error('يرجى إدخال اسم المنتج واختيار الفئة');
      return;
    }
    setIsLoading(true);
    try {
      await addItemMutation.mutateAsync({
        categoryId: newItem.categoryId,
        name: newItem.name,
        nameAr: newItem.nameAr || newItem.name,
        nameEn: newItem.nameEn || '',
        price: newItem.price || 0,
        description: newItem.description || '',
        descriptionAr: newItem.descriptionAr || '',
        descriptionEn: newItem.descriptionEn || '',
        image: newItem.image || '',
      });
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

  const handleSaveCategory = async (category: Category) => {
    setIsLoading(true);
    try {
      await updateCategoryMutation.mutateAsync({
        id: category.id,
        name: category.name || '',
        nameAr: category.nameAr || '',
        nameEn: category.nameEn || '',
        image: category.image || '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name) {
      toast.error('يرجى إدخال اسم الفئة');
      return;
    }
    setIsLoading(true);
    try {
      await addCategoryMutation.mutateAsync({
        name: newCategory.name,
        nameAr: newCategory.nameAr || newCategory.name,
        nameEn: newCategory.nameEn || '',
        image: newCategory.image || '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const itemsInCategory = items.filter(i => i.categoryId === categoryId);
    const msg = itemsInCategory.length > 0
      ? `هل أنت متأكد من حذف هذه الفئة؟ سيتم حذف ${itemsInCategory.length} منتج أيضاً!`
      : 'هل أنت متأكد من حذف هذه الفئة؟';
    if (confirm(msg)) {
      setIsLoading(true);
      try {
        await deleteCategoryMutation.mutateAsync({ id: categoryId });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? (cat.nameAr || cat.name) : 'غير محدد';
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = (item.nameAr || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.nameEn || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'all' || item.categoryId === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A] text-foreground flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-[#1A1A1A] border-[#D4A574]/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#D4A574] mb-2">لوحة التحكم</h1>
            <p className="text-muted-foreground">LAHFA Maison Boutique Kafe</p>
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#D4A574]">إدارة المينو</h1>
            <p className="text-muted-foreground mt-1 text-sm">LAHFA Maison Boutique Kafe</p>
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
            خروج
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="p-3 bg-[#1A1A1A] border-[#D4A574]/20 text-center">
            <p className="text-2xl font-bold text-[#D4A574]">{items.length}</p>
            <p className="text-xs text-muted-foreground">منتج</p>
          </Card>
          <Card className="p-3 bg-[#1A1A1A] border-[#D4A574]/20 text-center">
            <p className="text-2xl font-bold text-[#D4A574]">{categories.length}</p>
            <p className="text-xs text-muted-foreground">فئة</p>
          </Card>
          <Card className="p-3 bg-[#1A1A1A] border-[#D4A574]/20 text-center">
            <p className="text-2xl font-bold text-[#D4A574]">{items.filter(i => i.image).length}</p>
            <p className="text-xs text-muted-foreground">مع صور</p>
          </Card>
          <Card className="p-3 bg-[#1A1A1A] border-[#D4A574]/20 text-center">
            <p className="text-2xl font-bold text-[#D4A574]">{items.filter(i => i.price > 0).length}</p>
            <p className="text-xs text-muted-foreground">مسعّر</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-[#D4A574]/20">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-4 py-3 font-semibold transition-colors text-sm ${
              activeTab === 'items'
                ? 'text-[#D4A574] border-b-2 border-[#D4A574]'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            المنتجات ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-3 font-semibold transition-colors text-sm ${
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
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="ابحث عن منتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#1A1A1A] border-[#D4A574]/30 text-foreground"
                />
              </div>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-[#1A1A1A] border border-[#D4A574]/30 rounded-md text-foreground text-sm"
              >
                <option value="all">كل الفئات</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nameAr || cat.name}</option>
                ))}
              </select>
              <Button
                onClick={() => setShowAddItem(!showAddItem)}
                className="bg-[#D4A574] hover:bg-[#C17A5C] text-black font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                منتج جديد
              </Button>
            </div>

            {/* Add New Item Form */}
            {showAddItem && (
              <Card className="p-4 bg-[#1A1A1A] border-[#D4A574]/40 border-2">
                <h3 className="text-lg font-semibold text-[#D4A574] mb-4">إضافة منتج جديد</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select
                    value={newItem.categoryId}
                    onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
                    className="px-3 py-2 bg-[#0F0F0F] border border-[#D4A574]/30 rounded-md text-foreground text-sm"
                  >
                    <option value="">اختر الفئة *</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nameAr || cat.name}</option>
                    ))}
                  </select>
                  <Input
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="اسم المنتج (تركي) *"
                    className="bg-[#0F0F0F] border-[#D4A574]/30"
                  />
                  <Input
                    value={newItem.nameAr}
                    onChange={(e) => setNewItem({ ...newItem, nameAr: e.target.value })}
                    placeholder="الاسم بالعربية"
                    className="bg-[#0F0F0F] border-[#D4A574]/30"
                  />
                  <Input
                    value={newItem.nameEn}
                    onChange={(e) => setNewItem({ ...newItem, nameEn: e.target.value })}
                    placeholder="الاسم بالإنجليزية"
                    className="bg-[#0F0F0F] border-[#D4A574]/30"
                  />
                  <Input
                    type="number"
                    value={newItem.price || ''}
                    onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                    placeholder="السعر (₺)"
                    className="bg-[#0F0F0F] border-[#D4A574]/30"
                  />
                  <ImagePicker
                    value={newItem.image}
                    onChange={(image) => setNewItem({ ...newItem, image })}
                    onUploadingChange={setIsUploadingImage}
                  />
                  <Input
                    value={newItem.descriptionAr}
                    onChange={(e) => setNewItem({ ...newItem, descriptionAr: e.target.value })}
                    placeholder="الوصف بالعربية (اختياري)"
                    className="bg-[#0F0F0F] border-[#D4A574]/30 md:col-span-2"
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={handleAddItem}
                    disabled={isLoading || isUploadingImage}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    إضافة
                  </Button>
                  <Button
                    onClick={() => setShowAddItem(false)}
                    variant="outline"
                    className="border-[#D4A574]/30"
                  >
                    <X className="w-4 h-4 mr-2" />
                    إلغاء
                  </Button>
                </div>
              </Card>
            )}

            {/* Items List */}
            <p className="text-sm text-muted-foreground">عرض {filteredItems.length} من {items.length} منتج</p>
            {filteredItems.length === 0 ? (
              <Card className="p-12 text-center bg-[#1A1A1A] border-[#D4A574]/20">
                <p className="text-muted-foreground text-lg">لا توجد منتجات</p>
              </Card>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="p-4 bg-[#1A1A1A] border-[#D4A574]/20 hover:border-[#D4A574]/50 transition-all"
                  >
                    {editingItem?.id === item.id ? (
                      /* Edit Mode */
                      <div className="space-y-3">
                        <Input
                          value={editingItem.name || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          placeholder="الاسم (تركي)"
                          className="text-sm bg-[#0F0F0F] border-[#D4A574]/30"
                        />
                        <Input
                          value={editingItem.nameAr || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, nameAr: e.target.value })}
                          placeholder="الاسم بالعربية"
                          className="text-sm bg-[#0F0F0F] border-[#D4A574]/30"
                        />
                        <Input
                          value={editingItem.nameEn || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, nameEn: e.target.value })}
                          placeholder="الاسم بالإنجليزية"
                          className="text-sm bg-[#0F0F0F] border-[#D4A574]/30"
                        />
                        <Input
                          type="number"
                          value={editingItem.price || 0}
                          onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                          placeholder="السعر"
                          className="text-sm bg-[#0F0F0F] border-[#D4A574]/30"
                        />
                        <textarea
                          value={editingItem.descriptionAr || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, descriptionAr: e.target.value })}
                          placeholder="الوصف بالعربية"
                          className="w-full text-sm p-2 bg-[#0F0F0F] border border-[#D4A574]/30 rounded text-foreground resize-none"
                          rows={2}
                        />
                        <ImagePicker
                          value={editingItem.image || ''}
                          onChange={(image) => setEditingItem({ ...editingItem, image })}
                          onUploadingChange={setIsUploadingImage}
                        />
                        <select
                          value={editingItem.categoryId}
                          onChange={(e) => setEditingItem({ ...editingItem, categoryId: e.target.value })}
                          className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#D4A574]/30 rounded-md text-foreground text-sm"
                        >
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nameAr || cat.name}</option>
                          ))}
                        </select>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveItem(editingItem)}
                            disabled={isLoading || isUploadingImage}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            حفظ
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingItem(null)}
                            className="flex-1 border-[#D4A574]/30"
                          >
                            <X className="w-4 h-4 mr-1" />
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div className="space-y-2">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.nameAr || item.name}
                            className="w-full h-28 object-cover rounded"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        )}
                        <div>
                          <p className="font-semibold text-base">{item.nameAr || item.name}</p>
                          {item.nameEn && <p className="text-xs text-muted-foreground">{item.nameEn}</p>}
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xl font-bold text-[#D4A574]">{item.price} ₺</p>
                          <span className="text-xs text-muted-foreground bg-[#0F0F0F] px-2 py-1 rounded">
                            {getCategoryName(item.categoryId)}
                          </span>
                        </div>
                        {item.descriptionAr && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{item.descriptionAr}</p>
                        )}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingItem(item)}
                            className="flex-1 border-[#D4A574]/30 text-[#D4A574] text-xs"
                          >
                            <Edit2 className="w-3 h-3 mr-1" />
                            تعديل
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={isLoading || isUploadingImage}
                            className="flex-1 text-xs"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
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
          <div className="space-y-4">
            <Button
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="bg-[#D4A574] hover:bg-[#C17A5C] text-black font-semibold"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              فئة جديدة
            </Button>

            {/* Add New Category Form */}
            {showAddCategory && (
              <Card className="p-4 bg-[#1A1A1A] border-[#D4A574]/40 border-2">
                <h3 className="text-lg font-semibold text-[#D4A574] mb-4">إضافة فئة جديدة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="اسم الفئة (تركي) *"
                    className="bg-[#0F0F0F] border-[#D4A574]/30"
                  />
                  <Input
                    value={newCategory.nameAr}
                    onChange={(e) => setNewCategory({ ...newCategory, nameAr: e.target.value })}
                    placeholder="الاسم بالعربية"
                    className="bg-[#0F0F0F] border-[#D4A574]/30"
                  />
                  <Input
                    value={newCategory.nameEn}
                    onChange={(e) => setNewCategory({ ...newCategory, nameEn: e.target.value })}
                    placeholder="الاسم بالإنجليزية"
                    className="bg-[#0F0F0F] border-[#D4A574]/30"
                  />
                  <ImagePicker
                    value={newCategory.image}
                    onChange={(image) => setNewCategory({ ...newCategory, image })}
                    onUploadingChange={setIsUploadingImage}
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={handleAddCategory}
                    disabled={isLoading || isUploadingImage}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    إضافة
                  </Button>
                  <Button
                    onClick={() => setShowAddCategory(false)}
                    variant="outline"
                    className="border-[#D4A574]/30"
                  >
                    <X className="w-4 h-4 mr-2" />
                    إلغاء
                  </Button>
                </div>
              </Card>
            )}

            {/* Categories Grid */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="p-4 bg-[#1A1A1A] border-[#D4A574]/20 hover:border-[#D4A574]/50 transition-all"
                >
                  {editingCategory?.id === category.id ? (
                    /* Edit Category Mode */
                    <div className="space-y-3">
                      <Input
                        value={editingCategory.name || ''}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        placeholder="الاسم (تركي)"
                        className="text-sm bg-[#0F0F0F] border-[#D4A574]/30"
                      />
                      <Input
                        value={editingCategory.nameAr || ''}
                        onChange={(e) => setEditingCategory({ ...editingCategory, nameAr: e.target.value })}
                        placeholder="الاسم بالعربية"
                        className="text-sm bg-[#0F0F0F] border-[#D4A574]/30"
                      />
                      <Input
                        value={editingCategory.nameEn || ''}
                        onChange={(e) => setEditingCategory({ ...editingCategory, nameEn: e.target.value })}
                        placeholder="الاسم بالإنجليزية"
                        className="text-sm bg-[#0F0F0F] border-[#D4A574]/30"
                      />
                      <ImagePicker
                        value={editingCategory.image || ''}
                        onChange={(image) => setEditingCategory({ ...editingCategory, image })}
                        onUploadingChange={setIsUploadingImage}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveCategory(editingCategory)}
                          disabled={isLoading || isUploadingImage}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          حفظ
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingCategory(null)}
                          className="flex-1 border-[#D4A574]/30"
                        >
                          <X className="w-4 h-4 mr-1" />
                          إلغاء
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* View Category Mode */
                    <div className="space-y-2">
                      {category.image && (
                        <img
                          src={category.image}
                          alt={category.nameAr || category.name}
                          className="w-full h-28 object-cover rounded"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      )}
                      <p className="font-semibold text-lg">{category.nameAr || category.name}</p>
                      {category.nameEn && <p className="text-sm text-muted-foreground">{category.nameEn}</p>}
                      <p className="text-xs text-muted-foreground">
                        {items.filter(i => i.categoryId === category.id).length} منتج
                      </p>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingCategory(category)}
                          className="flex-1 border-[#D4A574]/30 text-[#D4A574] text-xs"
                        >
                          <Edit2 className="w-3 h-3 mr-1" />
                          تعديل
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={isLoading || isUploadingImage}
                          className="flex-1 text-xs"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          حذف
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
