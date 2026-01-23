# Quick Start Guide - Mini Blockchain System

## 🚀 Starting the System

### Prerequisites
- Node.js and npm installed
- C++ compiler (g++) and OpenSSL libraries

### Step 1: Start the Backend
```bash
cd c:\Users\ASUS\OneDrive\Desktop\block\backend
g++ -o blockchain main.cpp crypto.cpp wallet.cpp block.cpp blockchain.cpp -I. -lssl -lcrypto -std=c++17 -pthread
./blockchain
# Server starts on http://localhost:5000
```

### Step 2: Start the Frontend
```bash
cd c:\Users\ASUS\OneDrive\Desktop\block\frontend
npm install  # (if not already done)
npm run dev
# Frontend starts on http://localhost:3000
```

### Step 3: Open in Browser
Go to: **http://localhost:3000**

---

## 📖 Usage Guide

### 1️⃣ **Create Your First Wallet**
- Click **Wallet** in the navigation
- Click **Generate New Wallet** button
- Wait for loading spinner to complete ✓
- **Copy and save your public key** (this is your address)
- **Keep your private key secret** (needed to send transactions)

### 2️⃣ **Mine a Block**
- Return to **Dashboard** (Home)
- Click **Mine Block**
- Wait for proof-of-work calculation (~few seconds)
- See success message with block details
- Check the **Blockchain Explorer** to see your mined block

### 3️⃣ **Send a Transaction**
- Go to **Send** page
- Your wallet address auto-fills in "From"
- Paste a receiver's public key in "To" field
  - OR use **Address Book** to save contacts
- Enter amount to send
- Click **Send Transaction**
- See transaction confirmation with hash

### 4️⃣ **Add Contacts**
- In **Send** page, click **Add Contact**
- Enter contact name and their public key
- Click **Save**
- Use **Quick Select** dropdown for faster transactions

### 5️⃣ **Explore Blockchain**
- Click **Blockchain Explorer**
- See all blocks and transaction stats
- Click any block to expand and view details:
  - Block hash and previous hash
  - All transactions in the block
  - Transaction amounts and addresses

---

## 🎨 UI Features

### Hover Effects ✨
- All cards and buttons respond to hover
- Smooth transforms and shadows
- Interactive feedback

### Animations 🎬
- Loading spinners during async operations
- Staggered card reveals
- Smooth transitions between states
- Emoji animations on explorer page

### Dark Mode 🌙
- Automatic detection of system preference
- Can toggle from header
- Full dark theme support

### Responsive Design 📱
- Works on mobile, tablet, and desktop
- Touch-friendly interface
- Optimal layout for all screen sizes

---

## 💡 Tips & Tricks

### For Testing
1. **Create multiple wallets**:
   - Generate wallet 1, save the public key
   - Generate wallet 2, save the public key
   - Use wallet 1 to send to wallet 2

2. **Mine multiple blocks**:
   - Each block takes 10-30 seconds to mine
   - Watch the explorer update in real-time

3. **View transaction details**:
   - Click any block in explorer
   - Expand to see all transactions
   - See transaction hashes and amounts

### For Development
- Frontend auto-reloads on file changes
- Backend needs restart to compile changes
- Check browser console for API errors
- Check backend terminal for server logs

---

## 🔧 Troubleshooting

### "Failed to create wallet" Error
✓ **Solution**: Make sure backend server is running on port 5000
- Check if backend terminal shows "Server running on port 5000"
- Restart backend if needed

### "Failed to load blockchain" Error
✓ **Solution**: Backend must be running
- Go to backend terminal and restart
- Make sure port 5000 is not blocked

### Wallet Page is Empty
✓ **Solution**: Refresh the page (Ctrl+R or Cmd+R)
- Browser might need to reload

### Animations Not Smooth
✓ **Solution**: 
- Close other browser tabs
- Update your browser to latest version
- Check system performance

---

## 📊 API Endpoints

### Backend REST API (Port 5000)

**Create Wallet**
```
POST /api/wallet/create
```

**Send Transaction**
```
POST /api/transaction/send
Body: {
  senderPublicKey, receiverPublicKey,
  amount, timestamp, 
  transactionHash, signatureHex
}
```

**Mine Block**
```
POST /api/blockchain/mine
Body: { minerAddress }
```

**Get Blockchain**
```
GET /api/blockchain
```

**Get Balance**
```
GET /api/blockchain/balance?address=<publicKey>
```

---

## 🎓 Learning Resources

This system teaches:
- **Blockchain fundamentals**: Blocks, chains, mining
- **Cryptography**: Hash functions, digital signatures
- **Consensus**: Proof-of-work algorithm
- **Transactions**: Validation, signing, transmission
- **Modern Web**: React, Next.js, REST APIs
- **Frontend**: Animations, responsive design, dark mode

---

## 📝 Project Structure

```
block/
├── backend/
│   ├── main.cpp              # HTTP server and endpoints
│   ├── blockchain.h/cpp      # Main blockchain logic
│   ├── block.h/cpp          # Block structure and validation
│   ├── transaction.h         # Transaction structure
│   ├── wallet.h/cpp         # Wallet key generation
│   └── crypto.h/cpp         # Cryptographic functions
│
├── frontend/
│   ├── src/app/
│   │   ├── page.tsx         # Dashboard (home)
│   │   ├── wallet/page.tsx  # Wallet management
│   │   ├── send/page.tsx    # Send transactions
│   │   ├── explorer/page.tsx # Blockchain explorer
│   │   └── layout.tsx       # App layout
│   ├── src/components/
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Card.tsx         # Reusable card component
│   │   └── Navbar.tsx       # Mobile navbar
│   ├── src/utils/
│   │   ├── api.ts           # Backend API calls
│   │   └── storage.ts       # Browser storage utilities
│   ├── globals.css          # Global animations and styles
│   └── tailwind.config.ts   # Tailwind configuration
│
└── ENHANCEMENTS.md          # Feature documentation
```

---

## 🌟 What's New

### Version 2.0 Enhancements
✨ **Visual Improvements**
- Gradient text and backgrounds
- Enhanced animations and transitions
- Better color scheme and hierarchy
- Card hover effects
- Button animations

📱 **User Experience**
- Address book for saving contacts
- Better error messages with guidance
- Loading spinners for async operations
- Success/error message feedback
- Responsive mobile design
- Dark mode support

🔧 **Technical**
- Improved error handling in API layer
- State management for user feedback
- Framer Motion animations
- Tailwind CSS utilities
- TypeScript type safety

---

## 🎯 Next Steps

Try these in order:
1. ✅ Create your wallet
2. ✅ Mine 3-5 blocks
3. ✅ Add some contacts
4. ✅ Send a transaction
5. ✅ Explore the blockchain
6. ✅ Check the explorer for your transactions

Enjoy exploring the blockchain! 🚀
