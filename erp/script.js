const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxQZZ__RSxgRBaFjLn8gBCRtY4cLxrQR25PJlAgGFAr9sqW0-fHPVVqBmwFMF6yWRiV/exec";

function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    // Admin password: velox@admin, Dealer password: dealer@123
    if((user === "admin" && pass === "velox@admin") || (user === "dealer" && pass === "dealer@123")) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('erp-dashboard').style.display = 'flex';
        document.getElementById('display-user').innerText = "Logged in: " + user;
    } else { alert("Invalid Credentials!"); }
}

function showModule(id) {
    document.querySelectorAll('.module').forEach(m => m.style.display = 'none');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id + '-module').style.display = 'block';
    event.currentTarget.classList.add('active');
}

function updateTotal() {
    const rate = parseFloat(document.getElementById('prod_select').value) || 0;
    const qty = parseFloat(document.getElementById('qty').value) || 0;
    const subtotal = rate * qty;
    const gst = subtotal * 0.18;
    const grand = subtotal + gst;

    document.getElementById('rate_val').innerText = rate;
    document.getElementById('gst_val').innerText = gst.toFixed(2);
    document.getElementById('total_val').innerText = grand.toFixed(2);
    document.getElementById('sub_total').innerText = subtotal.toFixed(2);
    document.getElementById('tax_total').innerText = gst.toFixed(2);
    document.getElementById('grand_total').innerText = grand.toFixed(2);
}

async function processInvoice() {
    const data = {
        user: "Admin",
        item: document.getElementById('prod_select').options[document.getElementById('prod_select').selectedIndex].text,
        qty: document.getElementById('qty').value,
        amount: document.getElementById('grand_total').innerText,
        action: "ADD_SALE_AND_REDUCE_STOCK"
    };
    try {
        await fetch(WEB_APP_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
        alert("✅ Bill Saved & Inventory Updated!");
    } catch(e) { alert("Error Syncing!"); }
}
