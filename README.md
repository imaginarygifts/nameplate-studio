# ✨ ArtisansPlate Studio - Custom Name Plate Web Application

A full-featured, luxury web application for your custom name plate business. Customers can customize, preview in real-time on different walls, generate high-resolution design snapshots, and order directly through WhatsApp with pre-filled specifications and design images.

---

## 🚀 Key Features

1. **🎨 Interactive Name Plate Studio**:
   - **Realistic Materials**: Natural Teakwood, Deep Walnut Wood, Glossy Obsidian Black Acrylic, Brushed Golden Brass, Stainless Steel, Slate Stone, and Floating Dual-Layer (Wood + Glass).
   - **Shapes**: Modern Rectangle, Rounded Corners, Dome Arch, Traditional Oval, and House Crest.
   - **Dimensions**: Presets (12"×6", 16"×8", 18"×10", 24"×12") or custom width & height sliders.
   - **3D Lettering Finishes**: Raised 3D Golden Acrylic, 3D Mirror Silver Chrome, Deep Laser Engraved Inset, and Matte White.
   - **Sacred & Decorative Motifs**: Lord Ganesha, Om (ॐ), Swastik (卐), Tree of Life, Royal Peacock, Sweet Home, Sacred Cross, Crescent & Star, Buddha, and Love Birds with adjustable positioning.
   - **Mounting Accents**: 4 Golden Brass Standoffs, Stainless Steel Screws, or Hidden Adhesive.
   - **Illumination & Night Mode**: Optional LED backlight (Warm Golden 3000K, Cool White 6000K) with Day/Night toggle to view the glow against different walls.

2. **📲 Seamless WhatsApp Ordering**:
   - Generates a **high-resolution 300 DPI PNG snapshot** of the custom design.
   - Automatically downloads the preview image to the customer's phone or computer (`Custom-NamePlate-NP-XXXXXX.png`).
   - Automatically opens WhatsApp with a pre-filled, comprehensive order message containing:
     - Unique Order Reference ID (`#NP-XXXXXX`)
     - Customer Name, Phone, and Delivery Address
     - Plate Text (Line 1, Line 2, Line 3, Fonts)
     - Selected Material, Shape & Dimensions
     - Lettering Finish & Motif details
     - LED Backlight and Fitting hardware
     - Total Estimated Price (Free delivery & fittings included)
     - Special notes for the artisan
   - Friendly 3-step prompt instructing customer to attach the downloaded design image into the chat.

3. **💰 Dynamic Price Estimator**:
   - Real-time calculation based on material surface area (sq. inches) + lettering technology + motif + LED backlight.
   - Transparent itemized price breakdown drawer.

4. **🌟 Inspiration Templates**:
   - 6 ready-to-order curated templates (*The Royal Villa*, *Imperial Night Glow*, *Grand Dual-Layer*, *Divine Auspicious Om*, *Minimalist Charcoal*, *Imperial Brushed Brass*).
   - 1-click load into designer.

5. **💾 Customer Accounts & Saved Designs**:
   - Customers can save multiple customized plates to their personal collection.
   - Fast re-loading, duplication, or deletion.
   - Remembers customer name, phone, and delivery address.

6. **⚙️ Business Owner Configuration**:
   - Click the **Gear icon** in the top navbar to configure:
     - Your Shop Name (e.g. *ArtisansPlate*)
     - Your **Business WhatsApp Number** (with country code, e.g. `919876543210`)
     - Currency Symbol (`₹`, `$`, etc.)
     - Base Pricing Multiplier

---

## 🛠️ How to Run the Web Application

The application is completely self-contained (HTML5, Tailwind CSS, Lucide icons, Canvas API). No complex npm build or compile steps are required!

### Option 1: Double-Click (Instant)
Simply open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Safari, Firefox).

### Option 2: Local HTTP Server (PowerShell)
Open PowerShell in the project directory:
```powershell
powershell -ExecutionPolicy Bypass -File server.ps1
```
This starts a lightweight server at `http://localhost:8080/` and opens your browser automatically.

---

## 📱 How to Configure Your WhatsApp Number

1. Open the application.
2. Click the **Gear icon (⚙️)** in the top right corner.
3. In **Business WhatsApp Number**, enter your WhatsApp number with country code (e.g., for India: `919876543210`, for US: `15551234567`). Do not include `+` or hyphens.
4. Click **Save Business Configuration**.
5. All future orders clicked by customers will open directly in chat with your number!

*(Note: You can also permanently change the default number in [`js/app.js`](file:///C:/Users/HP/.gemini/antigravity/scratch/nameplate-studio/js/app.js) line 49).*

---

## 🌐 Free Online Deployment Options

You can host this app online for free in under 2 minutes:

1. **GitHub Pages**:
   - Create a GitHub repository and push this folder.
   - Go to **Settings > Pages > Deploy from Branch (`main`)**.
   - Your custom name plate designer is live!

2. **Netlify or Vercel**:
   - Drag and drop this folder into the Netlify/Vercel dashboard.

3. **Firebase Hosting**:
   - Run `firebase init hosting` and set public directory to `.`
   - Run `firebase deploy --only hosting`.
