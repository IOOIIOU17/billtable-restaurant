const VAPID_PUBLIC_KEY = 'BE2h1_uePfrSrju4yutrMqVtNIdjk8CVsPTxrsu000aqc-1OT3r3SUT2cENHuwSeC_o4UgLiyyKsJg-VdR5I3j8';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribePush(api, userType = 'restaurant') {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push not supported');
      return false;
    }
    const registration = await navigator.serviceWorker.register('/sw.js');
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return false;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    const token = localStorage.getItem('restaurantToken');
    await api.post('/api/notifications/subscribe', 
      { subscription, userType },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return true;
  } catch (error) {
    console.error('Push subscription error:', error);
    return false;
  }
}
