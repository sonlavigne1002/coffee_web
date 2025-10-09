// 1. Smooth Scroll for Anchor Links (Nav Links AND Menu Tabs)
document.querySelectorAll('a[href^="#"]').forEach(link => { 
    link.addEventListener("click", function(e) {
        const targetId = this.getAttribute('href'); 
        
        if (targetId.startsWith('#') && targetId.length > 1) {
            e.preventDefault();
            const targetElement = document.getElementById(targetId.slice(1));
            
            if (targetElement) {
                // កំណត់ Offset ដើម្បីជៀសវាង Header (Fixed Navbar)
                const headerHeight = document.querySelector('header')?.offsetHeight || 70;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight; 

                window.scrollTo({
                    top: targetPosition, 
                    behavior: 'smooth' 
                });
                
                const menuTabLinks = document.querySelectorAll('.menu-tab-link');

                if (menuTabLinks.length > 0) {
                    // លុប style Active ចេញពី tabs ទាំងអស់
                    menuTabLinks.forEach(tab => {
                        tab.classList.remove('text-[#A0583C]', 'border-[#A0583C]', 'font-semibold');
                        tab.classList.add('text-gray-500', 'border-transparent', 'font-medium');
                    });

                    // ដាក់ style Active ទៅលើ tab ដែលបានចុច
                    this.classList.add('text-[#A0583C]', 'border-[#A0583C]', 'font-semibold');
                    this.classList.remove('text-gray-500', 'border-transparent', 'font-medium');
                }
            }
        }
    });
});

// 2. Sticky Navbar Shadow
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (header) { 
      if (window.scrollY > 50) {
        header.classList.add("bg-[#A0583C]", "shadow-xl"); 
        header.classList.remove("backdrop-blur-md", "bg-[#A0583C]/90", "bg-transparent");
      } else {
        header.classList.remove("bg-[#A0583C]", "shadow-xl");
        header.classList.add("bg-transparent"); 
      }
  }
});

// 3. Active Section Highlight on Scroll
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav a");
const offset = 100;

window.addEventListener("scroll", () => {
  let currentSection = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - offset; 

    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("text-yellow-300");
    if (link.getAttribute("href") === `#${currentSection}` && currentSection !== "") { 
      link.classList.add("text-yellow-300");
    }
  });
});

// 4. Fade-in on Scroll (Intersection Observer)
const fadeElements = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.getAttribute('data-delay') || '0');
      
      setTimeout(() => {
        entry.target.classList.add("opacity-100", "translate-y-0");
      }, delay); 
      
      observer.unobserve(entry.target); 
    }
  });
}, { threshold: 0.2 });

fadeElements.forEach(el => {
  el.classList.add(
    "opacity-0",
    "translate-y-5",
    "transition-all",
    "duration-700",
    "ease-in-out"
  );
  observer.observe(el);
});

// 4. Staggered Fade-in Animation 
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        const delay = element.getAttribute('data-delay') || 0; 
        
        setTimeout(() => {
            element.classList.add('animate-reveal'); 
        }, parseInt(delay));
    });
});

// 5. Back to Top Button (Smooth Fade-in/Fade-out)
const topBtn = document.createElement("button");
topBtn.innerHTML = "↑";
topBtn.className = "fixed bottom-6 right-6 opacity-0 bg-[#A0583C] text-white w-10 h-10 rounded-full text-xl shadow-lg hover:bg-[#8B452B] transition-opacity duration-300 ease-in-out p-0"; 
document.body.appendChild(topBtn);

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    topBtn.classList.add("opacity-100");
    topBtn.classList.remove("opacity-0");
  } else {
    topBtn.classList.remove("opacity-100");
    topBtn.classList.add("opacity-0");
  }
});

topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===============================
// Cart Management Logic
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  // === CART DATA & SELECTORS ===
  let cartItems = [];
  const cartContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const checkoutButton = document.getElementById("checkout-btn");

  // === ADD TO CART FUNCTION ===
function addItemToCart(event) {
    const button = event.target.closest('button');
    if (!button) return;

    // ប្រើ dataset ដើម្បីទាញយកឈ្មោះ និងតម្លៃពី Button
    const itemName = button.dataset.name; 
    const itemPrice = parseFloat(button.dataset.price); 

    if (!itemName || isNaN(itemPrice)) {
        console.error('Error: Item name or price is missing/invalid on the button.', button);
        return;
    }

    const existingItem = cartItems.find(item => item.name === itemName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ name: itemName, price: itemPrice, quantity: 1 });
    }

    updateCartUI(); 
    // scrollToCart(); // Disable scrolling to cart for better UX, keep it smooth.
}

  // === UPDATE CART UI (Render the items and total) ===
  function updateCartUI() {
    if (!cartContainer || !cartTotalElement) return;

    cartContainer.innerHTML = "";

    if (cartItems.length === 0) {
      cartContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="text-gray-500 mb-8">Cart is empty. Add menu items.</p>
      `;
      cartTotalElement.textContent = "$0.00";
      return;
    }

    cartItems.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "flex justify-between items-center bg-white shadow-md rounded-lg p-3 mb-2";

      div.innerHTML = `
        <div>
          <p class="font-semibold">${item.name}</p>
          <p class="text-sm text-gray-600">$${item.price.toFixed(2)} x ${item.quantity}</p>
        </div>
        <div class="flex gap-2">
          <button class="decrease-btn bg-gray-200 px-2 rounded text-lg font-bold hover:bg-gray-300 transition-colors">-</button>
          <button class="increase-btn bg-gray-200 px-2 rounded text-lg font-bold hover:bg-gray-300 transition-colors">+</button>
          <button class="remove-btn text-red-500 text-sm font-medium hover:text-red-700 transition-colors">Remove</button>
        </div>
      `;

      // Add button listeners
      div.querySelector(".decrease-btn").addEventListener("click", () => changeQuantity(index, -1));
      div.querySelector(".increase-btn").addEventListener("click", () => changeQuantity(index, 1));
      div.querySelector(".remove-btn").addEventListener("click", () => removeItem(index));

      cartContainer.appendChild(div);
    });

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
  }

  // === CHANGE QUANTITY ===
  function changeQuantity(index, amount) {
    cartItems[index].quantity += amount;
    if (cartItems[index].quantity <= 0) {
      cartItems.splice(index, 1);
    }
    updateCartUI();
  }

  // === REMOVE ITEM ===
  function removeItem(index) {
    cartItems.splice(index, 1);
    updateCartUI();
  }

  // === CHECKOUT BUTTON ===
  if (checkoutButton) {
    checkoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (cartItems.length > 0) {
        const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
        alert(`✅ Proceeding to checkout:\n${cartItems.length} items\nTotal: $${total.toFixed(2)}`);
      } else {
        alert("🛒 Your cart is empty!");
      }
    });
  }

  // === ADD BUTTON LISTENERS ===
  const addButtons = document.querySelectorAll(".menu-item-card button");
  addButtons.forEach((btn) => btn.addEventListener("click", addItemToCart));

  // === SAFE MODAL HANDLING (Modal logic removed as it's not present in HTML) ===
  // ទុកវាចោល ព្រោះមិនមាន modal ក្នុង order.html ទេ។
});