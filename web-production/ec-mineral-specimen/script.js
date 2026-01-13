function updateLight(e, element) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    element.style.setProperty('--x', `${x}px`);
    element.style.setProperty('--y', `${y}px`);
}
