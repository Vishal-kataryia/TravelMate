// Central images used across every page.
// Unsplash URLs (images.unsplash.com) + verified Pexels Jaipur landmark photos
// (images.pexels.com, confirmed subjects) + local Jal Mahal asset.
const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;
const p = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

export const IMAGES = {
  hero: u('photo-1488646953014-85cb44e25828'), // traveler with map / luggage
  roadTrip: u('photo-1469854523086-cc02fe5d8800'), // road trip van
  mountains: u('photo-1506905925346-21bda4d32df4'), // mountain peak
  tajMahal: u('photo-1524492412937-b28074a5d7da'), // India Taj Mahal
  beach: u('photo-1507525428034-b723cf961d3e'), // tropical beach
  goaBeach: u('photo-1512343879784-a960bf40e7f2'), // Goa palm beach
  hiker: u('photo-1551632811-561732d1e306'), // hikers trekking on a mountain trail
  coupleMap: u('photo-1530789253388-582c481c54b0'), // couple planning trip
  backpack: u('photo-1526772662000-3f88f10405ff'), // backpacker viewpoint
  friendsBeach: u('photo-1530521954074-e64f6810b32d'), // friends on beach
  lakeCanoe: u('photo-1476514525535-07fb3b4ae5f1'), // canoe on lake
  planeWing: u('photo-1500835556837-99ac94a94552'), // airplane wing sunset
  bus: u('photo-1544620347-c4fd4a3d5957'), // bus on road
  indiaGate: u('photo-1587474260584-136574528ed5'), // Delhi India Gate
  kerala: u('photo-1602216056096-3b40cc0c9944'), // Kerala backwaters houseboat
  desert: u('photo-1509316785289-025f5b846b35'), // desert road trees
};

export const DEST_IMAGES = {
  Goa: u('photo-1512343879784-a960bf40e7f2'),
  Manali: u('photo-1506905925346-21bda4d32df4'),
  // Authentic Jaipur imagery: Hawa Mahal (Palace of Winds), verified Pexels photo.
  Jaipur: p(19195945),
  Kerala: u('photo-1602216056096-3b40cc0c9944'),
  Mumbai: u('photo-1530521954074-e64f6810b32d'),
  Delhi: u('photo-1587474260584-136574528ed5'),
};

// Authentic Jaipur landmark photos for destination cards.
// Subjects verified via Pexels listing titles; Jal Mahal uses the local asset
// (imported in components as jalMahalImg) — see JAIPUR_LANDMARKS_IDS.
export const JAIPUR_PEXELS = {
  // "Hawa Mahal in Jaipur" — pink sandstone Palace of Winds facade.
  hawaMahal: p(19195945),
  // Alternate Hawa Mahal angle — "Hawa Mahal in Jaipur, India".
  hawaMahalAlt: p(11949717),
  // "Amber Fort in Jaipur, Rajasthan India".
  amberFort: p(29624175),
  // "Crowded Entrance of Historic Amber Fort in Jaipur".
  amberFortGate: p(34913210),
  // "Ornate Green Gate of Jaipur City Palace, India".
  cityPalace: p(35394355),
};

// Pick a deterministic image for a route / card by index or name.
export function imageForIndex(i) {
  const pool = [
    IMAGES.roadTrip,
    IMAGES.mountains,
    IMAGES.beach,
    IMAGES.hiker,
    IMAGES.coupleMap,
    IMAGES.backpack,
    IMAGES.lakeCanoe,
    IMAGES.planeWing,
    IMAGES.bus,
    IMAGES.friendsBeach,
  ];
  return pool[Math.abs(i) % pool.length];
}

export function imageForPlace(name) {
  if (!name) return imageForIndex(0);
  return DEST_IMAGES[name] || imageForIndex(name.length + name.charCodeAt(0));
}
