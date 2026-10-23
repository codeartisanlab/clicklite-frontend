export function applyTheme(theme: string) {
    const nextTheme = theme === 'dark' ? 'dark' : 'light';

    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    localStorage.setItem('theme', nextTheme);
}