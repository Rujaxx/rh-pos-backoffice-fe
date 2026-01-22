// sound.service.ts
let audioElement: HTMLAudioElement | null = null;
let isUnlocked = false;

export function unlockAudio() {
  if (isUnlocked) {
    return;
  }

  // Create audio element if not exists
  if (!audioElement) {
    audioElement = new Audio('/sounds/new-order.wav');
    audioElement.volume = 0.8;
    audioElement.load(); // Preload the audio
  }

  // Try to play and immediately pause to unlock
  const promise = audioElement.play();

  if (promise !== undefined) {
    promise
      .then(() => {
        audioElement!.pause();
        audioElement!.currentTime = 0;
        isUnlocked = true;
      })
      .catch(() => {});
  }
}

export function playNewOrderSound() {
  if (!isUnlocked) {
    unlockAudio();
    // Try again after a short delay
    setTimeout(() => {
      if (isUnlocked && audioElement) {
        audioElement.currentTime = 0;
        audioElement.play().catch(() => {
          console.warn('Failed to play sound');
        });
      }
    }, 100);
    return;
  }

  if (!audioElement) {
    return;
  }

  audioElement.currentTime = 0;
  audioElement.play().catch(() => {});
}
