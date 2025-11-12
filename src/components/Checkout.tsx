import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Package, CreditCard, Sparkles, Heart } from 'lucide-react';
import type { CartItem } from '../types';
import { usePaymentMethods } from '../hooks/usePaymentMethods';

interface CheckoutProps {
  cartItems: CartItem[];
  totalPrice: number;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, totalPrice, onBack }) => {
  const { paymentMethods } = usePaymentMethods();
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  
  // Customer Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Shipping Details
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  
  // Payment
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  React.useEffect(() => {
    if (paymentMethods.length > 0 && !selectedPaymentMethod) {
      setSelectedPaymentMethod(paymentMethods[0].id);
    }
  }, [paymentMethods, selectedPaymentMethod]);

  // Shipping fee will be discussed with buyer via chat
  const finalTotal = totalPrice;

  const isDetailsValid = 
    fullName.trim() !== '' &&
    email.trim() !== '' &&
    phone.trim() !== '' &&
    address.trim() !== '' &&
    city.trim() !== '' &&
    state.trim() !== '' &&
    zipCode.trim() !== '' &&
    country.trim() !== '';

  const handleProceedToPayment = () => {
    if (isDetailsValid) {
      setStep('payment');
    }
  };

  const handlePlaceOrder = () => {
    const paymentMethod = paymentMethods.find(pm => pm.id === selectedPaymentMethod);
    
    // Get current date and time
    const now = new Date();
    const dateTimeStamp = now.toLocaleString('en-PH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    
    const orderDetails = `
🧪 MY PEPTIDE JOURNEY - NEW ORDER

📅 ORDER DATE & TIME
${dateTimeStamp}

👤 CUSTOMER INFORMATION
Name: ${fullName}
Email: ${email}
Phone: ${phone}

📦 SHIPPING ADDRESS
${address}
${city}, ${state} ${zipCode}
${country}

🛒 ORDER DETAILS
${cartItems.map(item => {
  let line = `• ${item.product.name}`;
  if (item.variation) {
    line += ` (${item.variation.name})`;
  }
  line += ` x${item.quantity} - ₱${(item.price * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 0 })}`;
  line += `\n  Purity: ${item.product.purity_percentage}%`;
  return line;
}).join('\n\n')}

💰 PRICING
Product Total: ₱${totalPrice.toLocaleString('en-PH', { minimumFractionDigits: 0 })}
Shipping Fee: To be discussed

💳 PAYMENT METHOD
${paymentMethod?.name || 'N/A'}
${paymentMethod ? `Account: ${paymentMethod.account_number}` : ''}


Please confirm this order. Thank you!
    `.trim();

    // Send order to Facebook Messenger
    const facebookPageId = '61573812453289';
    const encodedMessage = encodeURIComponent(orderDetails);
    const messengerUrl = `https://m.me/${facebookPageId}?text=${encodedMessage}`;
    
    // Open Facebook Messenger
    window.open(messengerUrl, '_blank');
    
    // Show confirmation
    setStep('confirmation');
  };

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 text-center border-2 border-green-100">
            <div className="bg-gradient-to-br from-green-400 to-green-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
              <ShieldCheck className="w-14 h-14 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-2 flex-wrap">
              <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">Order Sent!</span>
              <Sparkles className="w-7 h-7 text-yellow-500" />
            </h1>
            <p className="text-gray-600 mb-8 text-base md:text-lg leading-relaxed">
              Your order has been sent to our Facebook Messenger. 
              <Heart className="inline w-5 h-5 text-pink-500 mx-1" />
              We will confirm your order and send you the payment details shortly!
            </p>
            
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-6 mb-8 text-left border-2 border-teal-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                What happens next? 
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </h3>
              <ul className="space-y-3 text-sm md:text-base text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <span>We'll confirm your order on Facebook Messenger within 24 hours</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <span>Send payment via your selected method</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <span>Products carefully packaged and shipped</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">4️⃣</span>
                  <span>Delivery in 3-5 business days 🚚</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                window.location.href = '/';
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5 animate-pulse" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'details') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-6 md:py-8">
        <div className="container mx-auto px-3 md:px-4 max-w-6xl">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 md:mb-6 flex items-center gap-2 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm md:text-base">Back to Cart</span>
          </button>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 flex items-center gap-2">
            Checkout
            <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-yellow-500" />
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* Customer Information */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 md:p-6 border-2 border-teal-100">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-2 rounded-xl">
                    <Package className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  Customer Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="input-field"
                      placeholder="Juan Dela Cruz"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                      placeholder="juan@gmail.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-field"
                      placeholder="09XX XXX XXXX"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 md:p-6 border-2 border-purple-100">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                  <span className="text-2xl">📦</span>
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="input-field"
                      placeholder="123 Rizal Street, Brgy. San Antonio"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="input-field"
                        placeholder="Quezon City"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Province *
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="input-field"
                        placeholder="Metro Manila"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP/Postal Code *
                      </label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="input-field"
                        placeholder="1100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="input-field"
                        placeholder="Philippines"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={!isDetailsValid}
                className={`w-full py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all transform shadow-lg ${
                  isDetailsValid
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white hover:scale-105 hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Proceed to Payment ✨
              </button>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-5 md:p-6 sticky top-24 border-2 border-pink-100">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                  Order Summary
                  <Heart className="w-5 h-5 text-pink-500 animate-pulse" />
                </h2>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map((item, index) => (
                    <div key={index} className="pb-4 border-b border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm">{item.product.name}</h4>
                          {item.variation && (
                            <p className="text-xs text-teal-600 mt-1">{item.variation.name}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {item.product.purity_percentage}% Purity
                          </p>
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">₱{totalPrice.toLocaleString('en-PH', { minimumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-xs">
                    <span>Shipping</span>
                    <span className="font-medium text-teal-600">To be discussed via chat</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-teal-600">
                        ₱{finalTotal.toLocaleString('en-PH', { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right italic">Shipping fee will be discussed via chat</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Payment Step
  const paymentMethodInfo = paymentMethods.find(pm => pm.id === selectedPaymentMethod);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-6 md:py-8">
      <div className="container mx-auto px-3 md:px-4 max-w-6xl">
        <button
          onClick={() => setStep('details')}
          className="text-blue-600 hover:text-blue-700 font-medium mb-4 md:mb-6 flex items-center gap-2 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm md:text-base">Back to Details</span>
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 flex items-center gap-2">
          Payment
          <CreditCard className="w-6 h-6 md:w-7 md:h-7 text-teal-600" />
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Payment Method Selection */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 md:p-6 border-2 border-green-100">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                <div className="bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-xl">
                  <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                Payment Method
              </h2>
              
              <div className="grid grid-cols-1 gap-4 mb-6">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-teal-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{method.name}</p>
                        <p className="text-sm text-gray-500">{method.account_name}</p>
                      </div>
                    </div>
                    {selectedPaymentMethod === method.id && (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {paymentMethodInfo && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>
                  <div className="space-y-2 text-sm text-gray-700 mb-4">
                    <p><strong>Account Number:</strong> {paymentMethodInfo.account_number}</p>
                    <p><strong>Account Name:</strong> {paymentMethodInfo.account_name}</p>
                    <p><strong>Amount to Pay:</strong> <span className="text-xl font-bold text-teal-600">₱{finalTotal.toLocaleString('en-PH', { minimumFractionDigits: 0 })}</span></p>
                  </div>
                  
                  {paymentMethodInfo.qr_code_url && (
                    <div className="flex justify-center">
                      <div className="bg-white p-4 rounded-lg">
                        <img
                          src={paymentMethodInfo.qr_code_url}
                          alt="Payment QR Code"
                          className="w-48 h-48 object-contain"
                        />
                        <p className="text-xs text-center text-gray-500 mt-2">Scan to pay</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 md:p-6 border-2 border-pink-100">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📝</span>
                Order Notes (Optional)
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-field"
                rows={4}
                placeholder="Any special instructions or notes for your order..."
              />
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:via-green-600 hover:to-green-700 text-white py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
              Send Order via Messenger
            </button>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-5 md:p-6 sticky top-24 border-2 border-teal-100">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                Final Summary
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </h2>
              
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm">
                <p className="font-semibold text-gray-900 mb-2">{fullName}</p>
                <p className="text-gray-600">{email}</p>
                <p className="text-gray-600">{phone}</p>
                <div className="mt-3 pt-3 border-t border-gray-200 text-gray-600">
                  <p>{address}</p>
                  <p>{city}, {state} {zipCode}</p>
                  <p>{country}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">₱{totalPrice.toLocaleString('en-PH', { minimumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-xs">
                  <span>Shipping</span>
                  <span className="font-medium text-blue-600">To be discussed via chat</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₱{finalTotal.toLocaleString('en-PH', { minimumFractionDigits: 0 })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right italic">Shipping fee will be discussed via chat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
