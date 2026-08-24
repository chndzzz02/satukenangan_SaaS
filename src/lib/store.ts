import { SatukenanganEvent, Photo, CreateEventInput, PresetId } from "@/types";

// In-Memory Database Store (with initial demo event)
class SatukenanganStore {
  private events: Map<string, SatukenanganEvent> = new Map();
  private photos: Map<string, Photo[]> = new Map();

  constructor() {
    this.seedDemoData();
  }

  private seedDemoData() {
    const demoEvent: SatukenanganEvent = {
      id: "evt_demo_1",
      slug: "demo-pernikahan",
      name: "Pernikahan Dimas & Nisa",
      hostName: "Dimas & Nisa",
      hostEmail: "dimasnisa@satukenangan.com",
      experienceType: "camera",
      presetId: "portra400",
      eventDate: new Date().toISOString(),
      revealTimeType: "during",
      revealDateTime: new Date(Date.now() - 3600000).toISOString(),
      guestLimit: 50,
      photoLimitPerGuest: 24,
      status: "active",
      paymentStatus: "paid",
      price: 149000,
      qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=http://localhost:3000/events/demo-pernikahan",
      createdAt: new Date().toISOString(),
    };

    this.events.set(demoEvent.slug, demoEvent);

    const demoPhotos: Photo[] = [
      {
        id: "p1",
        eventId: demoEvent.id,
        guestName: "Budi & Sarah",
        photoUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        presetApplied: "portra400",
        frameNumber: "01A",
        isRevealed: true,
        caption: "Bahagia selamanya!",
        createdAt: new Date(Date.now() - 3000000).toISOString(),
      },
      {
        id: "p2",
        eventId: demoEvent.id,
        guestName: "Rian Pratama",
        photoUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
        presetApplied: "portra400",
        frameNumber: "02A",
        isRevealed: true,
        caption: "Party malam resepis!",
        createdAt: new Date(Date.now() - 2500000).toISOString(),
      },
      {
        id: "p3",
        eventId: demoEvent.id,
        guestName: "Siti Rahma",
        photoUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
        presetApplied: "portra400",
        frameNumber: "03A",
        isRevealed: true,
        caption: "Best wedding ever!",
        createdAt: new Date(Date.now() - 2000000).toISOString(),
      },
      {
        id: "p4",
        eventId: demoEvent.id,
        guestName: "Maya Indah",
        photoUrl: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=800&q=80",
        presetApplied: "portra400",
        frameNumber: "04A",
        isRevealed: true,
        caption: "Dansa romantis",
        createdAt: new Date(Date.now() - 1000000).toISOString(),
      },
    ];

    this.photos.set(demoEvent.slug, demoPhotos);
  }

  public createEvent(input: CreateEventInput): SatukenanganEvent {
    const slug = input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + "-" + Math.floor(1000 + Math.random() * 9000);

    const price = input.guestLimit <= 5 ? 0 : input.guestLimit <= 50 ? 149000 : input.guestLimit <= 100 ? 279000 : input.guestLimit <= 200 ? 449000 : 799000;
    const paymentStatus = price === 0 ? "free" : "unpaid";

    const newEvent: SatukenanganEvent = {
      id: `evt_${Date.now()}`,
      slug,
      name: input.name,
      hostName: input.hostName,
      hostEmail: input.hostEmail,
      experienceType: input.experienceType,
      presetId: input.presetId,
      eventDate: input.eventDate,
      revealTimeType: input.revealTimeType,
      revealDateTime: input.revealDateTime,
      guestLimit: input.guestLimit,
      photoLimitPerGuest: input.photoLimitPerGuest,
      status: "active",
      paymentStatus,
      price,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/events/${slug}`)}`,
      createdAt: new Date().toISOString(),
    };

    this.events.set(slug, newEvent);
    this.photos.set(slug, []);
    return newEvent;
  }

  public getEvent(slug: string): SatukenanganEvent | undefined {
    return this.events.get(slug);
  }

  public getAllEvents(): SatukenanganEvent[] {
    return Array.from(this.events.values());
  }

  public updatePaymentStatus(slug: string, status: "paid" | "unpaid" | "free"): SatukenanganEvent | undefined {
    const event = this.events.get(slug);
    if (event) {
      event.paymentStatus = status;
      this.events.set(slug, event);
    }
    return event;
  }

  public addPhoto(slug: string, photo: Omit<Photo, "id" | "createdAt" | "frameNumber" | "isRevealed">): Photo | undefined {
    const event = this.events.get(slug);
    if (!event) return undefined;

    const eventPhotos = this.photos.get(slug) || [];
    const frameIndex = (eventPhotos.length + 1).toString().padStart(2, "0");
    const isRevealed = new Date() >= new Date(event.revealDateTime);

    const newPhoto: Photo = {
      ...photo,
      id: `p_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      frameNumber: `${frameIndex}A`,
      isRevealed,
      createdAt: new Date().toISOString(),
    };

    eventPhotos.unshift(newPhoto);
    this.photos.set(slug, eventPhotos);
    return newPhoto;
  }

  public getPhotos(slug: string): Photo[] {
    const event = this.events.get(slug);
    if (!event) return [];

    const eventPhotos = this.photos.get(slug) || [];
    const isRevealed = new Date() >= new Date(event.revealDateTime);

    return eventPhotos.map((p) => ({
      ...p,
      isRevealed: isRevealed || p.isRevealed,
    }));
  }

  public deletePhoto(slug: string, photoId: string): boolean {
    const photos = this.photos.get(slug);
    if (!photos) return false;
    const nextPhotos = photos.filter((photo) => photo.id !== photoId);
    if (nextPhotos.length === photos.length) return false;
    this.photos.set(slug, nextPhotos);
    return true;
  }

  public toggleHidePhoto(slug: string, photoId: string): boolean {
    const photos = this.photos.get(slug);
    if (!photos) return false;

    const photo = photos.find((p) => p.id === photoId);
    if (photo) {
      photo.isHiddenByHost = !photo.isHiddenByHost;
      return true;
    }
    return false;
  }
}

// Global Store Singleton instance
const globalStore = (global as any).satukenanganStore || new SatukenanganStore();
if (process.env.NODE_ENV !== "production") {
  (global as any).satukenanganStore = globalStore;
}

export default globalStore as SatukenanganStore;
