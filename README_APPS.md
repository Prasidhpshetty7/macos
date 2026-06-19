# 🚀 Custom macOS Apps

This macOS web clone includes several unique custom apps:

## 📱 Apps List

### 1. **CrimeChat** 🔐
Secure anonymous messaging app
- Real-time chat with Supabase
- Bcrypt password authentication
- Anonymous display names
- Messages auto-delete after 24h
- 3 pre-configured users
- **Login details:** See `CRIMECHAT_CREDENTIALS.md`

### 2. **Matrix Rain** 🟢
The Matrix digital rain screensaver
- Falling green code animation
- Adjustable speed (1-100%)
- Multiple color schemes (green, blue, red, purple, rainbow)
- Pause/play controls
- Reset function
- Auto-hides controls on mouse out

### 3. **Terminal** 💻
Bash-style terminal emulator
- 30+ working commands
- Tab completion
- Command history
- File system simulation

### 4. **QuantumVault** 🔒
Secure file storage (placeholder)

---

## 🎨 Features

All apps have:
- ✅ macOS-style window controls
- ✅ Resizable windows
- ✅ Dock integration
- ✅ Launchpad icons
- ✅ Mission Control support

---

## 📦 Installation

```bash
cd macos
npm install bcryptjs  # Required for CrimeChat
npm run dev
```

---

## 🔧 Configuration

- **CrimeChat:** Edit Supabase credentials in `SecureChat.svelte`
- **Matrix Rain:** Customize colors and speed in the app
- **Terminal:** Add commands in `Terminal.svelte`

---

**Made with ❤️ for Prasidh**
