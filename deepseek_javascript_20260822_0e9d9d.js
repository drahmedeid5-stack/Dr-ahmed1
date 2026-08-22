// ========== إرسال الحجز إلى Google Sheets ==========
const API_URL = 'https://script.google.com/macros/s/.../exec'; // 👈 حط الرابط اللي خدته من الخطوة السابقة هنا

async function submitBooking(e) {
  e.preventDefault();

  // 1. جمع البيانات من النموذج
  const branch = document.getElementById('branch');
  const branchName = branch.value;
  const branchPhone = branch.options[branch.selectedIndex].getAttribute('data-phone');
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const notes = document.getElementById('notes').value.trim();

  // 2. التحقق من الحقول المطلوبة
  if (!branchName || !date || !time || !name || !phone) {
    alert('يرجى ملء جميع الحقول المطلوبة.');
    return;
  }

  // 3. تنسيق التاريخ والوقت
  const dateObj = new Date(date + 'T' + time);
  const formattedDate = dateObj.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = dateObj.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

  // 4. بناء بيانات الحجز
  const bookingData = {
    branch: branchName,
    date: formattedDate,
    time: formattedTime,
    name: name,
    phone: phone,
    notes: notes
  };

  // 5. إرسال البيانات إلى Google Sheets
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors', // مهم عشان نتجاوز مشكلة CORS
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    console.log('✅ تم تسجيل الحجز في Google Sheets');
  } catch (error) {
    console.error('❌ خطأ في الإرسال إلى Google Sheets:', error);
  }

  // 6. فتح واتساب (نفس الكود القديم)
  let message = `مرحباً، أريد حجز موعد في فرع ${branchName}:\n`;
  message += `📅 التاريخ: ${formattedDate}\n`;
  message += `⏰ الوقت: ${formattedTime}\n`;
  message += `👤 الاسم: ${name}\n`;
  message += `📞 رقم الهاتف: ${phone}\n`;
  if (notes) {
    message += `📝 ملاحظات: ${notes}\n`;
  }
  message += `\nشكراً!`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${branchPhone}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');

  alert('✅ تم تسجيل حجزك وإرسال رسالة إلى واتساب.');
}