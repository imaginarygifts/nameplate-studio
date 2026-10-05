// Name Plate Canvas & Visual Rendering Engine
// Handles high-fidelity live preview, material shaders, 3D lettering, and high-res PNG export.

class PlateRenderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
  }

  // Draw procedural wood grain onto an offscreen canvas or pattern
  createWoodPattern(type = 'teak') {
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 400;
    patternCanvas.height = 400;
    const pctx = patternCanvas.getContext('2d');

    const isTeak = type === 'teak';
    const bgGrad = pctx.createLinearGradient(0, 0, 0, 400);
    if (isTeak) {
      bgGrad.addColorStop(0, '#592909');
      bgGrad.addColorStop(0.3, '#743710');
      bgGrad.addColorStop(0.7, '#602c0b');
      bgGrad.addColorStop(1, '#4d2005');
    } else {
      // Walnut
      bgGrad.addColorStop(0, '#2d1e17');
      bgGrad.addColorStop(0.3, '#3a271e');
      bgGrad.addColorStop(0.7, '#2f2018');
      bgGrad.addColorStop(1, '#1e140f');
    }
    pctx.fillStyle = bgGrad;
    pctx.fillRect(0, 0, 400, 400);

    // Add grain lines
    pctx.lineWidth = 1.5;
    for (let i = 0; i < 70; i++) {
      const y = Math.random() * 400;
      const alpha = 0.05 + Math.random() * 0.15;
      pctx.strokeStyle = Math.random() > 0.5 
        ? `rgba(20, 10, 5, ${alpha})` 
        : (isTeak ? `rgba(180, 110, 50, ${alpha * 0.7})` : `rgba(120, 90, 70, ${alpha * 0.6})`);

      pctx.beginPath();
      pctx.moveTo(0, y);
      pctx.bezierCurveTo(
        130, y + (Math.random() - 0.5) * 25,
        270, y + (Math.random() - 0.5) * 25,
        400, y + (Math.random() - 0.5) * 15
      );
      pctx.stroke();
    }

    // Wood knot effect
    pctx.fillStyle = 'rgba(25, 12, 5, 0.18)';
    pctx.beginPath();
    pctx.ellipse(250, 180, 40, 15, Math.PI / 12, 0, Math.PI * 2);
    pctx.fill();

    return this.ctx.createPattern(patternCanvas, 'repeat');
  }

  // Create brushed metal pattern (Brass / Steel)
  createBrushedPattern(type = 'brass') {
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 300;
    patternCanvas.height = 300;
    const pctx = patternCanvas.getContext('2d');

    const isBrass = type === 'brass';
    const bgGrad = pctx.createLinearGradient(0, 0, 300, 300);
    if (isBrass) {
      bgGrad.addColorStop(0, '#c98a2c');
      bgGrad.addColorStop(0.25, '#f3c368');
      bgGrad.addColorStop(0.5, '#bf7d1b');
      bgGrad.addColorStop(0.75, '#eec067');
      bgGrad.addColorStop(1, '#a66810');
    } else {
      // Stainless Steel
      bgGrad.addColorStop(0, '#94a3b8');
      bgGrad.addColorStop(0.25, '#e2e8f0');
      bgGrad.addColorStop(0.5, '#64748b');
      bgGrad.addColorStop(0.75, '#cbd5e1');
      bgGrad.addColorStop(1, '#475569');
    }
    pctx.fillStyle = bgGrad;
    pctx.fillRect(0, 0, 300, 300);

    // Fine brush lines
    for (let i = 0; i < 200; i++) {
      const y = Math.random() * 300;
      const alpha = 0.04 + Math.random() * 0.08;
      pctx.strokeStyle = Math.random() > 0.5 ? `rgba(255, 255, 255, ${alpha})` : `rgba(0, 0, 0, ${alpha})`;
      pctx.lineWidth = 1;
      pctx.beginPath();
      pctx.moveTo(0, y);
      pctx.lineTo(300, y + (Math.random() - 0.5) * 4);
      pctx.stroke();
    }

    return this.ctx.createPattern(patternCanvas, 'repeat');
  }

  // Create Slate Stone pattern
  createSlatePattern() {
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 250;
    patternCanvas.height = 250;
    const pctx = patternCanvas.getContext('2d');

    pctx.fillStyle = '#1e242b';
    pctx.fillRect(0, 0, 250, 250);

    // Subtle noise & stone texture
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * 250;
      const y = Math.random() * 250;
      const r = Math.random() * 2;
      const alpha = 0.05 + Math.random() * 0.1;
      pctx.fillStyle = Math.random() > 0.5 ? `rgba(255, 255, 255, ${alpha})` : `rgba(0, 0, 0, ${alpha * 2})`;
      pctx.beginPath();
      pctx.arc(x, y, r, 0, Math.PI * 2);
      pctx.fill();
    }

    return this.ctx.createPattern(patternCanvas, 'repeat');
  }

  // Draw realistic Standoff hardware stud
  drawStandoff(x, y, radius = 12, isBrass = true) {
    const ctx = this.ctx;
    ctx.save();

    // Drop shadow under standoff
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 4;

    // Outer cylinder body
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    const grad = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
    if (isBrass) {
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.3, '#ca8a04');
      grad.addColorStop(0.7, '#854d0e');
      grad.addColorStop(1, '#fef08a');
    } else {
      grad.addColorStop(0, '#f8fafc');
      grad.addColorStop(0.3, '#94a3b8');
      grad.addColorStop(0.7, '#475569');
      grad.addColorStop(1, '#f1f5f9');
    }
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

    // Inner bevel rim
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.75, 0, Math.PI * 2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = isBrass ? 'rgba(255, 255, 200, 0.6)' : 'rgba(255, 255, 255, 0.7)';
    ctx.stroke();

    // Screw center cap
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.45, 0, Math.PI * 2);
    const centerGrad = ctx.createRadialGradient(x - 1, y - 1, 1, x, y, radius * 0.45);
    if (isBrass) {
      centerGrad.addColorStop(0, '#fef08a');
      centerGrad.addColorStop(0.8, '#a16207');
      centerGrad.addColorStop(1, '#713f12');
    } else {
      centerGrad.addColorStop(0, '#ffffff');
      centerGrad.addColorStop(0.8, '#64748b');
      centerGrad.addColorStop(1, '#334155');
    }
    ctx.fillStyle = centerGrad;
    ctx.fill();
    ctx.restore();
  }

  // Draw Path or SVG Path onto Canvas
  drawSvgPath(svgPathD, x, y, width, height, color, finish = 'gold_3d') {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x - width / 2, y - height / 2);

    const pathObj = new Path2D(svgPathD);
    const scaleX = width / 100;
    const scaleY = height / 100;
    ctx.scale(scaleX, scaleY);

    if (finish === 'gold_3d') {
      // 3D Shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 3;

      const grad = ctx.createLinearGradient(0, 0, 100, 100);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.3, '#eab308');
      grad.addColorStop(0.7, '#ca8a04');
      grad.addColorStop(1, '#92400e');
      ctx.fillStyle = grad;
      ctx.fill(pathObj);

      ctx.lineWidth = 1.2;
      ctx.strokeStyle = '#fef9c3';
      ctx.stroke(pathObj);
    } else if (finish === 'silver_mirror') {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 3;

      const grad = ctx.createLinearGradient(0, 0, 100, 100);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, '#cbd5e1');
      grad.addColorStop(1, '#64748b');
      ctx.fillStyle = grad;
      ctx.fill(pathObj);
    } else {
      ctx.fillStyle = color || '#ffffff';
      ctx.fill(pathObj);
    }

    ctx.restore();
  }

  // Main Render Function
  render(config, options = {}) {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const isExport = options.isExport || false;

    // Set canvas dimensions
    const scale = isExport ? 2.5 : 1;
    const baseW = 900;
    const baseH = 550;
    canvas.width = baseW * scale;
    canvas.height = baseH * scale;

    ctx.save();
    ctx.scale(scale, scale);

    // 1. Draw Background / Environment Wall
    this.drawWallBackground(config.wall, config.nightMode, baseW, baseH);

    // 2. Compute Plate Coordinates & Dimensions
    const aspect = (config.widthInches || 16) / (config.heightInches || 8);
    let plateW = 660;
    let plateH = plateW / aspect;

    if (plateH > 380) {
      plateH = 380;
      plateW = plateH * aspect;
    }

    const plateX = (baseW - plateW) / 2;
    const plateY = (baseH - plateH) / 2;

    // 3. Draw LED Backlight Glow if enabled
    if (config.backlight && config.backlight !== 'none') {
      this.drawBacklightGlow(plateX, plateY, plateW, plateH, config.shape, config.backlight);
    }

    // 4. Draw Plate Realistic Cast Shadow onto Wall
    this.drawPlateShadow(plateX, plateY, plateW, plateH, config.shape);

    // 5. Draw Dual-layer base if applicable
    if (config.material === 'dual_layer') {
      this.drawPlateBody(plateX - 8, plateY - 8, plateW + 16, plateH + 16, config.shape, 'teak_wood', false);
      // Floating clear acrylic front plate
      this.drawPlateBody(plateX, plateY, plateW, plateH, config.shape, 'clear_glass', true);
    } else {
      // Single plate body
      this.drawPlateBody(plateX, plateY, plateW, plateH, config.shape, config.material, false);
    }

    // 6. Draw Motifs & Emblems
    this.drawMotif(config, plateX, plateY, plateW, plateH);

    // 7. Draw Typography / Text lines
    this.drawTextLines(config, plateX, plateY, plateW, plateH);

    // 8. Draw Hardware Standoffs / Screws
    this.drawHardware(config, plateX, plateY, plateW, plateH);

    ctx.restore();
  }

  // Draw wall background
  drawWallBackground(wallType = 'brick', isNight = false, w = 900, h = 550) {
    const ctx = this.ctx;
    ctx.save();

    if (wallType === 'brick') {
      ctx.fillStyle = isNight ? '#261b17' : '#8c4e36';
      ctx.fillRect(0, 0, w, h);
      // Brick mortar grid
      ctx.strokeStyle = isNight ? 'rgba(40, 30, 25, 0.4)' : 'rgba(230, 210, 190, 0.25)';
      ctx.lineWidth = 2.5;
      const bH = 28;
      const bW = 75;
      for (let y = 0; y < h; y += bH) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();

        const offset = (Math.floor(y / bH) % 2) * (bW / 2);
        for (let x = offset; x < w; x += bW) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + bH);
          ctx.stroke();
        }
      }
    } else if (wallType === 'slate') {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, isNight ? '#0b0f17' : '#1e293b');
      grad.addColorStop(1, isNight ? '#030712' : '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    } else if (wallType === 'wood_panel') {
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      ctx.fillStyle = isNight ? '#1e140d' : '#452a17';
      ctx.fillRect(0, 0, w, h);
      // Vertical wood slats
      ctx.strokeStyle = isNight ? 'rgba(0,0,0,0.6)' : 'rgba(30, 15, 8, 0.4)';
      ctx.lineWidth = 3;
      for (let x = 0; x < w; x += 45) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
    } else if (wallType === 'concrete') {
      ctx.fillStyle = isNight ? '#1e2024' : '#6b7280';
      ctx.fillRect(0, 0, w, h);
    } else {
      // Default Ivory / Warm clean wall
      const grad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, 450);
      grad.addColorStop(0, isNight ? '#1f2937' : '#f8fafc');
      grad.addColorStop(1, isNight ? '#111827' : '#e2e8f0');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // Vignette overlay
    const vigGrad = ctx.createRadialGradient(w / 2, h / 2, 180, w / 2, h / 2, 450);
    vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vigGrad.addColorStop(1, isNight ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.3)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.restore();
  }

  // Draw LED Backlight
  drawBacklightGlow(x, y, w, h, shape, backlightColor) {
    const ctx = this.ctx;
    ctx.save();

    let glowColor = 'rgba(251, 191, 36, 0.45)'; // Warm Gold
    let edgeGlow = '#fbbf24';
    if (backlightColor === 'cool_white') {
      glowColor = 'rgba(224, 242, 254, 0.45)';
      edgeGlow = '#e0f2fe';
    } else if (backlightColor === 'neon_cyan') {
      glowColor = 'rgba(6, 182, 212, 0.45)';
      edgeGlow = '#06b6d4';
    } else if (backlightColor === 'neon_amber') {
      glowColor = 'rgba(249, 115, 22, 0.45)';
      edgeGlow = '#f97316';
    }

    ctx.shadowColor = edgeGlow;
    ctx.shadowBlur = 40;
    ctx.fillStyle = glowColor;

    this.createShapePath(x - 6, y - 6, w + 12, h + 12, shape);
    ctx.fill();

    ctx.shadowBlur = 20;
    this.createShapePath(x - 2, y - 2, w + 4, h + 4, shape);
    ctx.fill();

    ctx.restore();
  }

  // Draw Plate Shadow
  drawPlateShadow(x, y, w, h, shape) {
    const ctx = this.ctx;
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetX = 8;
    ctx.shadowOffsetY = 16;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.createShapePath(x, y, w, h, shape);
    ctx.fill();
    ctx.restore();
  }

  // Create Shape Path geometry (Rect, Rounded, Arch, Oval, House)
  createShapePath(x, y, w, h, shape = 'rounded_rect') {
    const ctx = this.ctx;
    ctx.beginPath();

    if (shape === 'rounded_rect') {
      const radius = 24;
      ctx.roundRect(x, y, w, h, radius);
    } else if (shape === 'arch') {
      const r = w / 2;
      ctx.moveTo(x, y + h);
      ctx.lineTo(x, y + r);
      ctx.arc(x + r, y + r, r, Math.PI, 0, false);
      ctx.lineTo(x + w, y + h);
      ctx.closePath();
    } else if (shape === 'oval') {
      ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    } else if (shape === 'house') {
      const roofH = h * 0.28;
      ctx.moveTo(x + w / 2, y);
      ctx.lineTo(x + w, y + roofH);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x, y + roofH);
      ctx.closePath();
    } else {
      // Default modern crisp rectangle
      ctx.rect(x, y, w, h);
    }
  }

  // Draw main plate body with material texture
  drawPlateBody(x, y, w, h, shape, material, isGlassOverlay = false) {
    const ctx = this.ctx;
    ctx.save();

    this.createShapePath(x, y, w, h, shape);
    ctx.clip();

    if (material === 'teak_wood') {
      ctx.fillStyle = this.createWoodPattern('teak');
      ctx.fillRect(x, y, w, h);
    } else if (material === 'walnut_wood') {
      ctx.fillStyle = this.createWoodPattern('walnut');
      ctx.fillRect(x, y, w, h);
    } else if (material === 'black_acrylic') {
      // Ultra glossy obsidian black
      const grad = ctx.createLinearGradient(x, y, x + w, y + h);
      grad.addColorStop(0, '#1c1917');
      grad.addColorStop(0.3, '#09090b');
      grad.addColorStop(0.7, '#000000');
      grad.addColorStop(1, '#18181b');
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, w, h);

      // Specular light sweep reflection
      const glint = ctx.createLinearGradient(x, y, x + w * 0.7, y + h);
      glint.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      glint.addColorStop(0.45, 'rgba(255, 255, 255, 0.02)');
      glint.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
      glint.addColorStop(0.55, 'rgba(255, 255, 255, 0.02)');
      glint.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glint;
      ctx.fillRect(x, y, w, h);
    } else if (material === 'brushed_brass') {
      ctx.fillStyle = this.createBrushedPattern('brass');
      ctx.fillRect(x, y, w, h);
    } else if (material === 'stainless_steel') {
      ctx.fillStyle = this.createBrushedPattern('steel');
      ctx.fillRect(x, y, w, h);
    } else if (material === 'slate_stone') {
      ctx.fillStyle = this.createSlatePattern();
      ctx.fillRect(x, y, w, h);
    } else if (material === 'clear_glass' || isGlassOverlay) {
      // Clear elevated acrylic / glass with frosted reflection
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(x, y, w, h);

      const glassShine = ctx.createLinearGradient(x, y, x + w, y + h);
      glassShine.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
      glassShine.addColorStop(0.3, 'rgba(255, 255, 255, 0.04)');
      glassShine.addColorStop(0.7, 'rgba(255, 255, 255, 0.12)');
      glassShine.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
      ctx.fillStyle = glassShine;
      ctx.fillRect(x, y, w, h);
    }

    // Outer Beveled Edge Border
    ctx.lineWidth = 3;
    const borderGrad = ctx.createLinearGradient(x, y, x + w, y + h);
    if (material === 'brushed_brass') {
      borderGrad.addColorStop(0, 'rgba(254, 240, 138, 0.8)');
      borderGrad.addColorStop(1, 'rgba(146, 64, 14, 0.6)');
    } else if (material === 'black_acrylic' || material === 'clear_glass') {
      borderGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      borderGrad.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
    } else {
      borderGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
      borderGrad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    }
    ctx.strokeStyle = borderGrad;
    this.createShapePath(x, y, w, h, shape);
    ctx.stroke();

    ctx.restore();
  }

  // Draw Decorative Motif
  drawMotif(config, px, py, pw, ph) {
    if (!config.motifId || config.motifId === 'none') return;
    const motif = window.MOTIFS && window.MOTIFS[config.motifId];
    if (!motif || !motif.path) return;

    const size = config.motifSize || 44;
    let mx = px + pw / 2;
    let my = py + ph * 0.25;

    if (config.motifPosition === 'top_center') {
      mx = px + pw / 2;
      my = py + size * 0.65 + 16;
    } else if (config.motifPosition === 'left_side') {
      mx = px + size * 0.75 + 24;
      my = py + ph / 2;
    } else if (config.motifPosition === 'right_side') {
      mx = px + pw - size * 0.75 - 24;
      my = py + ph / 2;
    }

    this.drawSvgPath(motif.path, mx, my, size, size, config.motifColor || '#f59e0b', config.letteringStyle);
  }

  // Draw All Typography Lines with 3D Bevel, Letter Spacing & Shadows
  drawTextLines(config, px, py, pw, ph) {
    const ctx = this.ctx;
    const centerY = py + ph / 2;
    const hasMotifTop = config.motifId && config.motifId !== 'none' && config.motifPosition === 'top_center';
    const topOffset = hasMotifTop ? (config.motifSize || 44) * 0.45 : 0;

    const lines = [
      { cfg: config.line1, defaultY: centerY - 24 + topOffset },
      { cfg: config.line2, defaultY: centerY + 26 + topOffset },
      { cfg: config.line3, defaultY: centerY + 64 + topOffset }
    ];

    lines.forEach((item) => {
      const line = item.cfg;
      if (!line || !line.text || line.text.trim() === '') return;

      const fontSize = line.size || 28;
      const fontName = line.font || 'Cinzel';
      const isBold = line.bold ? 'bold ' : '';
      const isItalic = line.italic ? 'italic ' : '';
      ctx.font = `${isItalic}${isBold}${fontSize}px "${fontName}", serif, sans-serif`;

      let textX = px + pw / 2;
      if (config.motifPosition === 'left_side' && config.motifId !== 'none') {
        textX = px + pw * 0.58;
      } else if (config.motifPosition === 'right_side' && config.motifId !== 'none') {
        textX = px + pw * 0.42;
      }

      const textY = item.defaultY + (line.yOffset || 0);
      const letterSpacing = line.letterSpacing || 2;

      this.renderStyledText(line.text, textX, textY, fontSize, letterSpacing, config.letteringStyle, config.material);
    });
  }

  // Render individual text line with realistic finish
  renderStyledText(text, x, y, size, spacing, finish = 'gold_3d', material = 'teak_wood') {
    const ctx = this.ctx;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Measure total width including letter spacing
    const chars = text.split('');
    let totalW = 0;
    const charWidths = chars.map((ch) => {
      const w = ctx.measureText(ch).width + spacing;
      totalW += w;
      return w;
    });

    let startX = x - totalW / 2;

    if (finish === 'gold_3d') {
      // 1. Deep 3D Cast Shadow
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      let cx = startX;
      chars.forEach((ch, idx) => {
        ctx.fillText(ch, cx + charWidths[idx] / 2 + 2, y + 4);
        cx += charWidths[idx];
      });
      ctx.restore();

      // 2. 3D Golden Extrusion Layer
      ctx.save();
      ctx.fillStyle = '#92400e';
      cx = startX;
      chars.forEach((ch, idx) => {
        ctx.fillText(ch, cx + charWidths[idx] / 2 + 1, y + 2);
        cx += charWidths[idx];
      });
      ctx.restore();

      // 3. Front Face Golden Lustrous Gradient
      const goldGrad = ctx.createLinearGradient(0, y - size / 2, 0, y + size / 2);
      goldGrad.addColorStop(0, '#fef08a');
      goldGrad.addColorStop(0.35, '#facc15');
      goldGrad.addColorStop(0.7, '#ca8a04');
      goldGrad.addColorStop(1, '#854d0e');
      ctx.fillStyle = goldGrad;

      cx = startX;
      chars.forEach((ch, idx) => {
        ctx.fillText(ch, cx + charWidths[idx] / 2, y);
        cx += charWidths[idx];
      });

      // 4. Subtle Top Edge Highlight
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = '#fef9c3';
      cx = startX;
      chars.forEach((ch, idx) => {
        ctx.strokeText(ch, cx + charWidths[idx] / 2, y);
        cx += charWidths[idx];
      });

    } else if (finish === 'silver_mirror') {
      // Mirror Silver 3D
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      let cx = startX;
      chars.forEach((ch, idx) => {
        ctx.fillText(ch, cx + charWidths[idx] / 2 + 2, y + 3);
        cx += charWidths[idx];
      });
      ctx.restore();

      const silverGrad = ctx.createLinearGradient(0, y - size / 2, 0, y + size / 2);
      silverGrad.addColorStop(0, '#ffffff');
      silverGrad.addColorStop(0.4, '#e2e8f0');
      silverGrad.addColorStop(0.75, '#94a3b8');
      silverGrad.addColorStop(1, '#475569');
      ctx.fillStyle = silverGrad;

      cx = startX;
      chars.forEach((ch, idx) => {
        ctx.fillText(ch, cx + charWidths[idx] / 2, y);
        cx += charWidths[idx];
      });

    } else if (finish === 'laser_engraved') {
      // Engraved Inset look (Inner Shadow)
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      let cx = startX;
      chars.forEach((ch, idx) => {
        ctx.fillText(ch, cx + charWidths[idx] / 2 + 1, y + 1);
        cx += charWidths[idx];
      });
      ctx.restore();

      // Inlay color
      ctx.fillStyle = material.includes('wood') ? '#1c1007' : '#0f172a';
      cx = startX;
      chars.forEach((ch, idx) => {
        ctx.fillText(ch, cx + charWidths[idx] / 2, y);
        cx += charWidths[idx];
      });

    } else if (finish === 'matte_white') {
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = '#f8fafc';
      let cx = startX;
      chars.forEach((ch, idx) => {
        ctx.fillText(ch, cx + charWidths[idx] / 2, y);
        cx += charWidths[idx];
      });
      ctx.restore();

    } else {
      // Matte Black
      ctx.fillStyle = '#0f172a';
      let cx = startX;
      chars.forEach((ch, idx) => {
        ctx.fillText(ch, cx + charWidths[idx] / 2, y);
        cx += charWidths[idx];
      });
    }

    ctx.restore();
  }

  // Draw Corner Hardware Standoffs / Screws
  drawHardware(config, px, py, pw, ph) {
    if (!config.hardware || config.hardware === 'none') return;

    const isBrass = config.hardware === 'brass_standoffs';
    const inset = 24;

    if (config.hardware === 'brass_standoffs' || config.hardware === 'silver_screws') {
      // 4 Corners
      this.drawStandoff(px + inset, py + inset, 11, isBrass);
      this.drawStandoff(px + pw - inset, py + inset, 11, isBrass);
      this.drawStandoff(px + inset, py + ph - inset, 11, isBrass);
      this.drawStandoff(px + pw - inset, py + ph - inset, 11, isBrass);
    } else if (config.hardware === 'hanging_chain') {
      // 2 Top hanging eyelets
      this.drawStandoff(px + pw * 0.25, py + inset * 0.8, 10, true);
      this.drawStandoff(px + pw * 0.75, py + inset * 0.8, 10, true);
    }
  }

  // Export Canvas as High-Res Data URL or Blob
  getHighResDataURL(config) {
    // Re-render at 2.5x high-res
    this.render(config, { isExport: true });
    const dataUrl = this.canvas.toDataURL('image/png', 0.95);
    // Restore normal resolution
    this.render(config, { isExport: false });
    return dataUrl;
  }
}

window.PlateRenderer = PlateRenderer;
