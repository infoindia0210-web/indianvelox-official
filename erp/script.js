// AAKHRI CONFIGURATION - Indian Velox ERP
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxQZZ__RSxgRBaFjLn8gBCRtY4cLxrQR25PJlAgGFAr9sqW0-fHPVVqBmwFMF6yWRiV/exec";

const USER_ROLES = {
    "admin": { pw: "velox@admin", dept: "Management", access: "all" },
    "accounts": { pw: "velox@acc", dept: "Billing & GST", access: ["billing", "inventory"] },
    "hr": { pw: "velox@hr", dept: "HRMS", access: ["hrms"] },
    "dealer_01": { pw: "velox123", dept: "Bhopal Dealer", access: ["dealer"] }
};

// --- LOGIN SYSTEM ---
function handleLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;

    if (USER_ROLES[u] && USER_ROLES[u].pw === p) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('erp-dashboard').style.display = 'block';
        document.getElementById('display-user').innerText = "User: " + u;
        document.getElementById('dept-tag').innerText = USER_ROLES[u].dept;
        restrictAccess(USER_ROLES[u].access);
    } else {
        alert("Invalid ID or Password!");
    }
}

function restrictAccess(access) {
    const modules = ["billing", "inventory", "dealer", "hrms"];
    modules.forEach(m => {
        const btn = document.getElementById('menu-' + m);
        if (access === "all" || access.includes(m)) {
            btn.style.display = "block";
        } else {
            btn.style.display = "none";
        }
    });
    showModule(access === "all" ? "billing" : access[0]);
}

function showModule(modId) {
    document.querySelectorAll('.module').forEach(m => m.style.display = 'none');
    document.querySelectorAll('.sidebar button').forEach(b => b.classList.remove('active'));
    document.getElementById(modId + '-module').style.display = 'block';
    document.getElementById('menu-' + modId).classList.add('active');
}

// --- BILLING & SMART INVENTORY LOGIC ---
function updateTotal() {
    const select = document.getElementById('prod_select');
    const rate = parseFloat(select.value) || 0;
    const qty = parseFloat(document.getElementById('qty').value) || 0;
    
    document.getElementById('rate_display').innerText = rate;
    
    const taxable = rate * qty;
    const gst = taxable * 0.18;
    const total = taxable + gst;
    
    document.getElementById('taxable_display').innerText = taxable.toFixed(2);
    document.getElementById('subtotal').innerText = taxable.toFixed(2); // for subtotal display
    document.getElementById('gst_display').innerText = gst.toFixed(2);
    document.getElementById('grand_total').innerText = total.toFixed(2);
}

async function processInvoice() {
    const select = document.getElementById('prod_select');
    const productName = select.options[select.selectedIndex].text.split(' (')[0];
    
    const data = {
        action: "ADD_SALE_AND_REDUCE_STOCK",
        user: document.getElementById('username').value,
        item: productName,
        qty: document.getElementById('qty').value,
        amount: document.getElementById('grand_total').innerText,
        type: "GST_INVOICE"
    };

    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(data)
        });
        alert("✅ Success: Bill Saved & Stock Updated in Sheet!");
    } catch (error) {
        alert("❌ Sync Failed! Check Internet Connection.");
    }
}
