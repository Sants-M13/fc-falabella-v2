'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserTable } from '@/components/admin/users/user-table';
import { UserForm } from '@/components/admin/users/user-form';
import { PasswordResetDialog } from '@/components/admin/users/password-reset-dialog';
import { AdminBreadcrumb } from '@/components/admin/admin-breadcrumb';
import { getUsers, deleteUserAction } from '@/lib/actions/users';
import { ProfileWithStore } from '@/../../packages/types';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ProfileWithStore | null>(null);
  const [passwordResetEmail, setPasswordResetEmail] = useState<string>('');
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch users
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUserAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: '¡Éxito!',
        description: 'Usuario eliminado exitosamente',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al eliminar usuario',
        variant: 'destructive',
      });
    },
  });

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower) ||
      (user.stores?.name && user.stores.name.toLowerCase().includes(searchLower))
    );
  });

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    queryClient.invalidateQueries({ queryKey: ['users'] });
    toast({
      title: '¡Éxito!',
      description: 'Usuario creado exitosamente',
    });
  };

  const handleEditSuccess = () => {
    setEditingUser(null);
    queryClient.invalidateQueries({ queryKey: ['users'] });
    toast({
      title: '¡Éxito!',
      description: 'Usuario actualizado exitosamente',
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
      deleteMutation.mutate(id);
    }
  };

  const handlePasswordReset = (email: string) => {
    setPasswordResetEmail(email);
    setIsPasswordResetOpen(true);
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Error al cargar usuarios: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Panel', href: '/admin' },
    { label: 'Gestión de Usuarios', current: true },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <AdminBreadcrumb items={breadcrumbItems} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra las promotoras y sus asignaciones de tienda
          </p>
        </div>

        {/* Create User Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Ingrese los datos del nuevo usuario. Se enviará un correo con las credenciales de acceso.
              </DialogDescription>
            </DialogHeader>
            <UserForm onSuccess={handleCreateSuccess} onCancel={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios del Sistema</CardTitle>
          <CardDescription>
            {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por correo, rol o tienda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Users Table */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <UserTable
              users={filteredUsers}
              onEdit={setEditingUser}
              onDelete={handleDelete}
              onPasswordReset={handlePasswordReset}
            />
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Actualice los datos del usuario seleccionado.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <UserForm
              user={editingUser}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingUser(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Password Reset Dialog */}
      <PasswordResetDialog
        open={isPasswordResetOpen}
        onOpenChange={setIsPasswordResetOpen}
        userEmail={passwordResetEmail}
      />
    </div>
  );
}