// ===== Smooth scroll menu =====
document.querySelectorAll('nav a').forEach(anchor=>{
  anchor.addEventListener('click',function(e){
    const target=document.querySelector(this.getAttribute('href'));
    if(target) target.scrollIntoView({behavior:'smooth'});
  });
});

// ===== Contact form =====
const form=document.querySelector('form');
if(form){
  form.addEventListener('submit', e=>{
    e.preventDefault();
    alert('Cảm ơn bạn đã liên hệ! Mình sẽ phản hồi sớm.');
    form.reset();
  });
}

//========Book list===================//
const trigger = document.getElementById('booksTrigger');
const booksList = document.getElementById('booksList');

trigger.addEventListener('click', () => {
  booksList.classList.toggle('show');
  // scroll danh sách vào view khi mở
  if (booksList.classList.contains('show')) {
    booksList.scrollIntoView({ behavior: 'smooth' });
  }
});
