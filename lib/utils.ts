import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { User } from '@prisma/client';
import { FriendshipStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkFriendship(
  currentUser: User | null,
  otherUser: User | null
) {
  if (
    currentUser?.friendIds.find((friend) => friend === otherUser?.externalId)
  ) {
    return FriendshipStatus.FRIENDS;
  }

  if (
    currentUser?.friendRequests.find(
      (friend) => friend === otherUser?.externalId
    )
  ) {
    return FriendshipStatus.REQUEST_RECEIVED;
  }

  if (
    otherUser?.friendRequests.find(
      (friendRequest) => friendRequest === currentUser?.externalId
    )
  ) {
    return FriendshipStatus.REQUEST_SENT;
  }

  return FriendshipStatus.NOT_FRIENDS;
}
