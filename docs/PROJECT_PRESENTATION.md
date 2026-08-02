# 📊 Sweet County Bakery — Project Presentation Deck

---

## 📽️ SLIDE 1: Title & Overview
### **Sweet County Bakery** — Full-Stack Artisanal E-Commerce Platform
* **Live App**: [https://sweet-county.vercel.app](https://sweet-county.vercel.app)
* **Stack**: React (Vite) + Node.js Express + Vercel Serverless Functions
* **Goal**: Build a modern, visual e-commerce web application with 3D product interactions, automated bakery packing animations, and secure checkout.

---

## 📽️ SLIDE 2: Project Architecture
### **Unified Single-Domain Full-Stack Architecture**
* **Frontend**: React 19, Vanilla CSS (3D Perspective & Motion), React Router v7.
* **Backend**: Node.js Express API running on Vercel Serverless Functions (`/api/*`).
* **Database**: Embedded Instant In-Memory Store / MongoDB Atlas.
* **Deployment**: Hosted on Vercel (`https://sweet-county.vercel.app`).

```
[ Customer Browser ]
         │
         ▼
[ Vercel Edge Cloud ]
 ├── Frontend UI (React 19) ──> Cart & Auth State Context
 └── Serverless API (/api/*) ─> In-Memory / MongoDB Store
```

---

## 📽️ SLIDE 3: Key Features & 3D User Experience
* **3D Levitating Cake Spotlight**: Real-time mouse-tilt container with floating sparkles (`✨ 🍓 🍫 🌟`) and levitating cake motion (`@keyframes floatingCakeAir`).
* **3D Bakery Box Packing Sequence**: 
  1. Selected cake drops into 3D Bakery Box.
  2. Folding lid closes down.
  3. Satin golden ribbon wraps & ties into bow.
  4. Crimson wax seal stamp (`SEALED FRESH • SWEET COUNTY`) applies before payment.
* **Razorpay Online & Cash on Delivery Checkout**: UPI QR Code (GPay, PhonePe, Paytm), Cards, Netbanking, and COD.
* **Admin Dashboard & Live User Database**: Order pipeline tracking + customer accounts list.

---

## 📽️ SLIDE 4: Technical Challenges & Solutions
1. **Challenge 1: Connection Error (`Could not connect to server`)**
   * *Solution*: Unified Frontend and Backend onto **Vercel Serverless Functions** (`api/index.js`), eliminating cross-server connection errors.
2. **Challenge 2: 500 Serverless Execution Error**
   * *Solution*: Converted `api/index.js` from CommonJS to native **ES Module export** (`export default function handler`) matching `package.json` `"type": "module"`.
3. **Challenge 3: 404 Error on Direct Page Refreshes (`/cart`)**
   * *Solution*: Configured Single Page Application (SPA) catch-all rewrite in `vercel.json` (`"source": "/(.*)", "destination": "/index.html"`).

---

## 📽️ SLIDE 5: Conclusion & Future Roadmap
* **Live Production URL**: [https://sweet-county.vercel.app](https://sweet-county.vercel.app)
* **GitHub Repository**: [https://github.com/Soham-ss/Sweet_-County-](https://github.com/Soham-ss/Sweet_-County-)
* **Future Enhancements**: Custom cake customizer tool, push notifications, and live delivery driver GPS tracking!
