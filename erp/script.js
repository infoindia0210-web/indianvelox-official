// 1. AKfycbxo4D_xIvTblGC1pJ7YFdLWmhG6WTAwtHwV1VYFfKl3UVdT8SH9ZAa9kHUjLXMiGACh
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxQZZ__RSxgRBaFjLn8gBCRtY4cLxrQR25PJlAgGFAr9sqW0-fHPVVqBmwFMF6yWRiV/exec";

// 2. YE RHE SARE ID AUR PASSWORD (AB SAB KAAM KARENGE)
const USER_ROLES = {
    "admin": { pw: "velox@admin", access: "all" },
    "accounts": { pw: "velox@acc", access: ["billing", "inventory"] },
    "hr": { pw: "velox@hr", access: ["hrms"] },
    "dealer_01": { pw: "velox123", access: ["dealer"] }
};

// 3. LOGIN LOGIC (CONNECTING ROLES)
function handleLogin() {
    const u = document.getElementById('username').value.toLowerCase(); // Chote aksharon mein check karega
    const p = document.getElementById('password').value;

    if (USER_ROLES[u] && USER_ROLES[u].pw === p) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('erp-dashboard').style.display = 'flex';
        
        // Jo ID hai uske hisab se buttons dikhao
        const myAccess = USER_ROLES[u].access;
        const allButtons = ["billing", "inventory", "hrms", "dealers"];
        
        allButtons.forEach(btn => {
            const el = document.querySelector(`button[onclick="showModule('${btn}')"]`);
            if (el) {
                if (myAccess === "all" || myAccess.includes(btn)) {
                    el.style.display = "block";
                } else {
                    el.style.display = "none";
                }
            }
        });
        
        // Pehla available module kholo
        showModule(myAccess === "all" ? "billing" : myAccess[0]);
        alert("Welcome " + u.toUpperCase());
    } else {
        alert("Wrong ID or Password! Sahi details dalein.");
    }
}

// 4. MODULE SWITCHER
function showModule(id) {
    document.querySelectorAll('.module').forEach(m => m.style.display = 'none');
    const target = document.getElementById(id + '-module');
    if (target) target.style.display = 'block';
}

// 5. BILLING CALCULATION
function updateTotal() {
    const rate = document.getElementById('prod_select').value;
    const qty = document.getElementById('qty').value || 0;
    const total = (rate * qty * 1.18).toFixed(2); // 18% GST Included
    document.getElementById('grand_total').innerText = total;
}

// 6. MASTER SAVE FUNCTION (CONNECTS TO GOOGLE SHEET)
async function saveData(actionType) {
    let payload = { 
        action: actionType, 
        user: document.getElementById('username').value 
    };

    if(actionType === 'ADD_SALE') {
        payload.item = document.getElementById('prod_select').options[document.getElementById('prod_select').selectedIndex].text;
        payload.qty = document.getElementById('qty').value;
        payload.amount = document.getElementById('grand_total').innerText;
    } else if(actionType === 'ADD_STAFF') {
        payload.name = document.getElementById('s_name').value;
        payload.role = document.getElementById('s_role').value;
        payload.salary = document.getElementById('s_sal').value;
    } else if(actionType === 'ADD_DEALER') {
        payload.dealerName = document.getElementById('d_name').value;
        payload.location = document.getElementById('d_loc').value;
        payload.phone = document.getElementById('d_phone').value;
    } else if(actionType === 'ADD_PRODUCT') {
        payload.itemName = document.getElementById('p_name').value;
        payload.initialStock = document.getElementById('p_stock').value;
    }

    try {
        // "no-cors" isliye taki Google security block na kare
        await fetch(WEB_APP_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
        alert("✅ Data Successfully Synced to Indian Velox Cloud!");
        location.reload(); 
    } catch(e) { 
        alert("❌ Error: Connection Failed!"); 
    }
}
