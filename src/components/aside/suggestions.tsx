import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  doc,
  limit,
  query,
  where,
  orderBy,
  documentId
} from 'firebase/firestore';
import { useAuth } from '@lib/context/auth-context';
import { useCollection } from '@lib/hooks/useCollection';
import { useDocument } from '@lib/hooks/useDocument';
import { usersCollection } from '@lib/firebase/collections';
import { UserCard } from '@components/user/user-card';
import { Loading } from '@components/ui/loading';
import { variants } from './aside-about';

const featuredUserId = process.env.NEXT_PUBLIC_FEATURED_USER_ID || null;

export function Suggestions(): JSX.Element {
  const { randomSeed } = useAuth();

  // An optional account to always suggest first, such as the site's own.
  const { data: adminData, loading: adminLoading } = useDocument(
    doc(usersCollection, featuredUserId ?? 'none'),
    { allowNull: true, disabled: !featuredUserId }
  );

  const { data: suggestionsData, loading: suggestionsLoading } = useCollection(
    query(
      usersCollection,
      where(documentId(), '>=', randomSeed),
      orderBy(documentId()),
      limit(2)
    ),
    { allowNull: true }
  );

  return (
    <section className='hover-animation rounded-2xl bg-main-sidebar-background'>
      {adminLoading || suggestionsLoading ? (
        <Loading className='flex h-52 items-center justify-center p-4' />
      ) : suggestionsData ? (
        <motion.div className='inner:px-4 inner:py-3' {...variants}>
          <h2 className='text-xl font-bold'>People you could follow</h2>
          {adminData && <UserCard {...adminData} />}
          {suggestionsData?.map((userData) => (
            <UserCard {...userData} key={userData.id} />
          ))}
          <Link href='/people'>
            <a
              className='custom-button accent-tab hover-card block w-full rounded-2xl
                         rounded-t-none text-center text-main-accent'
            >
              Show all people
            </a>
          </Link>
        </motion.div>
      ) : null}
    </section>
  );
}
