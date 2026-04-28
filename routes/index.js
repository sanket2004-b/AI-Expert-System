// routes/index.js
// Main routes: Home, Query, About, Ticket Generation

const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// ─────────────────────────────────────────
// GET: Home Page
// ─────────────────────────────────────────
router.get('/', (req, res) => {
  res.render('home', {
    title: 'AI Help Desk Expert System',
    messages: req.flash()
  });
});

// ─────────────────────────────────────────
// GET: Ask Query Page (select category)
// ─────────────────────────────────────────
router.get('/query', (req, res) => {
  res.render('query', {
    title: 'Ask a Query',
    messages: req.flash()
  });
});

// ─────────────────────────────────────────
// GET: Expert System Diagnosis Page
// User selects a category, we load step-by-step questions
// ─────────────────────────────────────────
router.get('/diagnose/:category', (req, res) => {
  const category = req.params.category;

  // Valid categories list
  const validCategories = [
    'internet', 'password', 'printer',
    'slow-computer', 'software', 'email'
  ];

  if (!validCategories.includes(category)) {
    req.flash('error', 'Invalid category selected.');
    return res.redirect('/query');
  }

  res.render('diagnose', {
    title: 'Diagnosing Issue',
    category: category,
    messages: req.flash()
  });
});

// ─────────────────────────────────────────
// POST: Inference Engine - Process Answers
// Core AI logic: IF-THEN rule-based decisions
// ─────────────────────────────────────────
router.post('/diagnose', (req, res) => {
  const { category, ...answers } = req.body;

  // Call the Inference Engine
  const result = inferenceEngine(category, answers);

  res.render('result', {
    title: 'Expert Recommendation',
    category,
    result,
    answers,
    messages: req.flash()
  });
});

// ─────────────────────────────────────────
// POST: Generate Support Ticket
// Called when issue is unresolved
// ─────────────────────────────────────────
router.post('/ticket', async (req, res) => {
  try {
    const { name, email, category, problem } = req.body;

    // Basic validation
    if (!name || !email || !category || !problem) {
      req.flash('error', 'All fields are required to generate a ticket.');
      return res.redirect('/query');
    }

    // Create and save ticket in MongoDB
    const ticket = new Ticket({ name, email, category, problem });
    await ticket.save();

    req.flash('success', `Ticket generated successfully! Your Ticket ID: ${ticket.ticketId}`);
    res.render('ticket-confirm', {
      title: 'Ticket Confirmed',
      ticket,
      messages: req.flash()
    });

  } catch (err) {
    console.error('Ticket Error:', err);
    req.flash('error', 'Failed to generate ticket. Please try again.');
    res.redirect('/query');
  }
});

// ─────────────────────────────────────────
// GET: About Page
// ─────────────────────────────────────────
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Expert System',
    messages: req.flash()
  });
});

// ═════════════════════════════════════════
// INFERENCE ENGINE (AI Core Logic)
// Rule-based IF-THEN decision system
// ═════════════════════════════════════════
function inferenceEngine(category, answers) {
  let solutions = [];
  let resolved = false;

  // ── RULE SET 1: Internet Problem ──
  if (category === 'internet') {
    if (answers.wifi === 'no') {
      solutions.push('🔌 Connect to WiFi: Go to Settings → Network → Select your WiFi network and connect.');
      resolved = true;
    }
    if (answers.router === 'no') {
      solutions.push('🔄 Power on your router. Unplug it, wait 30 seconds, and plug it back in.');
      resolved = true;
    }
    if (answers.cable === 'disconnected') {
      solutions.push('🔗 Reconnect the LAN cable securely to both your computer and the router.');
      resolved = true;
    }
    if (answers.browser === 'yes' && answers.wifi === 'yes') {
      solutions.push('🌐 Try clearing browser cache: Settings → Clear Browsing Data → Clear Cache & Cookies.');
      solutions.push('🔁 Also try: Open CMD → type "ipconfig /flushdns" → press Enter.');
      resolved = true;
    }
    if (!resolved) {
      solutions.push('📡 Run Windows Network Troubleshooter: Settings → Network → Troubleshoot.');
      solutions.push('🔧 Contact your ISP (Internet Service Provider) if the issue persists.');
    }
  }

  // ── RULE SET 2: Password Reset ──
  else if (category === 'password') {
    if (answers.forgotten === 'yes') {
      solutions.push('🔑 Click "Forgot Password" on the login page to receive a reset link via email.');
      resolved = true;
    }
    if (answers.locked === 'yes') {
      solutions.push('🔒 Your account is locked. Wait 30 minutes or contact the IT Admin to unlock.');
      resolved = true;
    }
    if (answers.email_access === 'no') {
      solutions.push('📧 You cannot access the reset email. Contact Admin with your Employee ID for manual reset.');
      resolved = true;
    }
    if (!resolved) {
      solutions.push('🛡️ Try your previous passwords. Check if Caps Lock is ON.');
      solutions.push('📞 Contact IT Help Desk for a manual password reset.');
    }
  }

  // ── RULE SET 3: Printer Issue ──
  else if (category === 'printer') {
    if (answers.cable === 'disconnected') {
      solutions.push('🖨️ Reconnect the USB/LAN cable from your computer to the printer firmly.');
      resolved = true;
    }
    if (answers.power === 'no') {
      solutions.push('⚡ Turn on the printer using the power button. Check the power cable connection.');
      resolved = true;
    }
    if (answers.paper === 'yes') {
      solutions.push('📄 Paper jam detected! Open the printer cover carefully and remove jammed paper.');
      resolved = true;
    }
    if (answers.driver === 'no') {
      solutions.push('💾 Printer driver not installed. Visit manufacturer website → Download & install the driver.');
      resolved = true;
    }
    if (!resolved) {
      solutions.push('🔄 Restart the Print Spooler: Control Panel → Services → Print Spooler → Restart.');
      solutions.push('🗑️ Clear print queue: Devices & Printers → Right-click printer → See print jobs → Cancel all.');
    }
  }

  // ── RULE SET 4: Slow Computer ──
  else if (category === 'slow-computer') {
    if (answers.startup === 'yes') {
      solutions.push('🚀 Disable startup programs: Task Manager → Startup tab → Disable unnecessary apps.');
      resolved = true;
    }
    if (answers.storage === 'yes') {
      solutions.push('💾 Free up disk space: Delete temp files → Press Win+R → type %temp% → Delete all files.');
      solutions.push('🗑️ Also run Disk Cleanup: Search "Disk Cleanup" → Select C drive → Clean up.');
      resolved = true;
    }
    if (answers.ram === 'yes') {
      solutions.push('🧠 Close unused applications from Task Manager to free up RAM (Memory).');
      resolved = true;
    }
    if (answers.virus === 'yes') {
      solutions.push('🦠 Run a full antivirus scan immediately using Windows Defender or any antivirus software.');
      resolved = true;
    }
    if (!resolved) {
      solutions.push('🔄 Restart your computer to clear temporary memory.');
      solutions.push('📊 Check Task Manager (Ctrl+Shift+Esc) for high CPU/memory usage processes.');
      solutions.push('🔧 Consider upgrading RAM if the system is consistently slow.');
    }
  }

  // ── RULE SET 5: Software Installation ──
  else if (category === 'software') {
    if (answers.admin === 'no') {
      solutions.push('👑 Run installer as Administrator: Right-click the .exe file → Run as Administrator.');
      resolved = true;
    }
    if (answers.space === 'no') {
      solutions.push('💽 Insufficient disk space. Free up space or install on a different drive.');
      resolved = true;
    }
    if (answers.compatible === 'no') {
      solutions.push('⚙️ Software incompatible with your OS. Check system requirements on the official website.');
      resolved = true;
    }
    if (answers.antivirus === 'yes') {
      solutions.push('🛡️ Antivirus may be blocking installation. Temporarily disable it and try again.');
      resolved = true;
    }
    if (!resolved) {
      solutions.push('📥 Download the software again from the official website (the installer may be corrupted).');
      solutions.push('🔄 Try installing in compatibility mode: Right-click → Properties → Compatibility tab.');
    }
  }

  // ── RULE SET 6: Email Not Working ──
  else if (category === 'email') {
    if (answers.login === 'no') {
      solutions.push('🔐 Cannot login: Reset your email password using the "Forgot Password" option.');
      resolved = true;
    }
    if (answers.sending === 'no') {
      solutions.push('📤 Cannot send emails: Check your SMTP settings. Outgoing server may be blocked by ISP.');
      resolved = true;
    }
    if (answers.storage === 'yes') {
      solutions.push('📦 Mailbox is full! Delete old emails or empty trash/spam folders to free up space.');
      resolved = true;
    }
    if (answers.config === 'no') {
      solutions.push('⚙️ Reconfigure email client with correct IMAP/POP3 settings from your email provider.');
      resolved = true;
    }
    if (!resolved) {
      solutions.push('🌐 Check if the email service is down by visiting downdetector.com.');
      solutions.push('🔄 Try logging in via web browser as a test, and reconfigure your email client.');
    }
  }

  return {
    solutions,
    resolved,
    needsTicket: !resolved || solutions.length === 0
  };
}

module.exports = router;
