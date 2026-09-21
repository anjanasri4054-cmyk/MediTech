// Cross-tab and intra-app real-time event synchronization bus

type SyncListener = (event: { type: string; payload: any }) => void;

class SyncBus {
  private channel: BroadcastChannel | null = null;
  private listeners: SyncListener[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('rxbridge_sync');
        this.channel.onmessage = (msg) => {
          this.notify(msg.data);
        };
      } catch (e) {
        console.warn('BroadcastChannel error, using localStorage fallback', e);
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'rxbridge_last_sync' && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            this.notify(data);
          } catch {}
        }
      });
    }
  }

  public subscribe(listener: SyncListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(data: { type: string; payload: any }) {
    this.listeners.forEach((l) => l(data));
  }

  public emit(type: string, payload: any = {}) {
    const data = { type, payload, timestamp: Date.now() };
    if (this.channel) {
      try {
        this.channel.postMessage(data);
      } catch {}
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('rxbridge_last_sync', JSON.stringify(data));
      } catch {}
    }
    this.notify(data);
  }
}

export const syncBus = new SyncBus();
