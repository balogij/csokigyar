    class Csoki {
        constructor(_id, tipus, tomeg, csomagolas, rendelt_db) {
            this._id = parseInt(_id.trim());
            this.tipus = tipus.trim().toLowerCase();
            this.tomeg =  parseInt(tomeg.trim());
            this.csomagolas = csomagolas.trim().toLowerCase();
            this.rendelt_db = parseInt(rendelt_db.trim())
        }
        
        // Segédfüggvény a megjelenítéshez
        getTipusDisplay() {
            if (this.tipus === 'ét') return 'Étcsokoládé';
            if (this.tipus === 'tej') return 'Tejcsokoládé';
            if (this.tipus === 'fehér') return 'Fehér csokoládé';
            return 'Ismeretlen';
        }
        
        // Segédfüggvény a Bootstrap class nevéhez
        getCardClass() {
            return `card-${this.tipus}`;
        }
    }



    async function loadChocolatesFromFile() {
        const csokiObjects = [];
        const fileName = 'csokibolt.txt';
        const container = document.getElementById('csoki-list-container');
        container.innerHTML = 'A fájl tartalmának feldolgozása...';

        try {
            // Fetch API hívás a fájl tartalmának lekérésére a tárhelyről
            const response = await fetch(fileName);

            // Ellenőrizzük, hogy a kérés sikeres volt-e (pl. 404-et nem kapott)
            if (!response.ok) {
                throw new Error(`HTTP hiba! Status: ${response.status} - Lehetséges, hogy a fájl (${fileName}) nem található.`);
            }

            // Kiolvassuk a fájl tartalmát szövegként
            const fileContent = await response.text();
            
            // Feldolgozzuk a szöveget soronként
            const lines = fileContent.trim().split('\n');

            lines.forEach(line => {
                const parts = line.split(';');
                if (parts.length === 5) {
                    // Létrehozzuk a Csoki objektumot az adatokból
                    const csoki = new Csoki(parts[0], parts[1], parts[2], parts[3], parts[4]);
                    csokiObjects.push(csoki);
                }
            });

            if(csokiObjects.length>0){
                container.innerHTML = '';
                // 2. A JavaScript objektumot/tömböt JSON stringgé alakítjuk
                const listAsJsonString = JSON.stringify(csokiObjects);

                // 3. Eltároljuk a LocalStorage-ban egy kulcs (pl. 'productList') alatt
                localStorage.setItem('csokiList', listAsJsonString);

                console.log("A lista sikeresen elmentve a LocalStorage-ba.");                
            }

            csokiObjects.forEach(csoki => {
                // Létrehozzuk az oszlopot (Bootstrap grid elem)
                const colDiv = document.createElement('div');
                // 'col' minden méretben, de a 'row-cols-xl-5' (vagy row-cols-5) beállítja a fő 5 oszlopot
                colDiv.classList.add('col'); 
                
                // Létrehozzuk a kártya tartalmát
                colDiv.innerHTML = `
                    <div class="card h-100 csoki-card p-3 ${csoki.getCardClass()}">
                        <h5 class="card-title text-uppercase fw-bold" id="my_h5">${csoki.getTipusDisplay()}</h5>
                        <hr>
                        <ul class="list-unstyled">
                            <li class="my_li"><strong>Súly:</strong> ${csoki.tomeg}g</li>
                            <li class="my_li"><strong>Csomagolás:</strong> ${csoki.csomagolas.charAt(0).toUpperCase() + csoki.csomagolas.slice(1)}</li>
                        </ul>
                    </div>
                `;

                    // Hozzáadjuk a kártyát a fő konténerhez
                    container.appendChild(colDiv);
            });

            // 5x4 = 20 elemnek kell lennie. Ellenőrzés:
            console.log(`Feldolgozott elemek száma: ${csokiObjects.length}. A rács 5x4-es kialakítású (Bootstrap row-cols-5).`);    

        } catch (error) {
            console.error("Hiba történt a fájl betöltése vagy feldolgozása során:", error);
            container.innerHTML = `<div>Hiba: ${error.message}</div>`;
        }
    }

    async function handleFavorite() {
        const container = document.getElementById('csoki-list-container');
        container.innerHTML = 'A fájl tartalmának feldolgozása...';
        // 1. Lekérjük a JSON stringet a LocalStorage-ból
        const storedListString = localStorage.getItem('csokiList');

        let csokiObjects = [];

        // 2. Ellenőrizzük, hogy létezik-e az adat, és nem üres-e
        if (storedListString) {
            // 3. Visszaalakítjuk JavaScript objektummá/tömbbé
            csokiObjects = JSON.parse(storedListString);
            console.log("A lista sikeresen betöltve a LocalStorage-ból:");
            console.log(csokiObjects);
        } else {
            // Ha még soha nem volt tárolva, használjuk az eredeti betöltési logikát (pl. fájlból)
            console.log("Nincs tárolt lista. Betöltés a fájlból...");
            // Ide jön a fájlból való betöltés kódja
        }

        if(csokiObjects.length>0){
            container.innerHTML = '';
            csokik = [];
            csokiObjects.forEach(tarolt => {
                const csoki = new Csoki(tarolt[0], tarolt[1], tarolt[2], tarolt[3], tarolt[4]);
                csokik.push(csoki);
            })
        }
        const sortedByRendeles = csokik.sort((a, b) => b.rendelt_db - a.rendelt_db);
        const threeLargestByRendelés = sortedByRendeles.slice(0, 3);

        threeLargestByRendelés.forEach(csoki => {
            // Létrehozzuk az oszlopot (Bootstrap grid elem)
            const colDiv = document.createElement('div');
            // 'col' minden méretben, de a 'row-cols-xl-5' (vagy row-cols-5) beállítja a fő 5 oszlopot
            colDiv.classList.add('col'); 
            
            // Létrehozzuk a kártya tartalmát
            colDiv.innerHTML = `
                <div class="card h-100 csoki-card p-3 ${csoki.getCardClass()}">
                    <h5 class="card-title text-uppercase fw-bold" id="my_h5">${csoki.getTipusDisplay()}</h5>
                    <hr>
                    <ul class="list-unstyled">
                        <li class="my_li"><strong>Súly:</strong> ${csoki.tomeg}g</li>
                        <li class="my_li"><strong>Csomagolás:</strong> ${csoki.csomagolas.charAt(0).toUpperCase() + csoki.csomagolas.slice(1)}</li>
                    </ul>
                </div>
            `;

            // Hozzáadjuk a kártyát a fő konténerhez
            container.appendChild(colDiv);
        });        
    }

    function handleDarkChocolate() {
        const container = document.getElementById('csoki-list-container');
        container.innerHTML = 'A fájl tartalmának feldolgozása...';
        const storedListString = localStorage.getItem('csokiList');

        let csokiObjects = [];

        if (storedListString) {
            csokiObjects = JSON.parse(storedListString);
            console.log("A lista sikeresen betöltve a LocalStorage-ból:");
            console.log(csokiObjects);
        } else {
            console.log("Nincs tárolt lista. Betöltés a fájlból...");
        }

        if(csokiObjects.length>0){
            container.innerHTML = '';
            csokik = [];
            csokiObjects.forEach(tarolt => {
                const csoki = new Csoki(tarolt[0], tarolt[1], tarolt[2], tarolt[3], tarolt[4]);
                csokik.push(csoki);
            })
        }
        const etcsokik = csokik.filter(termek => termek.tipus === 'ét');

        etsokik.forEach(csoki => {
            // Létrehozzuk az oszlopot (Bootstrap grid elem)
            const colDiv = document.createElement('div');
            // 'col' minden méretben, de a 'row-cols-xl-5' (vagy row-cols-5) beállítja a fő 5 oszlopot
            colDiv.classList.add('col'); 
            
            // Létrehozzuk a kártya tartalmát
            colDiv.innerHTML = `
                <div class="card h-100 csoki-card p-3 ${csoki.getCardClass()}">
                    <h5 class="card-title text-uppercase fw-bold" id="my_h5">${csoki.getTipusDisplay()}</h5>
                    <hr>
                    <ul class="list-unstyled">
                        <li class="my_li"><strong>Súly:</strong> ${csoki.tomeg}g</li>
                        <li class="my_li"><strong>Csomagolás:</strong> ${csoki.csomagolas.charAt(0).toUpperCase() + csoki.csomagolas.slice(1)}</li>
                    </ul>
                </div>
            `;

            // Hozzáadjuk a kártyát a fő konténerhez
            container.appendChild(colDiv);
        });        
    }

    function handleMilkChocolate() {
        const container = document.getElementById('csoki-list-container');
        container.innerHTML = 'A fájl tartalmának feldolgozása...';
        const storedListString = localStorage.getItem('csokiList');

        let csokiObjects = [];

        if (storedListString) {
            csokiObjects = JSON.parse(storedListString);
            console.log("A lista sikeresen betöltve a LocalStorage-ból:");
            console.log(csokiObjects);
        } else {
            console.log("Nincs tárolt lista. Betöltés a fájlból...");
        }

        if(csokiObjects.length>0){
            container.innerHTML = '';
            csokik = [];
            csokiObjects.forEach(tarolt => {
                const csoki = new Csoki(tarolt[0], tarolt[1], tarolt[2], tarolt[3], tarolt[4]);
                csokik.push(csoki);
            })
        }
        const tejcsokik = csokik.filter(termek => termek.tipus === 'tej');

        tejcsokik.forEach(csoki => {
            // Létrehozzuk az oszlopot (Bootstrap grid elem)
            const colDiv = document.createElement('div');
            // 'col' minden méretben, de a 'row-cols-xl-5' (vagy row-cols-5) beállítja a fő 5 oszlopot
            colDiv.classList.add('col'); 
            
            // Létrehozzuk a kártya tartalmát
            colDiv.innerHTML = `
                <div class="card h-100 csoki-card p-3 ${csoki.getCardClass()}">
                    <h5 class="card-title text-uppercase fw-bold" id="my_h5">${csoki.getTipusDisplay()}</h5>
                    <hr>
                    <ul class="list-unstyled">
                        <li class="my_li"><strong>Súly:</strong> ${csoki.tomeg}g</li>
                        <li class="my_li"><strong>Csomagolás:</strong> ${csoki.csomagolas.charAt(0).toUpperCase() + csoki.csomagolas.slice(1)}</li>
                    </ul>
                </div>
            `;

            // Hozzáadjuk a kártyát a fő konténerhez
            container.appendChild(colDiv);
        });        
    }

    function handleWhiteChocolate() {
        const container = document.getElementById('csoki-list-container');
        container.innerHTML = 'A fájl tartalmának feldolgozása...';
        const storedListString = localStorage.getItem('csokiList');

        let csokiObjects = [];

        if (storedListString) {
            csokiObjects = JSON.parse(storedListString);
            console.log("A lista sikeresen betöltve a LocalStorage-ból:");
            console.log(csokiObjects);
        } else {
            console.log("Nincs tárolt lista. Betöltés a fájlból...");
        }

        if(csokiObjects.length>0){
            container.innerHTML = '';
            csokik = [];
            csokiObjects.forEach(tarolt => {
                const csoki = new Csoki(tarolt[0], tarolt[1], tarolt[2], tarolt[3], tarolt[4]);
                csokik.push(csoki);
            })
        }
        const fehercsokik = csokik.filter(termek => termek.tipus === 'fehér');

        fehercsokik.forEach(csoki => {
            // Létrehozzuk az oszlopot (Bootstrap grid elem)
            const colDiv = document.createElement('div');
            // 'col' minden méretben, de a 'row-cols-xl-5' (vagy row-cols-5) beállítja a fő 5 oszlopot
            colDiv.classList.add('col'); 
            
            // Létrehozzuk a kártya tartalmát
            colDiv.innerHTML = `
                <div class="card h-100 csoki-card p-3 ${csoki.getCardClass()}">
                    <h5 class="card-title text-uppercase fw-bold" id="my_h5">${csoki.getTipusDisplay()}</h5>
                    <hr>
                    <ul class="list-unstyled">
                        <li class="my_li"><strong>Súly:</strong> ${csoki.tomeg}g</li>
                        <li class="my_li"><strong>Csomagolás:</strong> ${csoki.csomagolas.charAt(0).toUpperCase() + csoki.csomagolas.slice(1)}</li>
                    </ul>
                </div>
            `;

            // Hozzáadjuk a kártyát a fő konténerhez
            container.appendChild(colDiv);
        });        
    }



