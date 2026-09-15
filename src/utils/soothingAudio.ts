export function getGreetingTextByTime(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good morning! Ready for design excellence today.';
  } else if (hour < 17) {
    return 'Good afternoon! Workstation operating at peak efficiency.';
  } else {
    return 'Good evening! Great progress on site projects today.';
  }
}
