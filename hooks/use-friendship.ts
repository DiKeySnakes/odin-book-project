import {
  useMutation,
  UseMutationResult,
  UseMutationOptions,
  QueryClient,
} from '@tanstack/react-query';
import axios, { AxiosInstance } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useCallback, useEffect } from 'react';

interface MutationProps {
  otherUserId: string | null | undefined;
  currentUserId: string | null | undefined;
}

interface MutationReturn {
  mutateAsync: UseMutationResult<any, Error, void, unknown>['mutateAsync'];
  status: UseMutationResult<any, Error, void, unknown>['status'];
}

const useCustomMutation = (
  options: UseMutationOptions<any, Error, void, unknown>,
  queryClient?: QueryClient
): UseMutationResult<any, Error, void, unknown> => {
  return useMutation(options, queryClient);
};

const useFriendshipMutation = (
  axiosInstance: AxiosInstance,
  currentUserId: string | null | undefined,
  router: any,
  url: string,
  action: string
): MutationReturn => {
  const customMutation = useCustomMutation({
    mutationFn: async () => {
      const { data } = await (axiosInstance as any)[action](url, {
        action,
        friendId: currentUserId,
      });
      return data;
    },
    onSuccess: () => {
      router.refresh();
      toast.success(
        `Friend request ${
          action === 'request'
            ? 'sent'
            : action === 'accept'
            ? 'accepted'
            : action === 'reject'
            ? 'rejected'
            : 'removed'
        }`,
        {
          position: 'bottom-left',
        }
      );
    },
  });

  return {
    mutateAsync: customMutation.mutateAsync,
    status: customMutation.status,
  };
};

export function useFriendship({ otherUserId, currentUserId }: MutationProps): {
  requestFriend: MutationReturn;
  acceptFriend: MutationReturn;
  rejectFriend: MutationReturn;
  removeFriend: MutationReturn;
} {
  const router = useRouter();
  const axiosInstance: AxiosInstance = axios.create();

  const requestFriend = useFriendshipMutation(
    axiosInstance,
    currentUserId,
    router,
    `/api/friendship/${otherUserId}`,
    'post'
  );
  const acceptFriend = useFriendshipMutation(
    axiosInstance,
    currentUserId,
    router,
    `/api/friendship/${otherUserId}`,
    'patch'
  );
  const rejectFriend = useFriendshipMutation(
    axiosInstance,
    currentUserId,
    router,
    `/api/friendship/${otherUserId}`,
    'patch'
  );
  const removeFriend = useFriendshipMutation(
    axiosInstance,
    currentUserId,
    router,
    `/api/friendship/${otherUserId}`,
    'delete'
  );

  useEffect(() => {
    // Additional cleanup or side effects can be added here if needed
    return () => {
      // Cleanup logic here
    };
  }, []); // Ensure this effect runs only on mount and unmount

  return {
    requestFriend,
    acceptFriend,
    rejectFriend,
    removeFriend,
  };
}
