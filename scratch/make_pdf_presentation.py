import os
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

pdf_path = "docs/Sweet_County_Bakery_Presentation.pdf"
os.makedirs("docs", exist_ok=True)

# 16:9 Landscape Dimensions
PAGE_WIDTH, PAGE_HEIGHT = landscape(letter) # 792 x 612 pt

doc = SimpleDocTemplate(
    pdf_path,
    pagesize=(PAGE_WIDTH, PAGE_HEIGHT),
    leftMargin=36,
    rightMargin=36,
    topMargin=36,
    bottomMargin=36
)

styles = getSampleStyleSheet()

# Custom Color Palette
BROWN = colors.HexColor('#4b3832')
GOLD = colors.HexColor('#f1d27a')
ACCENT = colors.HexColor('#a36b4f')
DARK_BG = colors.HexColor('#2d1e18')
LIGHT_BG = colors.HexColor('#faf7f2')
TEXT_COLOR = colors.HexColor('#3d2b1f')
WHITE = colors.HexColor('#ffffff')

# Custom Typography Styles
title_style = ParagraphStyle(
    'TitleStyle',
    parent=styles['Heading1'],
    fontName='Helvetica-Bold',
    fontSize=24,
    leading=30,
    textColor=DARK_BG,
    spaceAfter=8
)

cover_title_style = ParagraphStyle(
    'CoverTitleStyle',
    parent=styles['Heading1'],
    fontName='Helvetica-Bold',
    fontSize=34,
    leading=40,
    textColor=DARK_BG,
    spaceAfter=15
)

cover_sub_style = ParagraphStyle(
    'CoverSubStyle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=16,
    leading=22,
    textColor=BROWN,
    spaceAfter=25
)

subtitle_style = ParagraphStyle(
    'SubtitleStyle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=11,
    leading=14,
    textColor=ACCENT,
    spaceAfter=4
)

body_style = ParagraphStyle(
    'BodyStyle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=12,
    leading=17,
    textColor=TEXT_COLOR,
    spaceAfter=8
)

bullet_style = ParagraphStyle(
    'BulletStyle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=12,
    leading=17,
    textColor=TEXT_COLOR,
    spaceAfter=6,
    leftIndent=15
)

def create_slide_header(category, title):
    return [
        Paragraph(category.upper(), subtitle_style),
        Paragraph(title, title_style),
        HRFlowable(width="100%", thickness=1.5, color=ACCENT, spaceAfter=15)
    ]

story = []

# ==================== SLIDE 1: COVER SLIDE ====================
story.append(Paragraph("SWEET COUNTY BAKERY — PROJECT DECK", subtitle_style))
story.append(Paragraph("🍰 Sweet County Bakery", cover_title_style))
story.append(Paragraph("Full-Stack Artisanal E-Commerce Platform with 3D Product Spotlights & Animated Packing", cover_sub_style))
story.append(Spacer(1, 20))
story.append(Paragraph("<b>Live URL:</b> <font color='#a36b4f'><u>https://sweet-county.vercel.app</u></font>", ParagraphStyle('CUrl', parent=body_style, fontSize=14)))
story.append(Paragraph("<b>Architecture:</b> React 19 + Node.js Express + Vercel Serverless Functions", ParagraphStyle('CArch', parent=body_style, fontSize=13, textColor=ACCENT)))
story.append(PageBreak())

# ==================== SLIDE 2: EXECUTIVE SUMMARY & OBJECTIVES ====================
story.extend(create_slide_header("Project Scope & Overview", "🍰 Executive Summary & Business Need"))
story.append(Paragraph("<b>Sweet County Bakery</b> is a modern e-commerce web application engineered to transform online artisanal bakery sales through visual interactivity and reassuring user flows.", body_style))
story.append(Spacer(1, 10))
story.append(Paragraph("<b>Core Project Objectives:</b>", ParagraphStyle('BoldH', parent=body_style, fontName='Helvetica-Bold')))
story.append(Paragraph("• <b>High-Fidelity Visual Appeal:</b> Deliver a wow-factor experience with glassmorphism, 3D perspective tilts, and dynamic bakery backgrounds.", bullet_style))
story.append(Paragraph("• <b>Interactive Product Discovery:</b> Enable customers to inspect 44 artisanal treats (cakes, pastries, donuts, brownies) in mid-air floating 3D space.", bullet_style))
story.append(Paragraph("• <b>Delightful Checkout Experience:</b> Implement a custom 3D bakery box packing animation before payment.", bullet_style))
story.append(Paragraph("• <b>Zero-Delay Serverless Deployment:</b> Unify frontend & backend into a single-domain Vercel deployment with instant response times.", bullet_style))
story.append(PageBreak())

# ==================== SLIDE 3: COMPLETE TECH STACK ====================
story.extend(create_slide_header("Technical Architecture", "💻 Technology Stack & Infrastructure"))
story.append(Paragraph("The platform is built on modern web technologies ensuring speed, security, and scalability:", body_style))
story.append(Spacer(1, 10))

table_data = [
    [Paragraph("<b>Component</b>", body_style), Paragraph("<b>Technologies Used</b>", body_style), Paragraph("<b>Key Responsibilities</b>", body_style)],
    [Paragraph("<b>Frontend UI</b>", body_style), Paragraph("React 19, Vite, Vanilla CSS 3D", body_style), Paragraph("Single Page Application, 3D canvas, state management", body_style)],
    [Paragraph("<b>Routing & State</b>", body_style), Paragraph("React Router v7, Context API", body_style), Paragraph("Client-side navigation, AuthContext, CartContext", body_style)],
    [Paragraph("<b>Backend API</b>", body_style), Paragraph("Node.js, Express, Vercel Serverless", body_style), Paragraph("Authentication, product catalog, orders, payment verification", body_style)],
    [Paragraph("<b>Database</b>", body_style), Paragraph("Embedded In-Memory / MongoDB Atlas", body_style), Paragraph("User accounts, product catalog, order history", body_style)],
    [Paragraph("<b>Hosting Platform</b>", body_style), Paragraph("Vercel (Single-Domain Edge)", body_style), Paragraph("Static asset serving & serverless API execution", body_style)]
]

t = Table(table_data, colWidths=[140, 240, 320])
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), LIGHT_BG),
    ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#e0d5c1')),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('PADDING', (0,0), (-1,-1), 8)
]))
story.append(t)
story.append(PageBreak())

# ==================== SLIDE 4: SYSTEM ARCHITECTURE & DATA FLOW ====================
story.extend(create_slide_header("Data Flow & Routing", "🏗️ System Architecture & Data Flow"))
story.append(Paragraph("The application leverages an <b>All-in-One Serverless Architecture</b> hosted entirely on Vercel:", body_style))
story.append(Spacer(1, 10))
story.append(Paragraph("• <b>Unified Single Domain:</b> Both the React web application and Express API operate under <code>https://sweet-county.vercel.app</code>.", bullet_style))
story.append(Paragraph("• <b>Serverless API Rewrites:</b> API calls to <code>/api/*</code> automatically map to Vercel Serverless Functions (<code>api/index.js</code>) with 0ms cross-origin latency.", bullet_style))
story.append(Paragraph("• <b>SPA Client-Side Routing:</b> Wildcard fallback rewrite (<code>/(.*) -> /index.html</code>) prevents 404 errors during page refreshes or direct URL access.", bullet_style))
story.append(Paragraph("• <b>Instant In-Memory Persistence:</b> Pre-loaded with 44 artisanal bakery items, default admin credentials, and live order tracking.", bullet_style))
story.append(PageBreak())

# ==================== SLIDE 5: FEATURE SPOTLIGHT: 3D LEVITATING CAKE SPOTLIGHT ====================
story.extend(create_slide_header("User Experience", "✨ Feature 1: 3D Levitating Cake Spotlight"))
story.append(Paragraph("Clicking any cake card opens an interactive 3D spotlight modal designed to captivate customers:", body_style))
story.append(Spacer(1, 10))
story.append(Paragraph("• <b>Real-Time 3D Mouse Tilt:</b> Hovering over the spotlight tilts the cake container in 3D perspective based on cursor coordinates.", bullet_style))
story.append(Paragraph("• <b>Smooth Mid-Air Floating Motion:</b> Cake image levitates gracefully in mid-air using CSS keyframes (<code>@keyframes floatingCakeAir</code>).", bullet_style))
story.append(Paragraph("• <b>Pulsing Floor Shadow:</b> Dynamic floor shadow expands and contracts underneath the floating cake (<code>@keyframes floatingShadowPulse</code>).", bullet_style))
story.append(Paragraph("• <b>Orbital Sparkles:</b> Decorative emojis (<code>✨ 🍓 🍫 🌟</code>) float around the stage in 3D space.", bullet_style))
story.append(PageBreak())

# ==================== SLIDE 6: FEATURE SPOTLIGHT: 3D BAKERY BOX PACKING ANIMATION ====================
story.extend(create_slide_header("Checkout Delighters", "📦 Feature 2: 3D Bakery Box Packing Animation"))
story.append(Paragraph("To create excitement before payment, clicking 'Pack & Proceed to Payment' triggers a 4-step 3D packing sequence:", body_style))
story.append(Spacer(1, 10))
story.append(Paragraph("1. <b>Cake Drop (Step 1):</b> Selected cake drops into a 3D Sweet County Bakery Box (<code>@keyframes dropCakeIntoBox</code>).", bullet_style))
story.append(Paragraph("2. <b>Lid Fold (Step 2):</b> Branded lid folds down to seal the box tightly.", bullet_style))
story.append(Paragraph("3. <b>Ribbon Tie (Step 3):</b> Satin golden ribbon wraps across the box and ties into a bow.", bullet_style))
story.append(Paragraph("4. <b>Wax Seal Stamp (Step 4):</b> Crimson wax stamp (<code>SEALED FRESH • SWEET COUNTY</code>) presses onto the box before transitioning to payment.", bullet_style))
story.append(PageBreak())

# ==================== SLIDE 7: FEATURE SPOTLIGHT: REASSURING CHECKOUT & PAYMENT ====================
story.extend(create_slide_header("Payment Infrastructure", "💳 Feature 3: Reassuring Checkout & Payment"))
story.append(Paragraph("The payment page provides a reassuring, hassle-free ordering experience with multiple options:", body_style))
story.append(Spacer(1, 10))
story.append(Paragraph("• <b>Razorpay Online Gateway Test Modal:</b> Interactive checkout popup supporting UPI QR Code (GPay, PhonePe, Paytm, BHIM), Credit/Debit Cards, and Netbanking.", bullet_style))
story.append(Paragraph("• <b>Cash on Delivery (COD):</b> One-click COD order booking for customers who prefer paying at their doorstep.", bullet_style))
story.append(Paragraph("• <b>Sweet County Delight Guarantee:</b> Reassuring trust badge offering 100% fresh replacement guarantee.", bullet_style))
story.append(Paragraph("• <b>Order Confirmation Screen:</b> Celebration screen with unique Order ID and 45-minute fresh delivery estimate.", bullet_style))
story.append(PageBreak())

# ==================== SLIDE 8: ADMIN DASHBOARD & CUSTOMER DATABASE ====================
story.extend(create_slide_header("Management Console", "👑 Feature 4: Admin Dashboard & Customer Database"))
story.append(Paragraph("Admins have full visibility over order operations and registered customer accounts:", body_style))
story.append(Spacer(1, 10))
story.append(Paragraph("• <b>Order Pipeline Management:</b> Real-time status update controls (<code>Pending</code> ➔ <code>Confirmed</code> ➔ <code>Out for Delivery</code> ➔ <code>Delivered</code> ➔ <code>Cancelled</code>).", bullet_style))
story.append(Paragraph("• <b>Revenue & Order Analytics:</b> Live tracking of total revenue, pending orders, and delivery metrics.", bullet_style))
story.append(Paragraph("• <b>👥 User Database View:</b> Admin tab displaying all registered customer names, emails, user IDs, and account roles.", bullet_style))
story.append(Paragraph("• <b>Security Controls:</b> Change admin password and create new admin accounts directly from the dashboard.", bullet_style))
story.append(PageBreak())

# ==================== SLIDE 9: CHALLENGES, FIXES & PRODUCTION DEPLOYMENT ====================
story.extend(create_slide_header("Engineering Retrospective", "🚧 Challenges, Technical Solutions & Production Deployment"))
story.append(Paragraph("Key engineering hurdles encountered during deployment and their technical solutions:", body_style))
story.append(Spacer(1, 10))

table_data2 = [
    [Paragraph("<b>#</b>", body_style), Paragraph("<b>Challenge Encountered</b>", body_style), Paragraph("<b>Root Cause</b>", body_style), Paragraph("<b>Technical Solution</b>", body_style)],
    [Paragraph("<b>1</b>", body_style), Paragraph("Could not connect to server", body_style), Paragraph("Frontend called localhost / sleeping Render free tiers", body_style), Paragraph("Unified frontend & backend into Vercel Serverless Functions", body_style)],
    [Paragraph("<b>2</b>", body_style), Paragraph("500 Serverless API Error", body_style), Paragraph("package.json specified type:module vs CommonJS exports", body_style), Paragraph("Converted api/index.js to ES Module format (export default handler)", body_style)],
    [Paragraph("<b>3</b>", body_style), Paragraph("404 Error on Page Refresh", body_style), Paragraph("Vercel looked for static cart.html files on refresh", body_style), Paragraph("Added SPA catch-all rewrite to vercel.json (/(.*) -> /index.html)", body_style)]
]

t2 = Table(table_data2, colWidths=[25, 175, 230, 270])
t2.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), LIGHT_BG),
    ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#e0d5c1')),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('PADDING', (0,0), (-1,-1), 6)
]))
story.append(t2)
story.append(Spacer(1, 15))
story.append(Paragraph("<b>Live Website:</b> <font color='#a36b4f'><b>https://sweet-county.vercel.app</b></font>", ParagraphStyle('LiveB', parent=body_style, fontName='Helvetica-Bold', fontSize=13)))

doc.build(story)
print(f"Presentation PDF successfully created at {pdf_path} (9 Slides)!")
