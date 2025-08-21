'use client';

import { ProfileWithStore } from '@/../../packages/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Store, User, KeyRound } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface UserTableProps {
  users: ProfileWithStore[];
  onEdit: (user: ProfileWithStore) => void;
  onDelete: (id: string) => void;
  onPasswordReset: (email: string) => void;
}

export function UserTable({ users, onEdit, onDelete, onPasswordReset }: UserTableProps) {
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getRelativeTime = (date: string) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: es,
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'promotora':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'promotora':
        return 'Promotora';
      default:
        return role;
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900">No hay usuarios</p>
        <p className="text-sm text-gray-500 mt-1">
          Comience creando un nuevo usuario
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      {/* Desktop View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Correo Electrónico</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Tienda Asignada</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead>Última Actualización</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.stores ? (
                    <div className="flex items-center gap-1">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      <span>{user.stores.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Sin asignar</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{formatDate(user.created_at)}</div>
                    <div className="text-muted-foreground text-xs">
                      {getRelativeTime(user.created_at)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{formatDate(user.updated_at)}</div>
                    <div className="text-muted-foreground text-xs">
                      {getRelativeTime(user.updated_at)}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(user)}
                      title="Editar usuario"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPasswordReset(user.email)}
                      title="Restablecer contraseña"
                      className="text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                    >
                      <KeyRound className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(user.id)}
                      title="Eliminar usuario"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-4 border-b last:border-b-0 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="font-medium text-sm">{user.email}</p>
                <Badge
                  variant={getRoleBadgeVariant(user.role)}
                  className="text-xs"
                >
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(user)}
                  title="Editar usuario"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPasswordReset(user.email)}
                  title="Restablecer contraseña"
                  className="text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                >
                  <KeyRound className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(user.id)}
                  title="Eliminar usuario"
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {user.stores && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Store className="h-3 w-3" />
                <span>{user.stores.name}</span>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Creado {getRelativeTime(user.created_at)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}