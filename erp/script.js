const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyTTSkqdvoiSwaCA3hQd87Jd4PR1RKloBnSxBSFSPfylJaHwyhfebU8aVOf2yVTHqWr/exec";

// 1. ADVANCED LOGIN LOGIC (Admin, Accounts, HR, Dealer)
const USER_ROLES = {
    "admin": { pw: "velox@admin", dept: "Management", access: "all" },
    "accounts": { pw: "velox@acc", dept: "Billing & GST", access: ["billing", "inventory"] },
    "hr": { pw: "velox@hr", dept: "HRMS", access: ["hrms"] },
    "dealer_01": { pw: "velox123", dept: "Bhopal Dealer", access: ["dealer"] }
};

function handleLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;

    if (USER_ROLES[u] && USER_ROLES[u].pw === p) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('erp-dashboard').style.display = 'block';
        document.getElementById('display-user').innerText = "Logged in: " + u;
        document.getElementById('dept-tag').innerText = USER_ROLES[u].dept;
        
        restrictAccess(USER_ROLES[u].access);
    } else {
        alert("Invalid ID or Password!");
    }
}

// 2. RESTRICT MODULES BASED ON ROLE
function restrictAccess(access) {
    const allButtons = ["billing", "inventory", "dealer", "hrms"];
    allButtons.forEach(btn => {
        const el = document.getElementById('menu-' + btn);
        if (access === "all" || access.includes(btn)) {
            el.style.display = "block";
        } else {
            el.style.display = "none";
        }
    });
    // Default tab kholna
    showModule(access === "all" ? "billing" : access[0]);
}

function showModule(modId) {
    document.querySelectorAll('.module').forEach(m => m.style.display = 'none');
    document.querySelectorAll('.sidebar button').forEach(b => b.classList.remove('active'));
    
    document.getElementById(modId + '-module').style.display = 'block';
    document.getElementById('menu-' + modId).classList.add('active');
}

// 3. SMART BILLING & INVENTORY UPDATE
function updateTotal() {
    const rate = parseFloat(document.getElementById('prod_select').value) || 0;
    const qty = parseFloat(document.getElementById('qty').value) || 0;
    
    const taxable = rate * qty;
    const gst = taxable * 0.18;
    const total = taxable + gst;
    
    document.getElementById('rate_display').innerText = rate;
    document.getElementById('taxable_display').innerText = taxable.toFixed(2);
    document.getElementById('gst_display').innerText = gst.toFixed(2);
    document.getElementById('grand_total').innerText = total.toFixed(2);
}

async function processInvoice() {
    const data = {
        action: "ADD_SALE_AND_REDUCE_STOCK", // Special command for Inventory
        type: "GST_INVOICE",
        item: document.getElementById('prod_select').options[document.getElementById('prod_select').selectedIndex].text,
        qty: document.getElementById('qty').value,
        amount: document.getElementById('grand_total').innerText,
        user: document.getElementById('username').value
    };

    try {
        await fetch(WEB_APP_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
        alert("✅ Bill Saved! Inventory updated in Google Sheet.");
    } catch(e) { alert("Sync Error!"); }
}
