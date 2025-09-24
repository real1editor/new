// In your app.js, update the contact form handler:
document.getElementById("contactForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  // Simple client-side validation
  if (!data.name || !data.email || !data.message) {
    alert("Please fill in all required fields.");
    return;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    alert("Please enter a valid email address.");
    return;
  }
  
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (result.ok) {
      alert("✅ Message sent! I'll get back to you soon.");
      form.reset();
    } else {
      alert(`⚠️ Error: ${result.error || 'There was an error sending your message.'}`);
    }
  } catch(err) { 
    alert("⚠️ Network error. Please check your connection and try again."); 
    console.error(err); 
  }
});  document.body.classList.add("light-mode");
  themeIcon.classList.remove("fa-moon");
  themeIcon.classList.add("fa-sun");
}

// Sticky Navbar
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    navbar.style.padding = "10px 0";
    navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
  } else {
    navbar.style.padding = "15px 0";
    navbar.style.boxShadow = "none";
  }
});

// Populate portfolio
const portfolioGrid = document.getElementById("portfolioGrid");
PORTFOLIO.forEach((item, index) => {
  const portfolioItem = document.createElement("div");
  portfolioItem.className = "portfolio-item";
  portfolioItem.setAttribute("data-category", item.category);
  portfolioItem.innerHTML = `
    <div class="portfolio-image">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
    </div>
    <div class="portfolio-info">
      <h3>${item.title}</h3>
      <p>Click to view this project on the respective platform.</p>
      <span class="portfolio-category">${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
    </div>
  `;
  
  // Add animation delay based on index
  portfolioItem.style.animationDelay = `${0.3 + index * 0.1}s`;
  
  portfolioItem.addEventListener("click", () => {
    window.open(item.url, "_blank");
  });
  
  portfolioGrid.appendChild(portfolioItem);
});

// Portfolio Filter
const filterButtons = document.querySelectorAll(".filter-btn");
let portfolioItems = document.querySelectorAll(".portfolio-item");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove("active"));
    
    // Add active class to clicked button
    button.classList.add("active");
    
    // Get filter value
    const filterValue = button.getAttribute("data-filter");
    
    // Filter portfolio items
    portfolioItems.forEach(item => {
      if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
        item.style.display = "block";
        setTimeout(() => {
          item.style.opacity = "1";
          item.style.transform = "translateY(0)";
        }, 100);
      } else {
        item.style.opacity = "0";
        item.style.transform = "translateY(20px)";
        setTimeout(() => {
          item.style.display = "none";
        }, 300);
      }
    });
  });
});

// Scroll Animation
const animatedElements = document.querySelectorAll('.feature-card, .service-card, .testimonial-card, .portfolio-item');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, {
  threshold: 0.1
});

animatedElements.forEach(element => {
  element.style.opacity = '0';
  element.style.transform = 'translateY(30px)';
  element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(element);
});

// Form Submissions
document.getElementById("contactForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  // Simple client-side validation
  if (!data.name || !data.email || !data.message) {
    alert("Please fill in all required fields.");
    return;
  }
  
  try {
    // For demo purposes - in production, replace with actual API endpoint
    console.log("Contact form submitted:", data);
    
    // Simulate API call
    setTimeout(() => {
      alert("✅ Message sent! I'll get back to you soon.");
      form.reset();
    }, 1000);
  } catch(err) { 
    alert("⚠️ There was an error sending your message. Please try again."); 
    console.error(err); 
  }
});

document.getElementById("feedbackForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  if (!data.message) {
    alert("Please provide your feedback message.");
    return;
  }
  
  try {
    // For demo purposes - in production, replace with actual API endpoint
    console.log("Feedback form submitted:", data);
    
    // Simulate API call
    setTimeout(() => {
      alert("✅ Feedback sent! Thank you for your input.");
      form.reset();
    }, 1000);
  } catch(err) { 
    alert("⚠️ There was an error sending your feedback. Please try again."); 
    console.error(err); 
  }
});

// Newsletter Form
document.querySelector(".newsletter-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector('input[type="email"]').value;
  
  if (!email) {
    alert("Please enter your email address.");
    return;
  }
  
  try {
    // Simulate subscription
    setTimeout(() => {
      alert("✅ Thank you for subscribing to our newsletter!");
      form.reset();
    }, 1000);
  } catch(err) { 
    alert("⚠️ There was an error with your subscription. Please try again."); 
    console.error(err); 
  }
});

// Back to top button
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    backToTopButton.classList.add("visible");
  } else {
    backToTopButton.classList.remove("visible");
  }
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Initialize animations on page load
document.addEventListener("DOMContentLoaded", function() {
  // Refresh portfolio items after DOM is loaded
  portfolioItems = document.querySelectorAll(".portfolio-item");
  
  // Animate hero elements
  const heroElements = document.querySelectorAll(".hero-content h1, .slogan, .hero-buttons");
  heroElements.forEach((el, index) => {
    el.style.animationDelay = `${0.5 + index * 0.3}s`;
  });
});
