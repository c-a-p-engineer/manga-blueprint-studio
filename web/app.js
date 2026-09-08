// Zero-build runtime bootstrap. Feature code is split into classic scripts so GitHub Pages can serve it directly.
const scripts = ['./app-1.js', './app-2.js', './app-3.js', './app-4.js', './app-5.js', './app-6.js', './app-7.js', './app-8.js', './app-9.js', './app-10.js', './app-11.js', './app-12.js'];

for (const src of scripts) {
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}