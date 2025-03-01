export const playPingSound = () => {
  const audio = new Audio("notification-sound.mp3");
  audio.play().catch((error) => {
    console.error("Failed to play sound:", error);
  });
};
