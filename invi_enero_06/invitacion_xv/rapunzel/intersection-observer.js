// Función para manejar la animación de los elementos timeline
function handleTimelineAnimation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-timeline-item');
        observer.unobserve(entry.target); // Dejar de observar después de animar
      }
    });
  }, {
    threshold: 0.1 // Activar cuando al menos 10% del elemento es visible
  });

  // Observar todos los timeline-items
  document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
  });
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', handleTimelineAnimation);
