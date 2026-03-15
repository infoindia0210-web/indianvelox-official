const WEB_APP_URL = "AKfycbxo4D_xIvTblGC1pJ7YFdLWmhG6WTAwtHwV1VYFfKl3UVdT8SH9ZAa9kHUjLXMiGACh";

function handleLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    if(u === "admin" && p === "velox@admin") {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('erp-dashboard').style.display = 'flex';
    } else { alert("Invalid Credentials"); }
}

function showModule(id) {
    document.querySelectorAll('.module').forEach(m => m.style.display = 'none');
    document.getElementById(id + '-module').style.display = 'block';
}

function updateTotal() {
    const rate = document.getElementById('prod_select').value;
    const qty = document.getElementById('qty').value || 0;
    document.getElementById('grand_total').innerText = (rate * qty * 1.18).toFixed(2);
}

async function saveData(actionType) {
    let payload = { action: actionType, user: "Admin" };

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
        await fetch(WEB_APP_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
        alert("✅ Data Synced Successfully!");
        location.reload(); 
    } catch(e) { alert("Error!"); }
}
