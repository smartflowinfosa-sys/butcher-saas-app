"use client";

import { useState } from 'react';
import { X, MapPin, Navigation, Store, Truck, CheckCircle2 } from 'lucide-react';
import { Product } from './Storefront';

type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  cart: Record<number, number>;
  products: Product[];
  isRtl: boolean;
};

export default function CheckoutModal({ isOpen, onClose, cart, products, isRtl }: CheckoutModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [neighborhood, setNeighborhood] = useState('');
  const [street, setStreet] = useState('');
  
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhone(val);
    if (val && !/^05\d{8}$/.test(val)) {
      setPhoneError('يجب أن يبدأ الرقم بـ 05 ويتكون من 10 أرقام');
    } else {
      setPhoneError('');
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLocating(false);
        },
        () => {
          alert(isRtl ? 'تعذر تحديد الموقع' : 'Could not fetch location');
          setIsLocating(false);
        }
      );
    }
  };

  if (!isOpen) return null;

  // Calculate Total
  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find(p => p.id === Number(id));
    return sum + (product ? product.price * qty : 0);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^05\d{8}$/.test(phone)) {
      setPhoneError('يجب أن يبدأ الرقم بـ 05 ويتكون من 10 أرقام');
      return;
    }
    // Proceed with order submission...
    alert(isRtl ? 'تم تأكيد الطلب بنجاح!' : 'Order confirmed successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div 
        className={`bg-white w-full max-w-lg h-[90vh] md:h-auto md:max-h-[85vh] rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-full duration-300 ${isRtl ? 'dir-rtl' : 'dir-ltr'}`}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-900">{isRtl ? 'إتمام الطلب' : 'Checkout'}</h2>
          <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-sm">1</span>
                {isRtl ? 'معلومات العميل' : 'Customer Info'}
              </h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{isRtl ? 'الاسم' : 'Name'} *</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent bg-white shadow-sm"
                  placeholder={isRtl ? 'الاسم الثلاثي' : 'Full Name'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{isRtl ? 'رقم الجوال' : 'Phone Number'} *</label>
                <input 
                  type="tel" 
                  required 
                  value={phone}
                  onChange={handlePhoneChange}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:border-transparent bg-white shadow-sm ${phoneError ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-red-700'}`}
                  placeholder="05XXXXXXXX"
                  dir="ltr"
                  style={{ textAlign: 'left' }}
                />
                {phoneError && <p className="mt-1 text-sm text-red-600 font-medium">{phoneError}</p>}
              </div>
            </div>

            {/* Order Type */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-sm">2</span>
                {isRtl ? 'طريقة الاستلام' : 'Delivery Method'}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${orderType === 'pickup' ? 'border-red-700 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-500 hover:border-red-200'}`}
                >
                  <Store className="w-6 h-6 mb-2" />
                  <span className="font-bold">{isRtl ? 'استلام من الفرع' : 'Pickup'}</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${orderType === 'delivery' ? 'border-red-700 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-500 hover:border-red-200'}`}
                >
                  <Truck className="w-6 h-6 mb-2" />
                  <span className="font-bold">{isRtl ? 'توصيل' : 'Delivery'}</span>
                </button>
              </div>
            </div>

            {/* Delivery Details (Only if delivery) */}
            {orderType === 'delivery' && (
              <div className="space-y-4 pt-4 border-t border-gray-200 animate-in fade-in zoom-in-95 duration-300">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-sm">3</span>
                  {isRtl ? 'عنوان التوصيل' : 'Delivery Address'}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{isRtl ? 'اسم الحي' : 'Neighborhood'} *</label>
                    <input 
                      type="text" 
                      required 
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-700 bg-white shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{isRtl ? 'اسم الشارع' : 'Street'} *</label>
                    <input 
                      type="text" 
                      required 
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-700 bg-white shadow-sm"
                    />
                  </div>
                </div>

                <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col items-center justify-center p-6 gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${location ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-700'}`}>
                    {location ? <CheckCircle2 className="w-8 h-8" /> : <MapPin className="w-8 h-8" />}
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-800 mb-1">
                      {location 
                        ? (isRtl ? 'تم تحديد الموقع بنجاح' : 'Location acquired successfully')
                        : (isRtl ? 'تحديد موقع التوصيل' : 'Determine Delivery Location')}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      {location
                        ? (isRtl ? 'سيتم استخدام هذا الموقع لتوصيل طلبك بدقة' : 'This location will be used to deliver your order accurately')
                        : (isRtl ? 'يرجى السماح بالوصول لموقعك لتسهيل عملية التوصيل' : 'Please allow location access to facilitate delivery')}
                    </p>
                    
                    <button 
                      type="button" 
                      onClick={handleLocateMe}
                      disabled={isLocating}
                      className={`flex items-center gap-2 mx-auto px-6 py-2.5 rounded-lg font-bold transition-all active:scale-95 ${
                        location 
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-red-700 text-white hover:bg-red-800'
                      } ${isLocating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                      {location 
                        ? (isRtl ? 'تحديث الموقع' : 'Update Location')
                        : (isRtl ? 'تحديد موقعي عبر GPS' : 'Locate me via GPS')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Sticky Footer */}
        <div className="bg-white border-t border-gray-100 p-6 sticky bottom-0 z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-gray-600">{isRtl ? 'الإجمالي' : 'Total'}</span>
            <span className="text-2xl font-black text-red-700 flex items-center gap-1" dir="ltr">
              {isRtl ? (
                <><span>{total.toFixed(2)}</span><span className="text-sm">ر.س</span></>
              ) : (
                <><span className="text-sm">SAR</span><span>{total.toFixed(2)}</span></>
              )}
            </span>
          </div>
          <button 
            type="submit" 
            form="checkout-form"
            disabled={total === 0 || !!phoneError}
            className="w-full bg-red-700 hover:bg-red-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-red-700/20 transition-all active:scale-95 flex justify-center items-center gap-2"
          >
            {isRtl ? 'تأكيد الطلب' : 'Confirm Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
