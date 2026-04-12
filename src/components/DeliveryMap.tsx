import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const defaultIconPrototype = L.Icon.Default.prototype as typeof L.Icon.Default.prototype & {
  _getIconUrl?: () => string;
};

delete defaultIconPrototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const restaurantIcon = new L.DivIcon({ html: `<div style="font-size:28px;line-height:1">🍽️</div>`, className: '', iconAnchor: [14, 14] });
const riderIcon      = new L.DivIcon({ html: `<div style="font-size:28px;line-height:1">🛵</div>`,  className: '', iconAnchor: [14, 14] });
const homeIcon       = new L.DivIcon({ html: `<div style="font-size:28px;line-height:1">🏠</div>`,  className: '', iconAnchor: [14, 14] });

const interpolate = (from: [number, number], to: [number, number], t: number): [number, number] => [
  from[0] + (to[0] - from[0]) * t,
  from[1] + (to[1] - from[1]) * t,
];

const FitBounds = ({ points }: { points: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length >= 2) map.fitBounds(L.latLngBounds(points), { padding: [50, 50] });
  }, [map, points]);
  return null;
};

const hashOffset = (str: string): [number, number] => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffffffff;
  return [((h & 0xff) / 255) * 0.06 - 0.03, (((h >> 8) & 0xff) / 255) * 0.06 - 0.03];
};

const BASE: [number, number] = [12.9716, 77.5946];

const STATUS_LABEL: Record<string, string> = {
  placed:           '🕐 Waiting for restaurant to confirm',
  accepted:         '✅ Order confirmed — preparing soon',
  preparing:        '👨‍🍳 Food is being prepared',
  out_for_delivery: '🛵 Rider is on the way',
  delivered:        '🎉 Delivered!',
};

interface DeliveryMapProps {
  restaurantName: string;
  orderStatus?: string;
}

const DeliveryMap = ({ restaurantName, orderStatus = 'placed' }: DeliveryMapProps) => {
  const rOffset = hashOffset(restaurantName);
  const restaurantPos = useMemo<[number, number]>(() => [BASE[0] + rOffset[0], BASE[1] + rOffset[1]], [rOffset]);
  const customerPos = useMemo<[number, number]>(() => [BASE[0] - rOffset[0] * 0.5 + 0.015, BASE[1] - rOffset[1] * 0.5 + 0.012], [rOffset]);
  const route = useMemo<[number, number][]>(() => [restaurantPos, customerPos], [customerPos, restaurantPos]);

  const [riderPos, setRiderPos] = useState<[number, number]>(restaurantPos);
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (orderStatus === 'delivered') {
      setRiderPos(customerPos);
      progressRef.current = 1;
      return;
    }

    setRiderPos(restaurantPos);
    progressRef.current = 0;

    if (orderStatus !== 'out_for_delivery') return;

    const DURATION = 30000;
    const start = performance.now();

    const animate = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      progressRef.current = t;
      setRiderPos(interpolate(restaurantPos, customerPos, t));
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [customerPos, orderStatus, restaurantPos]);

  const isLive = orderStatus === 'out_for_delivery';
  const progress = progressRef.current;

  return (
    <div className="overflow-hidden rounded-xl border shadow-sm">
      <div className="flex items-center justify-between bg-card px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isLive ? 'animate-pulse bg-success' : 'bg-muted-foreground/40'}`} />
          <span className="text-sm font-semibold text-foreground">Delivery Map</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {STATUS_LABEL[orderStatus] || ''}
        </span>
      </div>

      <MapContainer
        center={BASE}
        zoom={14}
        style={{ height: '300px', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={route} />

        {/* Dashed full route */}
        <Polyline positions={route} color="#6366f1" weight={3} dashArray="6 6" opacity={0.4} />

        {/* Solid covered path */}
        {isLive && (
          <Polyline positions={[restaurantPos, riderPos]} color="#6366f1" weight={4} opacity={0.9} />
        )}

        <Marker position={restaurantPos} icon={restaurantIcon}>
          <Popup>{restaurantName}</Popup>
        </Marker>

        <Marker position={customerPos} icon={homeIcon}>
          <Popup>Your Location</Popup>
        </Marker>

        <Marker position={riderPos} icon={riderIcon}>
          <Popup>{isLive ? 'Your Rider' : 'Rider (waiting)'}</Popup>
        </Marker>
      </MapContainer>

      <div className="flex items-center justify-around bg-card px-4 py-2 border-t text-xs text-muted-foreground">
        <span>🍽️ {restaurantName}</span>
        {isLive
          ? <span className="font-medium text-primary">{Math.round(progress * 100)}% covered</span>
          : <span>Rider at restaurant</span>
        }
        <span>🏠 Your location</span>
      </div>
    </div>
  );
};

export default DeliveryMap;
