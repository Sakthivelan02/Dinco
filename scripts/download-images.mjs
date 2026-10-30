// Downloads one free Pixabay photo per product into client/public/images.
// Usage (from project root):  PIXABAY_KEY=your_key node scripts/download-images.mjs
import dns from 'node:dns';
import fs from 'node:fs';
dns.setServers(['8.8.8.8', '1.1.1.1']);

const KEY = process.env.PIXABAY_KEY;
if (!KEY) { console.error('Set PIXABAY_KEY first (free key shown at https://pixabay.com/api/docs/ after login)'); process.exit(1); }

const items = {
  headphones: 'wireless headphones', speaker: 'bluetooth speaker', smartwatch: 'smart watch',
  powerbank: 'power bank', keyboard: 'mechanical keyboard', mouse: 'wireless computer mouse',
  'denim-jacket': 'denim jacket', tshirt: 'plain t-shirt', 'running-shoes': 'running shoes',
  wallet: 'leather wallet', sunglasses: 'aviator sunglasses', backpack: 'backpack',
  'water-bottle': 'steel water bottle', 'french-press': 'french press coffee', 'frying-pan': 'frying pan',
  'desk-lamp': 'desk lamp', bedsheet: 'bed sheets', 'yoga-mat': 'yoga mat', dumbbell: 'dumbbells',
  'resistance-bands': 'resistance bands', 'skipping-rope': 'skipping rope',
  'webcam': 'webcam',
  'usb-hub': 'usb c hub',
  'earbuds': 'wireless earbuds',
  'ring-light': 'ring light',
  'hoodie': 'hoodie',
  'chinos': 'chino trousers',
  'beanie': 'knitted beanie',
  'belt': 'leather belt',
  'wrist-watch': 'analog wrist watch',
  'electric-kettle': 'electric kettle',
  'kitchen-knives': 'kitchen knife set',
  'coffee-mugs': 'ceramic coffee mugs',
  'food-containers': 'food storage containers',
  'blanket': 'fleece blanket',
  'foam-roller': 'foam roller',
  'kettlebell': 'kettlebell',
  'gym-gloves': 'gym gloves',
  'moisturizer': 'face moisturizer',
  'hair-dryer': 'hair dryer',
  'toothbrush': 'electric toothbrush',
  'perfume': 'perfume bottle',
  'trimmer': 'beard trimmer',
  'building-blocks': 'building blocks toy',
  'chess': 'chess set',
  'puzzle': 'jigsaw puzzle',
  'playing-cards': 'playing cards',
  'notebooks': 'spiral notebook',
  'gel-pens': 'colored pens',
  'office-chair': 'office chair',
  'laptop-stand': 'laptop stand',
  'desk-organizer': 'desk organizer',
  'whiteboard': 'whiteboard',
  'sticky-notes': 'sticky notes',
  'folders': 'document folders',
  'planner': 'planner notebook',
  'calculator': 'calculator',
  'camping-tent': 'camping tent',
  'sleeping-bag': 'sleeping bag',
  'hiking-boots': 'hiking boots',
  'cycling-helmet': 'cycling helmet',
  'badminton': 'badminton racket',
  'cricket-bat': 'cricket bat',
  'football': 'soccer ball',
  'basketball': 'basketball',
  'trekking-poles': 'trekking poles',
  'swim-goggles': 'swimming goggles',
  'dog-leash': 'dog leash',
  'cat-scratcher': 'cat scratching post',
  'pet-bowls': 'pet bowls',
  'dog-toy': 'dog chew toy',
  'pet-carrier': 'pet carrier',
  'litter-box': 'cat litter box',
  'dog-bed': 'dog bed',
  'aquarium': 'fish aquarium',
  'green-tea': 'green tea',
  'coffee-beans': 'coffee beans',
  'honey-jar': 'honey jar',
  'mixed-nuts': 'mixed nuts',
  'dark-chocolate': 'dark chocolate',
  'basmati-rice': 'basmati rice',
  'olive-oil': 'olive oil',
  'oats': 'rolled oats',
  'game-controller': 'game controller',
  'smart-bulb': 'smart light bulb',
  'wifi-router': 'wifi router',
  'portable-ssd': 'portable ssd',
  'action-camera': 'action camera',
  'handbag': 'leather handbag',
  'socks': 'socks',
  'formal-shirt': 'formal shirt',
  'baseball-cap': 'baseball cap',
  'scarf': 'silk scarf',
  'sandals': 'sandals',
  'wall-clock': 'wall clock',
  'scented-candles': 'scented candles',
  'vacuum-cleaner': 'vacuum cleaner',
  'plant-pot': 'plant pot',
  'bath-towels': 'bath towels',
  'wall-mirror': 'wall mirror',
};
const dir = 'client/public/images';
fs.mkdirSync(dir, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const have = (file) => fs.existsSync(`${dir}/${file}.jpg`) && fs.statSync(`${dir}/${file}.jpg`).size > 2000;

// Asks Pixabay for photos; waits and retries when the rate limit (429) is hit.
async function search(q) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(`https://pixabay.com/api/?key=${KEY}&q=${encodeURIComponent(q)}&image_type=photo&orientation=horizontal&safesearch=true&per_page=5`);
    if (res.status === 429) { console.log('  rate limit reached, waiting 60s...'); await sleep(60000); continue; }
    try { return (await res.json()).hits || []; } catch { await sleep(3000); }
  }
  return [];
}

const missing = [];
for (const [file, term] of Object.entries(items)) {
  if (have(file)) { console.log(`- ${file}.jpg already exists, skipped`); continue; }
  // Try the full term first, then simpler fallbacks (last word, then first word).
  const words = term.split(' ');
  const queries = [...new Set([term, words.at(-1), words[0]])];
  let saved = false;
  for (const q of queries) {
    try {
      await sleep(500);
      const hit = (await search(q))[0];
      if (!hit) continue;
      const img = await fetch(hit.webformatURL);
      const buf = Buffer.from(await img.arrayBuffer());
      if (buf.length < 2000) continue;
      fs.writeFileSync(`${dir}/${file}.jpg`, buf);
      console.log(`✓ ${file}.jpg  (search "${q}", by ${hit.user} on Pixabay)`);
      saved = true;
      break;
    } catch (e) { console.log(`  ${file}: ${e.message}`); }
  }
  if (!saved) { console.log(`✗ ${file}: no photo found`); missing.push(file); }
}
console.log(missing.length ? `\nStill missing (${missing.length}): ${missing.join(', ')}\nRun the script again, or add these photos by hand.` : '\nAll photos downloaded ✓');
