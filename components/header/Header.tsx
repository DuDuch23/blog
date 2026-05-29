import { getSession } from '@/app/lib/session';
import HeaderOnline from './(online)/HeaderOnline';
import HeaderOffline from './(offline)/HeaderOffline';

export default async function Header() {
  const session = await getSession();
  return session ? <HeaderOnline session={session} /> : <HeaderOffline />;
}
