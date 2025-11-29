/**
 * Generates initials from a user's name
 * @param name - User's full name
 * @returns Initials string (1-2 characters)
 */
export const getInitials = (name: string): string => {
  if (!name) return 'U';
  
  const names = name.split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

/**
 * Generates a consistent color based on a string (usually user name)
 * @param str - String to generate color from
 * @returns Hex color code
 */
export const getColorFromName = (str: string): string => {
  if (!str) return '#3b82f6'; // Default blue
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
};