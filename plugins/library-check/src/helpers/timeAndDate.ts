export const timeAgo = (input: Date): any => {
  if (!input) {
    return 'Não informado';
  }
  const date = input instanceof Date ? input : new Date(input);
  const formatter = new Intl.RelativeTimeFormat('en');
  const ranges = {
    years: 3600 * 24 * 365,
    months: 3600 * 24 * 30,
    weeks: 3600 * 24 * 7,
    days: 3600 * 24,
    hours: 3600,
    minutes: 60,
    seconds: 1,
  };

  const secondsElapsed = (date.getTime() - Date.now()) / 1000;

  for (const key in ranges) {
    if ((ranges as any)[key] < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / (ranges as any)[key];
      return formatter.format(Math.round(delta), key as any);
    }
  }
  return input.toLocaleDateString();
};
