// Preset Templates Catalog for Quick Inspiration

const TEMPLATES = [
  {
    id: 'royal_heritage',
    title: 'The Royal Villa',
    subtitle: 'Natural Teakwood + 3D Gold Ganesha',
    badge: 'Bestseller',
    thumbnailColor: 'linear-gradient(135deg, #451a03, #78350f)',
    config: {
      material: 'teak_wood',
      shape: 'rounded_rect',
      widthInches: 16,
      heightInches: 8,
      hardware: 'brass_standoffs',
      backlight: 'none',
      letteringStyle: 'gold_3d',
      wall: 'brick',
      nightMode: false,
      motifId: 'ganesha',
      motifPosition: 'top_center',
      motifSize: 42,
      motifColor: '#f59e0b',
      line1: {
        text: 'The Sharmas',
        font: 'Cinzel',
        size: 38,
        letterSpacing: 3,
        bold: true,
        italic: false,
        yOffset: 0
      },
      line2: {
        text: 'Villa Nirvana • 108',
        font: 'Montserrat',
        size: 16,
        letterSpacing: 4,
        bold: false,
        italic: false,
        yOffset: 0
      },
      line3: {
        text: 'WELCOME',
        font: 'Montserrat',
        size: 11,
        letterSpacing: 6,
        bold: true,
        italic: false,
        yOffset: 0
      }
    }
  },
  {
    id: 'modern_luxury_glow',
    title: 'Imperial Night Glow',
    subtitle: 'Glossy Black Acrylic + Warm LED',
    badge: 'Trending',
    thumbnailColor: 'linear-gradient(135deg, #09090b, #18181b)',
    config: {
      material: 'black_acrylic',
      shape: 'rounded_rect',
      widthInches: 16,
      heightInches: 8,
      hardware: 'brass_standoffs',
      backlight: 'warm_gold',
      letteringStyle: 'gold_3d',
      wall: 'slate',
      nightMode: true,
      motifId: 'tree_of_life',
      motifPosition: 'left_side',
      motifSize: 52,
      motifColor: '#fbbf24',
      line1: {
        text: 'Avasthi House',
        font: 'Playfair Display',
        size: 34,
        letterSpacing: 2,
        bold: true,
        italic: true,
        yOffset: -4
      },
      line2: {
        text: 'Flat No. B - 402',
        font: 'Poppins',
        size: 15,
        letterSpacing: 3,
        bold: false,
        italic: false,
        yOffset: 4
      },
      line3: {
        text: 'BLESS OUR HOME',
        font: 'Montserrat',
        size: 10,
        letterSpacing: 5,
        bold: true,
        italic: false,
        yOffset: 6
      }
    }
  },
  {
    id: 'contemporary_dual',
    title: 'Grand Dual-Layer',
    subtitle: 'Teakwood Backing + Floating Glass',
    badge: 'Premium',
    thumbnailColor: 'linear-gradient(135deg, #27272a, #52525b)',
    config: {
      material: 'dual_layer',
      shape: 'rect',
      widthInches: 18,
      heightInches: 10,
      hardware: 'brass_standoffs',
      backlight: 'none',
      letteringStyle: 'gold_3d',
      wall: 'concrete',
      nightMode: false,
      motifId: 'floral_crest',
      motifPosition: 'top_center',
      motifSize: 46,
      motifColor: '#f59e0b',
      line1: {
        text: 'Dr. R. K. Singhal',
        font: 'Cinzel',
        size: 36,
        letterSpacing: 2,
        bold: true,
        italic: false,
        yOffset: 0
      },
      line2: {
        text: '& Dr. Anita Singhal',
        font: 'Great Vibes',
        size: 28,
        letterSpacing: 1,
        bold: false,
        italic: false,
        yOffset: 2
      },
      line3: {
        text: 'AASHIYANA • PLOT 42',
        font: 'Montserrat',
        size: 12,
        letterSpacing: 5,
        bold: true,
        italic: false,
        yOffset: 6
      }
    }
  },
  {
    id: 'traditional_om',
    title: 'Divine Auspicious Om',
    subtitle: 'Walnut Wood + Sacred Om & Arch',
    badge: 'Spiritual',
    thumbnailColor: 'linear-gradient(135deg, #3f2e1e, #1c140c)',
    config: {
      material: 'walnut_wood',
      shape: 'arch',
      widthInches: 15,
      heightInches: 9,
      hardware: 'brass_standoffs',
      backlight: 'warm_gold',
      letteringStyle: 'gold_3d',
      wall: 'ivory',
      nightMode: false,
      motifId: 'om',
      motifPosition: 'top_center',
      motifSize: 45,
      motifColor: '#f59e0b',
      line1: {
        text: 'Shree Niwas',
        font: 'Playfair Display',
        size: 38,
        letterSpacing: 2,
        bold: true,
        italic: false,
        yOffset: 0
      },
      line2: {
        text: 'The Deshmukh Family',
        font: 'Poppins',
        size: 15,
        letterSpacing: 3,
        bold: false,
        italic: false,
        yOffset: 2
      },
      line3: {
        text: 'ATITHI DEVO BHAVA',
        font: 'Montserrat',
        size: 10,
        letterSpacing: 6,
        bold: true,
        italic: false,
        yOffset: 6
      }
    }
  },
  {
    id: 'minimal_slate',
    title: 'Minimalist Charcoal & Silver',
    subtitle: 'Natural Slate + Mirror Silver Letters',
    badge: 'Modern',
    thumbnailColor: 'linear-gradient(135deg, #1e293b, #0f172a)',
    config: {
      material: 'slate_stone',
      shape: 'rect',
      widthInches: 14,
      heightInches: 7,
      hardware: 'silver_screws',
      backlight: 'cool_white',
      letteringStyle: 'silver_mirror',
      wall: 'concrete',
      nightMode: false,
      motifId: 'house_heart',
      motifPosition: 'top_center',
      motifSize: 36,
      motifColor: '#e2e8f0',
      line1: {
        text: 'VERMA RESIDENCE',
        font: 'Montserrat',
        size: 30,
        letterSpacing: 6,
        bold: true,
        italic: false,
        yOffset: 0
      },
      line2: {
        text: 'Penthouse • 1204',
        font: 'Montserrat',
        size: 14,
        letterSpacing: 4,
        bold: false,
        italic: false,
        yOffset: 4
      },
      line3: {
        text: 'SKYLINE HEIGHTS',
        font: 'Montserrat',
        size: 10,
        letterSpacing: 5,
        bold: true,
        italic: false,
        yOffset: 6
      }
    }
  },
  {
    id: 'calligraphy_brass',
    title: 'Imperial Brushed Brass',
    subtitle: 'Golden Sheen + Royal Calligraphy',
    badge: 'Luxury',
    thumbnailColor: 'linear-gradient(135deg, #b45309, #d97706)',
    config: {
      material: 'brushed_brass',
      shape: 'rounded_rect',
      widthInches: 14,
      heightInches: 7,
      hardware: 'brass_standoffs',
      backlight: 'none',
      letteringStyle: 'laser_engraved',
      wall: 'wood_panel',
      nightMode: false,
      motifId: 'peacock',
      motifPosition: 'left_side',
      motifSize: 48,
      motifColor: '#292524',
      line1: {
        text: 'The Mehtas',
        font: 'Great Vibes',
        size: 46,
        letterSpacing: 1,
        bold: false,
        italic: false,
        yOffset: -4
      },
      line2: {
        text: 'Tower 2 • Flat 901',
        font: 'Poppins',
        size: 14,
        letterSpacing: 3,
        bold: true,
        italic: false,
        yOffset: 4
      },
      line3: {
        text: 'EST. 2015',
        font: 'Montserrat',
        size: 10,
        letterSpacing: 5,
        bold: true,
        italic: false,
        yOffset: 8
      }
    }
  }
];

window.TEMPLATES = TEMPLATES;
