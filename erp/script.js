function updateTotal() {
    const rate = document.getElementById('prod_select').value;
    const qty = document.getElementById('qty').value || 0;
    
    const subtotal = rate * qty;
    const gst = subtotal * 0.18;
    const total = subtotal + gst;
    
    document.getElementById('subtotal').innerText = subtotal.toFixed(2);
    document.getElementById('gst_amt').innerText = gst.toFixed(2);
    document.getElementById('grand_total').innerText = total.toFixed(2);
}

// Baki purana login aur sendToCloud logic niche rahega...
