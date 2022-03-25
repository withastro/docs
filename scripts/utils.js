document.getElementById("install-quick").addEventListener("click", () => {
    document.getElementById("quick").classList.remove("hidden-toggle");
    document.getElementById("manual").classList.add("hidden-toggle");
    document.getElementById("install-quick").classList.add("active-toggle");
    document.getElementById("install-manual").classList.remove("active-toggle");
  
  });
  
  document.getElementById("install-manual").addEventListener("click", () => {
    document.getElementById("manual").classList.remove("hidden-toggle");
    document.getElementById("quick").classList.add("hidden-toggle");
    document.getElementById("install-manual").classList.add("active-toggle");
    document.getElementById("install-quick").classList.remove("active-toggle");
    
  });