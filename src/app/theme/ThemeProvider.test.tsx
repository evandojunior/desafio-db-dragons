import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from './ThemeProvider';
import { THEME_STORAGE_KEY } from './themeContext';
import { useTheme } from './useTheme';

function stubPrefersDark(prefersDark: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: prefersDark,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

function ThemeProbe() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button type="button" onClick={toggleTheme}>
      {theme}
    </button>
  );
}

function renderProbe() {
  const user = userEvent.setup();

  render(
    <ThemeProvider>
      <ThemeProbe />
    </ThemeProvider>,
  );

  return { user };
}

describe('tema', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('segue a preferencia do sistema quando nao ha escolha gravada', () => {
    stubPrefersDark(true);

    renderProbe();

    expect(screen.getByRole('button')).toHaveTextContent('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('usa o tema claro quando o sistema nao pede escuro', () => {
    stubPrefersDark(false);

    renderProbe();

    expect(screen.getByRole('button')).toHaveTextContent('light');
  });

  it('respeita a escolha gravada acima da preferencia do sistema', () => {
    stubPrefersDark(true);
    localStorage.setItem(THEME_STORAGE_KEY, 'light');

    renderProbe();

    expect(screen.getByRole('button')).toHaveTextContent('light');
  });

  it('ignora valor invalido no armazenamento', () => {
    stubPrefersDark(true);
    localStorage.setItem(THEME_STORAGE_KEY, 'roxo');

    renderProbe();

    expect(screen.getByRole('button')).toHaveTextContent('dark');
  });

  it('alterna e grava a escolha para o proximo acesso', async () => {
    stubPrefersDark(false);
    const { user } = renderProbe();

    await user.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toHaveTextContent('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('exige estar dentro do provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<ThemeProbe />)).toThrow(/ThemeProvider/);

    consoleError.mockRestore();
  });
});
