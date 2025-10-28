import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  createExternalPaymentLink,
  getExternalPaymentLink,
  updateExternalLinkStatus,
  getAllExternalLinks,
  deleteExternalLink,
  CreateExternalLinkData,
  ExternalPaymentLink
} from "@/lib/externalLinkGenerator";

// Create external payment link
export const useCreateExternalLink = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateExternalLinkData) => {
      return await createExternalPaymentLink(data);
    },
    onSuccess: (link) => {
      queryClient.invalidateQueries({ queryKey: ["external-links"] });
      toast({
        title: "تم إنشاء الرابط الخارجي",
        description: `تم إنشاء رابط الدفع الخارجي: ${link.externalId}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء إنشاء الرابط الخارجي",
        variant: "destructive",
      });
    },
  });
};

// Get external payment link by external ID
export const useExternalLink = (externalId?: string) => {
  return useQuery({
    queryKey: ["external-link", externalId],
    queryFn: async () => {
      if (!externalId) return null;
      return await getExternalPaymentLink(externalId);
    },
    enabled: !!externalId,
  });
};

// Get all external links
export const useAllExternalLinks = () => {
  return useQuery({
    queryKey: ["external-links"],
    queryFn: async () => {
      return await getAllExternalLinks();
    },
  });
};

// Update external link status
export const useUpdateExternalLinkStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      externalId,
      status,
    }: {
      externalId: string;
      status: 'active' | 'inactive' | 'expired';
    }) => {
      await updateExternalLinkStatus(externalId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external-links"] });
      queryClient.invalidateQueries({ queryKey: ["external-link"] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة الرابط بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء تحديث حالة الرابط",
        variant: "destructive",
      });
    },
  });
};

// Delete external link
export const useDeleteExternalLink = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (externalId: string) => {
      await deleteExternalLink(externalId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external-links"] });
      toast({
        title: "تم الحذف",
        description: "تم حذف الرابط الخارجي بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حذف الرابط",
        variant: "destructive",
      });
    },
  });
};