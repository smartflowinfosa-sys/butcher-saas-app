"use client";

import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Beef, Store, Tag, ClipboardList, LayoutGrid, User, MapPin, Phone, Wallet, Globe, Bell, MessageCircle, HelpCircle, FileText, Lock, Info, LogOut, ChevronLeft, X, Video } from 'lucide-react';
import CheckoutModal from './CheckoutModal';

export type Product = {
  id: number;
  name_ar: string;
  name_en: string;
  price: number;
  category_ar: string;
  category_en: string;
  isNew?: boolean;
  isBestSeller?: boolean;
};

export default function Storefront({
  storeName,
  isRtl,
  initialProducts
}: {
  storeName: string;
  isRtl: boolean;
  initialProducts: Product[];
}) {
  const categories = isRtl 
    ? ["الكل", "لحم غنم", "لحم بقر", "مفروم", "مشاوي", "دجاج", "عروض"] 
    : ["All", "Lamb", "Beef", "Minced", "BBQ", "Chicken", "Offers"];

  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // New Navigation States (Used in conditional rendering below line 110)
  const [activeTab, setActiveTab] = useState<'menu' | 'offers' | 'orders' | 'more'>('menu');
  const [offerSubTab, setOfferSubTab] = useState<'offers' | 'discount'>('offers');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const filteredProducts = initialProducts.filter(p => {
    if (activeCategory === "الكل" || activeCategory === "All") return true;
    return isRtl ? p.category_ar === activeCategory : p.category_en === activeCategory;
  });

  const totalCartItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => {
      const current = prev[productId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const newCart = { ...prev };
        delete newCart[productId];
        return newCart;
      }
      return { ...prev, [productId]: next };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24 font-sans">
      {/* 1. Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-red-700 flex items-center justify-center">
              <Beef className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">{storeName}</h1>
          </div>
          
          <button 
            onClick={() => setIsCheckoutOpen(true)}
            className="relative p-2 text-gray-600 hover:text-red-700 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalCartItems > 0 && (
              <span className="absolute top-1 right-1 bg-red-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white transition-all transform scale-100">
                {totalCartItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 2. Horizontal Category Tabs (Only show on 'menu' tab) */}
      {activeTab === 'menu' && (
        <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto">
            <div className="flex overflow-x-auto gap-2 px-4 py-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {categories.map((cat, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 active:scale-95 ${
                    activeCategory === cat 
                      ? 'bg-red-700 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        {/* --- MENU TAB --- */}
        {activeTab === 'menu' && (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {activeCategory === "الكل" || activeCategory === "All" ? (isRtl ? 'جميع المنتجات' : 'All Products') : activeCategory}
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {filteredProducts.map((item) => {
                const qty = cart[item.id] || 0;
                return (
                  <div 
                    key={item.id} 
                    className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
                  >
                    <div className="h-32 sm:h-36 w-full bg-gray-50 relative flex items-center justify-center overflow-hidden">
                      <Beef className="w-10 h-10 text-gray-200 group-hover:scale-110 transition-transform duration-500" />
                      {(item.isNew || item.isBestSeller) && (
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-red-700 shadow-sm border border-red-50">
                          {item.isNew ? (isRtl ? 'جديد' : 'New') : (isRtl ? 'الأكثر مبيعاً' : 'Best Seller')}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3 flex flex-col flex-grow">
                      <h3 className="text-sm font-bold text-gray-900 truncate mb-1" title={isRtl ? item.name_ar : item.name_en}>
                        {isRtl ? item.name_ar : item.name_en}
                      </h3>
                      <p className="text-xs text-gray-500 mb-3 flex-grow">
                        {isRtl ? '١ كيلو' : '1 kg'}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm md:text-base font-black text-red-700 flex items-center gap-1 dir-ltr">
                          {isRtl ? (
                            <>
                              <span>{item.price.toFixed(2)}</span>
                              <span className="text-[10px] md:text-xs font-bold">ر.س</span>
                            </>
                          ) : (
                            <>
                              <span className="text-[10px] md:text-xs font-bold">SAR</span>
                              <span>{item.price.toFixed(2)}</span>
                            </>
                          )}
                        </span>
                        
                        {qty === 0 ? (
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 rounded-full bg-red-700 text-white hover:bg-red-800 transition-colors flex items-center justify-center shadow-sm active:scale-95"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        ) : (
                          <div className="flex items-center bg-gray-100 rounded-full overflow-hidden shadow-inner h-8 border border-gray-200">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-5 text-center font-bold text-gray-900 text-xs">
                              {qty}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-full flex items-center justify-center text-red-700 hover:bg-gray-200 active:bg-gray-300 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredProducts.length === 0 && (
                 <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400">
                    <Beef className="w-16 h-16 text-gray-200 mb-4" />
                    <p>{isRtl ? 'لا توجد منتجات في هذا القسم حالياً.' : 'No products available in this category.'}</p>
                 </div>
              )}
            </div>
          </div>
        )}

        {/* --- OFFERS TAB --- */}
        {activeTab === 'offers' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{isRtl ? 'العروض والخصومات' : 'Offers & Discounts'}</h2>
            
            {/* Segmented Control */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button 
                onClick={() => setOfferSubTab('offers')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${offerSubTab === 'offers' ? 'bg-white text-red-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {isRtl ? 'العروض' : 'Offers'}
              </button>
              <button 
                onClick={() => setOfferSubTab('discount')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${offerSubTab === 'discount' ? 'bg-white text-red-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {isRtl ? 'خصم' : 'Discount'}
              </button>
            </div>
            
            {/* Conditional Sub-View */}
            {offerSubTab === 'offers' ? (
              <div className="space-y-4">
                {/* Dummy Offer Card 1 */}
                <div className="bg-white border border-red-100 rounded-xl p-4 flex gap-4 shadow-sm relative overflow-hidden group">
                  <div className={`absolute top-0 ${isRtl ? 'right-0 rounded-bl-xl' : 'left-0 rounded-br-xl'} bg-red-700 text-white text-[10px] font-bold px-3 py-1`}>
                    {isRtl ? 'عرض خاص' : 'Special Offer'}
                  </div>
                  <div className="w-20 h-20 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Tag className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-gray-900">{isRtl ? 'باقة المشاوي العائلية' : 'Family BBQ Package'}</h3>
                    <p className="text-sm text-gray-500 mb-2">{isRtl ? 'وفر ٣٠٪ على جميع أصناف الشواء' : 'Save 30% on all BBQ items'}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-red-700">199.00 {isRtl ? 'ر.س' : 'SAR'}</span>
                      <span className="text-sm text-gray-400 line-through">285.00 {isRtl ? 'ر.س' : 'SAR'}</span>
                    </div>
                  </div>
                </div>
                {/* Dummy Offer Card 2 */}
                <div className="bg-white border border-red-100 rounded-xl p-4 flex gap-4 shadow-sm relative overflow-hidden group">
                  <div className={`absolute top-0 ${isRtl ? 'right-0 rounded-bl-xl' : 'left-0 rounded-br-xl'} bg-red-700 text-white text-[10px] font-bold px-3 py-1`}>
                    {isRtl ? 'توفير' : 'Savings'}
                  </div>
                  <div className="w-20 h-20 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Beef className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-gray-900">{isRtl ? 'اطلب ٢ كيلو مفروم واحصل على نصف كيلو مجاناً' : 'Buy 2kg Minced, get 0.5kg Free'}</h3>
                    <p className="text-sm text-gray-500 mb-2">{isRtl ? 'عرض لفترة محدودة' : 'Limited time offer'}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-red-700">110.00 {isRtl ? 'ر.س' : 'SAR'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                <Tag className="w-16 h-16 text-gray-200 mb-4" />
                <p>{isRtl ? 'لا توجد خصومات حالياً.' : 'No discounts available currently.'}</p>
              </div>
            )}
          </div>
        )}

        {/* --- ORDERS TAB --- */}
        {activeTab === 'orders' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{isRtl ? 'سجل الطلبات' : 'Order History'}</h2>
            <div className="space-y-4">
              {/* Dummy Order 1 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:border-gray-300 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-50">
                  <div>
                    <h3 className="font-bold text-gray-900">{isRtl ? 'طلب #1042' : 'Order #1042'}</h3>
                    <p className="text-xs text-gray-500">12 Oct 2026 • 02:30 PM</p>
                  </div>
                  <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded">
                    {isRtl ? 'تم التوصيل' : 'Delivered'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{isRtl ? '٣ منتجات' : '3 Items'}</span>
                  <span className="font-black text-gray-900">150.00 {isRtl ? 'ر.س' : 'SAR'}</span>
                </div>
              </div>
              
              {/* Dummy Order 2 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:border-gray-300 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-50">
                  <div>
                    <h3 className="font-bold text-gray-900">{isRtl ? 'طلب #1038' : 'Order #1038'}</h3>
                    <p className="text-xs text-gray-500">05 Oct 2026 • 11:15 AM</p>
                  </div>
                  <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded">
                    {isRtl ? 'تم التوصيل' : 'Delivered'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{isRtl ? '١ منتج' : '1 Item'}</span>
                  <span className="font-black text-gray-900">65.00 {isRtl ? 'ر.س' : 'SAR'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- MORE TAB --- */}
        {activeTab === 'more' && (
          <div className="animate-in fade-in duration-300">
            {/* Top section: Socials */}
            <div className="bg-white rounded-2xl p-4 flex justify-center gap-6 mb-6 shadow-sm border border-gray-100">
              <button className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors">
                <MessageCircle className="w-6 h-6" />
              </button>
              <button className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-colors">
                <Video className="w-6 h-6" />
              </button>
            </div>

            {/* Group 1 */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4 divide-y divide-gray-100">
              <button onClick={() => setActiveModal('profile')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-right">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="font-bold text-gray-700">{isRtl ? 'حسابي' : 'My Account'}</span>
                </div>
                <ChevronLeft className="w-5 h-5 text-gray-300" />
              </button>
              <button onClick={() => setActiveModal('addresses')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-right">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="font-bold text-gray-700">{isRtl ? 'عناوين التوصيل' : 'Saved Addresses'}</span>
                </div>
                <ChevronLeft className="w-5 h-5 text-gray-300" />
              </button>
              <button onClick={() => setActiveModal('wallet')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-right">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-gray-500" />
                  <span className="font-bold text-gray-700">{isRtl ? 'المحفظة والرصيد' : 'Wallet & Balance'}</span>
                </div>
                <ChevronLeft className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            {/* Group 2 */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4 divide-y divide-gray-100">
              <div className="w-full flex items-center justify-between p-4 bg-white text-right">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <span className="font-bold text-gray-700">{isRtl ? 'لغة التطبيق' : 'App Language'}</span>
                </div>
                <div className="flex bg-gray-100 rounded-full p-1 dir-ltr">
                  <button className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${!isRtl ? 'bg-red-700 text-white' : 'text-gray-500'}`}>EN</button>
                  <button className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${isRtl ? 'bg-red-700 text-white' : 'text-gray-500'}`}>AR</button>
                </div>
              </div>
              <button onClick={() => setActiveModal('notifications')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-right">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-500" />
                  <span className="font-bold text-gray-700">{isRtl ? 'إعدادات الإشعارات' : 'Notification Settings'}</span>
                </div>
                <ChevronLeft className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            {/* Group 3 */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6 divide-y divide-gray-100">
              <button onClick={() => setActiveModal('contact')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-right">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-gray-500" />
                  <span className="font-bold text-gray-700">{isRtl ? 'تواصل معنا' : 'Contact Us'}</span>
                </div>
                <ChevronLeft className="w-5 h-5 text-gray-300" />
              </button>
              <button onClick={() => setActiveModal('faq')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-right">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-gray-500" />
                  <span className="font-bold text-gray-700">{isRtl ? 'الأسئلة الشائعة' : 'FAQs'}</span>
                </div>
                <ChevronLeft className="w-5 h-5 text-gray-300" />
              </button>
              <button onClick={() => setActiveModal('terms')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-right">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <span className="font-bold text-gray-700">{isRtl ? 'الشروط والأحكام' : 'Terms & Conditions'}</span>
                </div>
                <ChevronLeft className="w-5 h-5 text-gray-300" />
              </button>
              <button onClick={() => setActiveModal('privacy')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-right">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-gray-500" />
                  <span className="font-bold text-gray-700">{isRtl ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
                </div>
                <ChevronLeft className="w-5 h-5 text-gray-300" />
              </button>
              <button onClick={() => setActiveModal('about')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-right">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-gray-500" />
                  <span className="font-bold text-gray-700">{isRtl ? 'عن التطبيق' : 'About App'}</span>
                </div>
                <ChevronLeft className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            {/* Logout Button */}
            <button className="w-full bg-red-50 text-red-600 rounded-2xl p-4 font-bold flex justify-center items-center gap-2 mb-24 transition-colors hover:bg-red-100 active:bg-red-200">
              <LogOut className="w-5 h-5" />
              {isRtl ? 'تسجيل الخروج' : 'Logout'}
            </button>
          </div>
        )}

      </main>

      {/* 5. Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16 px-2">
          <button 
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'menu' ? 'text-red-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Store className={`w-6 h-6 mb-1 ${activeTab === 'menu' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className={`text-[10px] ${activeTab === 'menu' ? 'font-bold' : 'font-medium'}`}>{isRtl ? 'القائمة' : 'Menu'}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('offers')}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'offers' ? 'text-red-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Tag className={`w-6 h-6 mb-1 ${activeTab === 'offers' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className={`text-[10px] ${activeTab === 'offers' ? 'font-bold' : 'font-medium'}`}>{isRtl ? 'العروض' : 'Offers'}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'orders' ? 'text-red-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <ClipboardList className={`w-6 h-6 mb-1 ${activeTab === 'orders' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className={`text-[10px] ${activeTab === 'orders' ? 'font-bold' : 'font-medium'}`}>{isRtl ? 'الطلبات' : 'Orders'}</span>
          </button>

          <button 
            onClick={() => setActiveTab('more')}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'more' ? 'text-red-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <LayoutGrid className={`w-6 h-6 mb-1 ${activeTab === 'more' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className={`text-[10px] ${activeTab === 'more' ? 'font-bold' : 'font-medium'}`}>{isRtl ? 'المزيد' : 'More'}</span>
          </button>
        </div>
      </nav>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        cart={cart}
        products={initialProducts}
        isRtl={isRtl}
      />

      {/* Dynamic Settings Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full md:w-[400px] h-[80vh] md:h-auto md:max-h-[80vh] rounded-t-2xl md:rounded-2xl shadow-xl flex flex-col animate-in slide-in-from-bottom-full md:slide-in-from-bottom-10 duration-300">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 capitalize">
                {activeModal.replace('-', ' ')}
              </h2>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex-grow overflow-y-auto">
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3 min-h-[300px]">
                <Info className="w-12 h-12 text-gray-200" />
                <p className="font-medium text-center">
                  {isRtl ? 'سيتم إضافة المحتوى قريباً' : 'Content coming soon'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
