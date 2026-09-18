"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { usersService } from "@/services/users.service";
import type {
  AdminUser,
  InviteUserPayload,
  SetUserStatusPayload,
  UserDetails,
  UsersListParams,
  UsersListResult,
} from "@/types/users";

export function useUsers(params: UsersListParams) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => usersService.list(params),
    placeholderData: keepPreviousData,
  });
}

function detailsFromListUser(user: AdminUser): UserDetails {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    jobTitle: null,
    userType: "INTERNAL",
    status: user.status,
    roleId: null,
    role: user.role ? { id: "", name: user.role } : null,
    deactivatedAt: null,
    deactivationReason: null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function useUser(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => usersService.getById(id),
    enabled: Boolean(id),
    staleTime: 0,
    refetchOnMount: "always",
    placeholderData: () => {
      const lists = queryClient.getQueriesData<UsersListResult>({
        queryKey: ["users", "list"],
      });

      for (const [, data] of lists) {
        const match = data?.users.find((user) => user.id === id);
        if (match) {
          return detailsFromListUser(match);
        }
      }

      return undefined;
    },
  });
}

export function useInviteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InviteUserPayload) => usersService.invite(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useResendInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.resendInvite(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
    },
  });
}

export function useSetUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: SetUserStatusPayload & { id: string }) => usersService.setStatus(id, body),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users.all });

      const previousLists = queryClient.getQueriesData<UsersListResult>({
        queryKey: ["users", "list"],
      });

      queryClient.setQueriesData<UsersListResult>(
        { queryKey: ["users", "list"] },
        (current) => {
          if (!current) return current;

          return {
            ...current,
            users: current.users.map((user) =>
              user.id === variables.id
                ? { ...user, status: variables.status }
                : user,
            ),
          };
        },
      );

      const previousDetail = queryClient.getQueryData<UserDetails>(
        queryKeys.users.detail(variables.id),
      );

      if (previousDetail) {
        queryClient.setQueryData<UserDetails>(
          queryKeys.users.detail(variables.id),
          {
            ...previousDetail,
            status: variables.status,
          },
        );
      }

      return { previousLists, previousDetail };
    },
    onError: (_error, variables, context) => {
      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      if (context?.previousDetail) {
        queryClient.setQueryData(
          queryKeys.users.detail(variables.id),
          context.previousDetail,
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(variables.id),
      });
    },
  });
}
