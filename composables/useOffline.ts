export const useOffline = () => {
  const isOffline = useState("isOffline", () => false);
  const listenersAdded = useState("offlineListenersAdded", () => false);

  if (import.meta.client && !listenersAdded.value) {
    const updateStatus = () => {
      isOffline.value = !window.navigator.onLine;
    };

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    updateStatus();
    listenersAdded.value = true;
  }

  return {
    isOffline: readonly(isOffline),
  };
};
