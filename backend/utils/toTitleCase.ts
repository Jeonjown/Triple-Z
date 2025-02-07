export const toTitleCase = (str: string) => {
  return str
    .split(" ") // Split the string by spaces
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize first letter and lower the rest
    })
    .join(" "); // Join the words back with spaces
};
