import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateExternalLink, useAllExternalLinks, useDeleteExternalLink } from "@/hooks/useExternalLinks";
import { getCountryByCode } from "@/lib/countries";
import { getServicesByCountry } from "@/lib/gccShippingServices";
import { getServiceBranding } from "@/lib/serviceLogos";
import { CHALETS } from "@/lib/data";
import { 
  Link, 
  Copy, 
  ExternalLink, 
  Trash2, 
  Calendar,
  DollarSign,
  Package,
  Hash,
  MapPin,
  Users,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ExternalLinkGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createLink = useCreateExternalLink();
  const { data: allLinks, refetch } = useAllExternalLinks();
  const deleteLink = useDeleteExternalLink();

  // Form states
  const [selectedType, setSelectedType] = useState<'shipping' | 'chalet'>('shipping');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [packageDescription, setPackageDescription] = useState('');
  const [codAmount, setCodAmount] = useState('');
  const [selectedChalet, setSelectedChalet] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [nights, setNights] = useState('');
  const [expiresInDays, setExpiresInDays] = useState('30');
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');

  const countryData = getCountryByCode(selectedCountry);
  const services = getServicesByCountry(selectedCountry);
  const chalets = CHALETS.filter(c => c.countryCode === selectedCountry);

  const handleCreateShippingLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService || !trackingNumber || !selectedCountry) {
      toast({
        title: "خطأ",
        description: "الرجاء ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const serviceData = services.find(s => s.key === selectedService);
    
    try {
      const link = await createLink.mutateAsync({
        type: 'shipping',
        countryCode: selectedCountry,
        payload: {
          service_key: selectedService,
          service_name: serviceData?.name || selectedService,
          tracking_number: trackingNumber,
          package_description: packageDescription,
          cod_amount: parseFloat(codAmount) || 0,
        },
        expiresInDays: parseInt(expiresInDays) || 30,
        metadata: {
          title: customTitle || `شحنة ${serviceData?.name || selectedService}`,
          description: customDescription || `تتبع وتأكيد الدفع - ${serviceData?.name || selectedService}`,
          amount: parseFloat(codAmount) || 0,
          currency: countryData?.currency || 'AED'
        }
      });

      // Reset form
      setSelectedService('');
      setTrackingNumber('');
      setPackageDescription('');
      setCodAmount('');
      setCustomTitle('');
      setCustomDescription('');
      
      await refetch();
    } catch (error) {
      console.error('Error creating shipping link:', error);
    }
  };

  const handleCreateChaletLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedChalet || !guestCount || !nights || !selectedCountry) {
      toast({
        title: "خطأ",
        description: "الرجاء ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const chalet = chalets.find(c => c.id === selectedChalet);
    if (!chalet) return;

    const totalAmount = chalet.defaultPrice * parseInt(nights);
    
    try {
      const link = await createLink.mutateAsync({
        type: 'chalet',
        countryCode: selectedCountry,
        payload: {
          chalet_id: chalet.id,
          chalet_name: chalet.name,
          guest_count: parseInt(guestCount),
          nights: parseInt(nights),
          price_per_night: chalet.defaultPrice,
          total_amount: totalAmount,
        },
        expiresInDays: parseInt(expiresInDays) || 30,
        metadata: {
          title: customTitle || `حجز ${chalet.name}`,
          description: customDescription || `احجز ${chalet.name} في ${countryData?.nameAr} - ${nights} ليلة لـ ${guestCount} ضيف`,
          amount: totalAmount,
          currency: countryData?.currency || 'AED'
        }
      });

      // Reset form
      setSelectedChalet('');
      setGuestCount('');
      setNights('');
      setCustomTitle('');
      setCustomDescription('');
      
      await refetch();
    } catch (error) {
      console.error('Error creating chalet link:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ",
      description: "تم نسخ الرابط إلى الحافظة",
    });
  };

  const handleDeleteLink = async (externalId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الرابط؟')) {
      await deleteLink.mutateAsync(externalId);
      await refetch();
    }
  };

  return (
    <div className="min-h-screen py-4 bg-gradient-to-b from-background to-secondary/20" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">مولد الروابط الخارجية</h1>
            <p className="text-muted-foreground">إنشاء روابط دفع فريدة ومستقلة عن التطبيق</p>
          </div>

          <Tabs defaultValue="create" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">إنشاء رابط جديد</TabsTrigger>
              <TabsTrigger value="manage">إدارة الروابط</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-6">
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-2">إنشاء رابط دفع خارجي</h2>
                  <p className="text-muted-foreground">اختر نوع الخدمة واملأ البيانات المطلوبة</p>
                </div>

                <Tabs defaultValue="shipping" onValueChange={(value) => setSelectedType(value as 'shipping' | 'chalet')}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="shipping">شحن</TabsTrigger>
                    <TabsTrigger value="chalet">شاليه</TabsTrigger>
                  </TabsList>

                  <TabsContent value="shipping">
                    <form onSubmit={handleCreateShippingLink} className="space-y-4">
                      {/* Country Selection */}
                      <div>
                        <Label className="mb-2 text-sm">الدولة *</Label>
                        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="اختر الدولة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AE">الإمارات العربية المتحدة</SelectItem>
                            <SelectItem value="SA">المملكة العربية السعودية</SelectItem>
                            <SelectItem value="KW">الكويت</SelectItem>
                            <SelectItem value="QA">قطر</SelectItem>
                            <SelectItem value="OM">عمان</SelectItem>
                            <SelectItem value="BH">البحرين</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Service Selection */}
                      {selectedCountry && (
                        <div>
                          <Label className="mb-2 text-sm">خدمة الشحن *</Label>
                          <Select value={selectedService} onValueChange={setSelectedService}>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="اختر خدمة الشحن" />
                            </SelectTrigger>
                            <SelectContent>
                              {services.map((service) => (
                                <SelectItem key={service.id} value={service.key}>
                                  {service.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Tracking Number */}
                      <div>
                        <Label className="mb-2 flex items-center gap-2 text-sm">
                          <Hash className="w-3 h-3" />
                          رقم الشحنة *
                        </Label>
                        <Input
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="مثال: 1234567890"
                          className="h-9 text-sm"
                          required
                        />
                      </div>

                      {/* Package Description */}
                      <div>
                        <Label className="mb-2 flex items-center gap-2 text-sm">
                          <Package className="w-3 h-3" />
                          وصف الطرد
                        </Label>
                        <Input
                          value={packageDescription}
                          onChange={(e) => setPackageDescription(e.target.value)}
                          placeholder="مثال: ملابس، إلكترونيات"
                          className="h-9 text-sm"
                        />
                      </div>

                      {/* COD Amount */}
                      <div>
                        <Label className="mb-2 flex items-center gap-2 text-sm">
                          <DollarSign className="w-3 h-3" />
                          مبلغ الدفع عند الاستلام
                        </Label>
                        <Input
                          type="number"
                          value={codAmount}
                          onChange={(e) => setCodAmount(e.target.value)}
                          placeholder="0.00"
                          className="h-9 text-sm"
                          step="0.01"
                          min="0"
                        />
                      </div>

                      {/* Custom Title */}
                      <div>
                        <Label className="mb-2 text-sm">عنوان مخصص</Label>
                        <Input
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                          placeholder="عنوان مخصص للرابط"
                          className="h-9 text-sm"
                        />
                      </div>

                      {/* Custom Description */}
                      <div>
                        <Label className="mb-2 text-sm">وصف مخصص</Label>
                        <Textarea
                          value={customDescription}
                          onChange={(e) => setCustomDescription(e.target.value)}
                          placeholder="وصف مخصص للرابط"
                          className="text-sm"
                          rows={3}
                        />
                      </div>

                      {/* Expiration */}
                      <div>
                        <Label className="mb-2 flex items-center gap-2 text-sm">
                          <Calendar className="w-3 h-3" />
                          انتهاء الصلاحية (أيام)
                        </Label>
                        <Input
                          type="number"
                          value={expiresInDays}
                          onChange={(e) => setExpiresInDays(e.target.value)}
                          placeholder="30"
                          className="h-9 text-sm"
                          min="1"
                          max="365"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full py-5"
                        disabled={createLink.isPending}
                      >
                        {createLink.isPending ? (
                          <span className="text-sm">جاري الإنشاء...</span>
                        ) : (
                          <>
                            <Link className="w-4 h-4 ml-2" />
                            <span className="text-sm">إنشاء رابط خارجي</span>
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="chalet">
                    <form onSubmit={handleCreateChaletLink} className="space-y-4">
                      {/* Country Selection */}
                      <div>
                        <Label className="mb-2 text-sm">الدولة *</Label>
                        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="اختر الدولة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AE">الإمارات العربية المتحدة</SelectItem>
                            <SelectItem value="SA">المملكة العربية السعودية</SelectItem>
                            <SelectItem value="KW">الكويت</SelectItem>
                            <SelectItem value="QA">قطر</SelectItem>
                            <SelectItem value="OM">عمان</SelectItem>
                            <SelectItem value="BH">البحرين</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Chalet Selection */}
                      {selectedCountry && (
                        <div>
                          <Label className="mb-2 text-sm">الشاليه *</Label>
                          <Select value={selectedChalet} onValueChange={setSelectedChalet}>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="اختر الشاليه" />
                            </SelectTrigger>
                            <SelectContent>
                              {chalets.map((chalet) => (
                                <SelectItem key={chalet.id} value={chalet.id}>
                                  {chalet.name} - {chalet.city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Guest Count */}
                      <div>
                        <Label className="mb-2 flex items-center gap-2 text-sm">
                          <Users className="w-3 h-3" />
                          عدد الضيوف *
                        </Label>
                        <Input
                          type="number"
                          value={guestCount}
                          onChange={(e) => setGuestCount(e.target.value)}
                          placeholder="عدد الضيوف"
                          className="h-9 text-sm"
                          min="1"
                          required
                        />
                      </div>

                      {/* Nights */}
                      <div>
                        <Label className="mb-2 flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-3 h-3" />
                          عدد الليالي *
                        </Label>
                        <Input
                          type="number"
                          value={nights}
                          onChange={(e) => setNights(e.target.value)}
                          placeholder="عدد الليالي"
                          className="h-9 text-sm"
                          min="1"
                          required
                        />
                      </div>

                      {/* Custom Title */}
                      <div>
                        <Label className="mb-2 text-sm">عنوان مخصص</Label>
                        <Input
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                          placeholder="عنوان مخصص للرابط"
                          className="h-9 text-sm"
                        />
                      </div>

                      {/* Custom Description */}
                      <div>
                        <Label className="mb-2 text-sm">وصف مخصص</Label>
                        <Textarea
                          value={customDescription}
                          onChange={(e) => setCustomDescription(e.target.value)}
                          placeholder="وصف مخصص للرابط"
                          className="text-sm"
                          rows={3}
                        />
                      </div>

                      {/* Expiration */}
                      <div>
                        <Label className="mb-2 flex items-center gap-2 text-sm">
                          <Calendar className="w-3 h-3" />
                          انتهاء الصلاحية (أيام)
                        </Label>
                        <Input
                          type="number"
                          value={expiresInDays}
                          onChange={(e) => setExpiresInDays(e.target.value)}
                          placeholder="30"
                          className="h-9 text-sm"
                          min="1"
                          max="365"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full py-5"
                        disabled={createLink.isPending}
                      >
                        {createLink.isPending ? (
                          <span className="text-sm">جاري الإنشاء...</span>
                        ) : (
                          <>
                            <Link className="w-4 h-4 ml-2" />
                            <span className="text-sm">إنشاء رابط خارجي</span>
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </Card>
            </TabsContent>

            <TabsContent value="manage" className="space-y-6">
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-2">إدارة الروابط الخارجية</h2>
                  <p className="text-muted-foreground">عرض وإدارة جميع الروابط الخارجية المنشأة</p>
                </div>

                {allLinks && allLinks.length > 0 ? (
                  <div className="space-y-4">
                    {allLinks.map((link) => (
                      <Card key={link.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={link.status === 'active' ? 'default' : 'secondary'}>
                                {link.status === 'active' ? 'نشط' : link.status === 'inactive' ? 'غير نشط' : 'منتهي الصلاحية'}
                              </Badge>
                              <Badge variant="outline">
                                {link.type === 'shipping' ? 'شحن' : 'شاليه'}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {link.externalId}
                              </span>
                            </div>
                            
                            <h3 className="font-semibold mb-1">
                              {link.metadata?.title || (link.type === 'shipping' ? 'شحنة' : 'شاليه')}
                            </h3>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              {link.metadata?.description || 'لا يوجد وصف'}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>المبلغ: {link.metadata?.amount || 0} {link.metadata?.currency || 'AED'}</span>
                              <span>تاريخ الإنشاء: {new Date(link.createdAt).toLocaleDateString('ar-SA')}</span>
                              {link.expiresAt && (
                                <span>انتهاء الصلاحية: {new Date(link.expiresAt).toLocaleDateString('ar-SA')}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(link.externalUrl)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(link.externalUrl, '_blank')}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteLink(link.externalId)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">لا توجد روابط خارجية منشأة</p>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ExternalLinkGenerator;