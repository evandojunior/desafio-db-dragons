import { Link, Outlet } from 'react-router-dom';

import { AppFooter } from '@/app/layout/AppFooter';
import { UserMenu } from '@/app/layout/UserMenu';

import styles from './AppLayout.module.scss';

export function AppLayout() {
  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link className={styles.wordmark} to="/dragons">
            My Dragons
          </Link>

          <UserMenu />
        </div>
      </header>

      <main className={styles.content}>
        <Outlet />
      </main>

      <AppFooter />
    </div>
  );
}
