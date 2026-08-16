import styles from './AppFooter.module.scss';

const REPOSITORY_URL = 'https://github.com/evandojunior/desafio-db-dragons';

export function AppFooter() {
  return (
    <footer className={styles.footer}>
      <p className={styles.credit}>
        Desenvolvido por{' '}
        <a className={styles.link} href={REPOSITORY_URL} target="_blank" rel="noreferrer">
          Evando Junior
        </a>
      </p>
    </footer>
  );
}
