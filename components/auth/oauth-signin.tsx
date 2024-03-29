'use client';

import * as React from 'react';
import { isClerkAPIResponseError, useSignIn } from '@clerk/nextjs';
import type { OAuthStrategy } from '@clerk/types';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

const oauthProviders = [
  { name: 'Google', strategy: 'oauth_google', icon: 'google' },
  { name: 'Github', strategy: 'oauth_github', icon: 'github' },
  { name: 'Discord', strategy: 'oauth_discord', icon: 'discord' },
] satisfies {
  name: string;
  icon: keyof typeof Icons;
  strategy: OAuthStrategy;
}[];

export function OAuthSignIn() {
  const [isLoading, setIsLoading] = React.useState<OAuthStrategy | null>(null);
  const { signIn, isLoaded: SignInLoaded } = useSignIn();

  async function oauthSignIn(provider: OAuthStrategy) {
    if (!SignInLoaded) return null;
    try {
      setIsLoading(provider);
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      });
    } catch (error) {
      setIsLoading(null);

      const unknownError = 'Something went wrong, please try again.';

      isClerkAPIResponseError(error)
        ? toast.error(error.errors[0]?.longMessage ?? unknownError)
        : toast.error(unknownError);
    }
  }
  return (
    <div className='grid sm:grid-cols-3 gap-2 grid-cols-1'>
      {oauthProviders.map((provider) => {
        const Icon = Icons[provider.icon];

        return (
          <Button
            aria-label={`Sign in with ${provider.name}`}
            key={provider.strategy}
            variant='outline'
            className='w-full bg-background sm:w-auto'
            onClick={() => void oauthSignIn(provider.strategy)}
            disabled={isLoading !== null}>
            {isLoading === provider.strategy ? (
              <Icons.spinner
                className='mr-2 h-4 w-4 animate-spin'
                aria-hidden='true'
              />
            ) : (
              <Icon className='mr-2 h-4 w-4' aria-hidden='true' />
            )}
            {provider.name}
          </Button>
        );
      })}
    </div>
  );
}
