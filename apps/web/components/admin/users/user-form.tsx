'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createUserSchema, updateUserSchema, CreateUserInput, UpdateUserInput } from '@/lib/validations/users';
import { createUserAction, updateUserAction, checkEmailUniquenessAction } from '@/lib/actions/users';
import { ProfileWithStore } from '@/../../packages/types';
import { useToast } from '@/hooks/use-toast';
import { StoreService } from '@/lib/stores';
import { useState } from 'react';

interface UserFormProps {
  user?: ProfileWithStore;
  onSuccess: () => void;
  onCancel: () => void;
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = !!user;
  const { toast } = useToast();

  // Fetch stores for selection
  const { data: stores = [] } = useQuery({
    queryKey: ['stores'],
    queryFn: () => StoreService.getAllStores(),
  });

  const form = useForm<CreateUserInput | UpdateUserInput>({
    resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema),
    defaultValues: isEdit ? {
      email: user.email,
      role: user.role,
      store_id: user.store_id,
    } : {
      email: '',
      password: '',
      role: 'promotora',
      store_id: null,
    },
  });

  const createMutation = useMutation({
    mutationFn: createUserAction,
    onSuccess: () => {
      setIsSubmitting(false);
      onSuccess();
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al crear usuario',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) =>
      updateUserAction(id, data),
    onSuccess: () => {
      setIsSubmitting(false);
      onSuccess();
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al actualizar usuario',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = async (data: CreateUserInput | UpdateUserInput) => {
    setIsSubmitting(true);

    // Check email uniqueness
    if (data.email) {
      try {
        const isUnique = await checkEmailUniquenessAction(data.email, user?.id);
        if (!isUnique) {
          form.setError('email', {
            type: 'manual',
            message: 'Este correo electrónico ya está en uso',
          });
          setIsSubmitting(false);
          return;
        }
      } catch {
        toast({
          title: 'Error',
          description: 'Error al verificar correo electrónico',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
    }

    if (isEdit && user) {
      updateMutation.mutate({ id: user.id, data: data as UpdateUserInput });
    } else {
      createMutation.mutate(data as CreateUserInput);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="usuario@falabella.com"
                  {...field}
                  aria-describedby={
                    form.formState.errors.email ? `${field.name}-error` : undefined
                  }
                />
              </FormControl>
              <FormMessage id={`${field.name}-error`} />
            </FormItem>
          )}
        />

        {/* Password Field (only for create) */}
        {!isEdit && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña Temporal</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    aria-describedby={
                      'password' in form.formState.errors ? `${field.name}-error` : undefined
                    }
                  />
                </FormControl>
                <FormMessage id={`${field.name}-error`} />
              </FormItem>
            )}
          />
        )}

        {/* Role Field */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger aria-describedby={
                    form.formState.errors.role ? `${field.name}-error` : undefined
                  }>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="promotora">Promotora</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage id={`${field.name}-error`} />
            </FormItem>
          )}
        />

        {/* Store Field */}
        <FormField
          control={form.control}
          name="store_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tienda Asignada</FormLabel>
              <Select
                onValueChange={(value: string) => field.onChange(value === 'none' ? null : value)}
                defaultValue={field.value || 'none'}
              >
                <FormControl>
                  <SelectTrigger aria-describedby={
                    form.formState.errors.store_id ? `${field.name}-error` : undefined
                  }>
                    <SelectValue placeholder="Seleccionar tienda" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Sin asignar</SelectItem>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage id={`${field.name}-error`} />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEdit ? 'Actualizando...' : 'Creando...'}
              </>
            ) : (
              isEdit ? 'Actualizar Usuario' : 'Crear Usuario'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}