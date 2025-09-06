import { getUser } from '@/api/user';
import { useAuth } from '@/utils/context/authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthRedirect() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.uid) {
      getUser(user.uid).then((dbUser) => {
        if (!dbUser || !dbUser.firebaseKey) {
          router.push('/newuser');
        }
        // If user exists, do nothing (stay on home)
      });
    }
  }, [user, router]);

  return null;
}
