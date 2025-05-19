  document.getElementById('model-upload').addEventListener('change', function(e) {
            const fileName = e.target.files[0] ? e.target.files[0].name : 'Ningún modelo cargado';
            document.getElementById('model-info').textContent = 'Modelo cargado: ' + fileName;
            document.getElementById('model-info').className = 'text-xs text-center text-white/80 mt-2';
            
            // Simulamos cambios en las barras de coincidencia
            if (e.target.files[0]) {
                // Generamos valores aleatorios para simular resultados
                const values = [
                    Math.floor(Math.random() * 100),
                    Math.floor(Math.random() * 80),
                    Math.floor(Math.random() * 60),
                    Math.floor(Math.random() * 40),
                    Math.floor(Math.random() * 20)
                ];
                
                // Actualizamos las barras
                for (let i = 1; i <= 5; i++) {
                    document.getElementById('percentage-' + i).textContent = values[i-1] + '%';
                    document.getElementById('bar-' + i).style.width = values[i-1] + '%';
                }
            }
        });
        
        // Simulación de activación de cámara
        document.getElementById('camera-toggle').addEventListener('click', function() {
            const placeholder = document.getElementById('camera-placeholder');
            
            if (this.textContent === 'Activar Cámara') {
                placeholder.innerHTML = '<p class="text-white/80 text-lg">Cámara activada</p>';
                this.textContent = 'Desactivar Cámara';
                this.classList.add('border-red-300', 'text-red-300');
                this.classList.remove('border-white/70', 'text-white/90');
            } else {
                placeholder.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p class="text-white/50 mt-2">Cámara no activada</p>
                `;
                this.textContent = 'Activar Cámara';
                this.classList.remove('border-red-300', 'text-red-300');
                this.classList.add('border-white/70', 'text-white/90');
            }
        });