// Zero-build runtime bootstrap. Feature code is split into classic scripts so GitHub Pages can serve it directly.
const scripts = ['./app-1.js', './app-2.js', './app-3.js', './app-4.js', './app-5.js', './app-6.js', './app-7.js', './app-8.js', './app-9.js', './app-10.js', './app-11.js', './app-12.js', './app-13.js', './app-14.js', './app-15.js', './app-16.js', './app-17.js', './app-18.js', './app-19.js', './app-20.js', './app-21.js', './app-22.js', './app-23.js', './app-24.js', './app-25.js', './app-26.js', './app-27.js', './app-28.js', './app-29.js'];

for (const src of scripts) {
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}
