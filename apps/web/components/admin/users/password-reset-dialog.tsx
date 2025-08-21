'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { resetPasswordSchema, ResetPasswordInput } from '@/lib/validations/users';
import { resetUserPasswordAction } from '@/lib/actions/users';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, Mail } from 'lucide-react';

interface PasswordResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail?: string;
}

export function PasswordResetDialog({
  open,
  onOpenChange,
  userEmail,
}: PasswordResetDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: userEmail || '',
    },
  });

  const resetMutation = useMutation({
    mutationFn: resetUserPasswordAction,
    onSuccess: () => {
      setIsSubmitting(false);
      toast({
        title: '¡Éxito!',
        description: 'Se ha enviado el correo de restablecimiento de contraseña',
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al enviar correo',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsSubmitting(true);
    resetMutation.mutate(data.email);
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Restablecer Contraseña
          </DialogTitle>
          <DialogDescription>
            Se enviará un correo electrónico con instrucciones para restablecer la contraseña.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="usuario@falabella.com"
                        className="pl-10"
                        disabled={isSubmitting}
                        aria-describedby={
                          form.formState.errors.email ? `${field.name}-error` : undefined
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage id={`${field.name}-error`} />
                </FormItem>
              )}
            />

            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                <strong>Nota:</strong> El usuario recibirá un correo con un enlace para crear una nueva contraseña. 
                El enlace será válido por 24 horas.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <KeyRound className="mr-2 h-4 w-4" />
                    Enviar Correo
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}