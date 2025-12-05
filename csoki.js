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
    const fileName = 'csokibolt.txt';
    const chocolateList = [];
    const listContainer = document.getElementById('chocolateList');
    listContainer.innerHTML = 'A fájl tartalmának feldolgozása...';

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
            if (parts.length === 3) {
                // Létrehozzuk az új Csoki objektumot
                const csoki = new Csoki(parts[0], parts[1], parts[2]);
                chocolateList.push(csoki);
            }
        });
                // 3. Eredmények kiírása és megjelenítése
                console.log("A Csoki objektumok listája:");
                console.log(chocolateList);
                
                listContainer.innerHTML = '';

                if (chocolateList.length > 0) {
                    chocolateList.forEach((csoki , index) => {
//                        const listItem = document.createElement('li');
//                        listItem.textContent = csoki.toString();
//                        displayList.appendChild(listItem);

                        const div = document.createElement('div');
                        div.className = 'chocolate-item';
                        
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.id = `csoki-${index}`;
                        checkbox.name = 'chocolate';
                        checkbox.value = csoki.toString(); // Értéknek beállítjuk az objektum leírását
                        
                        const label = document.createElement('label');
                        label.htmlFor = `csoki-${index}`;
                        label.textContent = csoki.toString(); // A szöveg a labelben jelenik meg
                        
                        div.appendChild(checkbox);
                        div.appendChild(label);
                        listContainer.appendChild(div);

                    });
                    console.log(`Sikeresen betöltve ${chocolateList.length} csoki.`)
                } else {
                    displayList.innerHTML = '<div>A fájl betöltődött, de nem tartalmazott feldolgozható adatot.</div>';
                }

            } catch (error) {
                console.error("Hiba történt a fájl betöltése vagy feldolgozása során:", error);
                displayList.innerHTML = `<div>Hiba: ${error.message}</div>`;
            }
        }

    // ----------------------------------------------------
    // 3. FELDOLGOZÁS ÉS OBJEKTUMOK LÉTREHOZÁSA
    // ----------------------------------------------------
    const csokiObjects = [];
    const lines = rawData.split('\n');

    lines.forEach(line => {
        const parts = line.split(';');
        if (parts.length === 4) {
            // Létrehozzuk a Csoki objektumot az adatokból
            const csoki = new Csoki(parts[0], parts[1], parts[2], parts[3]);
            csokiObjects.push(csoki);
        }
    });

    // ----------------------------------------------------
    // 4. MEGJELENÍTÉS ÉS MOZAIK KIALAKÍTÁSA
    // ----------------------------------------------------
    const container = document.getElementById('csoki-list-container');

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