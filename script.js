/* =========================
   MOBILE NAV TOGGLE
   - Opens / closes menu on phone
   - Closes when any link is clicked (so page changes cleanly)
========================= */
(function () {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    links.classList.toggle('open');
    // animate hamburger
    const spans = toggle.querySelectorAll('span');
    if (links.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close menu when a nav link is clicked (important for mobile page switch)
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      const spans = toggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });
})();

/* =========================
   CONTACT FORM — Google Sheets + OTP
   (same logic as your original)
========================= */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const scriptURL =
    'https://script.google.com/macros/s/AKfycby0VvHRRFLWIUeKDR-YhBr7WPQXBG3HSwhs75_2G5KmtGA1LmZGTJXzbrOzCGVMlZecAg/exec';

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const project = document.getElementById('project').value;
    const message = document.getElementById('message').value;

    try {
      Swal.fire({
        title: 'Sending OTP...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      await fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'sendOtp',
          email: email
        })
      });

      Swal.close();

      const { value: otp } = await Swal.fire({
        title: 'Email Verification',
        text: 'Enter 4-digit OTP sent to your email',
        input: 'text',
        inputPlaceholder: 'Enter OTP',
        confirmButtonText: 'Verify',
        allowOutsideClick: false
      });

      if (!otp) return;

      Swal.fire({
        title: 'Verifying...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'verifyOtp',
          name: name,
          email: email,
          project: project,
          message: message,
          otp: otp
        })
      });

      const result = await response.json();
      Swal.close();

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Verified!',
          text: 'Message sent successfully'
        });
        form.reset();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Invalid OTP',
          text: 'Please try again'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong'
      });
    }
  });
})();
